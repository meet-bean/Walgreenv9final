import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardTitle, CardHeader, CardDescription } from './design-system/Card';
import { FlatCard } from './design-system/FlatCard';
import { Badge } from './design-system/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { Progress } from './design-system/Progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ChevronRight, Home, Minus, BarChart3 } from 'lucide-react';
import { TaskTile } from './TaskTile';
import { ChartHeader } from './ChartHeader';
import { HierarchicalPerformanceTable } from './HierarchicalPerformanceTable';
import { SitePerformanceMap } from './SitePerformanceMap';
import { DynamicRankings } from './DynamicRankings';
import { PerformancePieChart } from './PerformancePieChart';
import { Button } from './design-system/Button';
import { OverviewTilesSkeleton, ChartSkeleton, TableSkeleton } from './SkeletonLoaders';
import { BuilderPreviewWrapper } from './BuilderPreviewWrapper';
import {
  DashboardDefinition,
  DashboardSection,
  getSiteById,
  getJobFunctionsBySite,
  getMetricsBySiteAndDateRange,
  getMetricsByDateRange,
  getAvailableDateRange,
  getTasksByJobFunction,
  tasks,
  sites,
  jobFunctions as allJobFunctions,
  DailyMetrics,
} from '../lib/mockData';
import { SavedReportSection } from '../lib/sectionDefinitions';

interface DashboardRendererProps {
  dashboard: DashboardDefinition;
  siteId?: string; // For site-specific dashboards
  jobFunctionId?: string; // For supervisor dashboards
  allowEditing?: boolean;
  onEditSection?: (sectionId: string) => void;
  previewRole?: 'vp' | 'site-manager' | 'supervisor'; // For role toggle in preview
  showTitle?: boolean; // Whether to show the dashboard title in the header
  builderMode?: boolean; // Whether we're in the builder (shows configure buttons)
  onConfigureMetricTile?: (sectionId: string) => void; // Callback to configure metric tile
  hideFilters?: boolean; // Hide the global filters (used when rendering individual sections in builder preview)
  hideDescription?: boolean; // Hide section descriptions/subtitles
  rawSectionMode?: boolean; // Render just the section content without wrappers (for grid-based builder preview)
  inlineEditMode?: boolean; // Whether we're in inline edit mode (editing live on the dashboard)
  onDashboardChange?: (dashboard: DashboardDefinition) => void; // Callback when dashboard changes in inline edit mode
  onSectionClick?: (section: DashboardSection) => void; // Callback when a section is clicked (for layer inspector)
  externalFilters?: {
    startDate?: Date | null;
    endDate?: Date | null;
    showUnderperformingOnly?: boolean;
  }; // External filters from builder preview
}

type AggregationMode = 'daily' | 'weekly' | 'monthly' | 'total';

export function DashboardRenderer({ 
  dashboard, 
  siteId, 
  jobFunctionId,
  allowEditing = false,
  onEditSection,
  builderMode = false,
  onConfigureMetricTile,
  previewRole,
  showTitle = false,
  hideFilters = false,
  hideDescription = false,
  rawSectionMode = false,
  inlineEditMode = false,
  onDashboardChange,
  onSectionClick,
  externalFilters
}: DashboardRendererProps) {
  const dateRange = getAvailableDateRange();
  
  const [startDate, setStartDate] = useState(() => {
    if (externalFilters?.startDate) {
      return externalFilters.startDate.toISOString().split('T')[0];
    }
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    if (externalFilters?.endDate) {
      return externalFilters.endDate.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  
  const [aggregation, setAggregation] = useState<AggregationMode>('total');
  const [showUnderperformingOnly, setShowUnderperformingOnly] = useState(
    externalFilters?.showUnderperformingOnly ?? dashboard.filters?.showUnderperformingOnly ?? false
  );
  const [selectedSiteId, setSelectedSiteId] = useState(siteId || sites[0]?.id);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initial data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Brief loading state for better UX
    return () => clearTimeout(timer);
  }, [dashboard.id, startDate, endDate, selectedSiteId]);
  
  // Sync with external filters from builder preview
  useEffect(() => {
    if (externalFilters?.startDate) {
      setStartDate(externalFilters.startDate.toISOString().split('T')[0]);
    }
    if (externalFilters?.endDate) {
      setEndDate(externalFilters.endDate.toISOString().split('T')[0]);
    }
    if (externalFilters?.showUnderperformingOnly !== undefined) {
      setShowUnderperformingOnly(externalFilters.showUnderperformingOnly);
    }
  }, [externalFilters?.startDate, externalFilters?.endDate, externalFilters?.showUnderperformingOnly]);
  
  // Sync showUnderperformingOnly state with dashboard filters
  useEffect(() => {
    if (!externalFilters) {
      setShowUnderperformingOnly(dashboard.filters?.showUnderperformingOnly ?? false);
    }
  }, [dashboard.filters?.showUnderperformingOnly, externalFilters]);
  
  // State for hierarchical drill-down in Overview Tiles
  const [drillDownPath, setDrillDownPath] = useState<{
    siteId?: string;
    siteName?: string;
    jobFunctionId?: string;
    jobFunctionName?: string;
  }>({});

  // State for Performance Trend drill-down
  const [trendDrillDown, setTrendDrillDown] = useState<{
    siteId?: string;
    siteName?: string;
    jobFunctionId?: string;
    jobFunctionName?: string;
  }>({});

  // State for Hours Chart drill-down
  const [hoursDrillDown, setHoursDrillDown] = useState<{
    siteId?: string;
    siteName?: string;
    jobFunctionId?: string;
    jobFunctionName?: string;
  }>({});

  // State for Task Distribution Pie drill-down
  const [pieDrillDown, setPieDrillDown] = useState<{
    siteId?: string;
    siteName?: string;
    jobFunctionId?: string;
    jobFunctionName?: string;
  }>({});

  // Get data based on context
  const contextMetrics = useMemo(() => {
    // Use previewRole if provided (for design preview mode), otherwise use actual role context
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    let metrics: DailyMetrics[] = [];
    
    if (effectiveRole === 'supervisor' && jobFunctionId) {
      // Supervisor context - filter by job function
      metrics = getMetricsByDateRange(startDate, endDate).filter(m => m.jobFunctionId === jobFunctionId);
    } else if (effectiveRole === 'site-manager' && siteId) {
      // Site manager context
      metrics = getMetricsBySiteAndDateRange(siteId, startDate, endDate);
    } else if (selectedSiteId && dashboard.filters?.allowSiteFilter) {
      // VP with site filter
      metrics = getMetricsBySiteAndDateRange(selectedSiteId, startDate, endDate);
    } else {
      // VP viewing all sites
      metrics = getMetricsByDateRange(startDate, endDate);
    }
    
    // Apply underperforming filter if enabled
    if (showUnderperformingOnly) {
      metrics = metrics.filter(m => m.performance !== null && m.performance < 95);
    }
    
    return metrics;
  }, [startDate, endDate, siteId, jobFunctionId, selectedSiteId, dashboard.filters, previewRole, showUnderperformingOnly]);

  // Render single metric tile
  const renderMetricTile = (section: DashboardSection) => {
    const config = (section as any).metricTileConfig;
    
    if (!config) {
      return (
        <div style={{ display: 'inline-block' }}>
          <Card className="card-kpi-placeholder">
            <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
              <div className="dashboard-empty-icon">📊</div>
              <p style={{ color: 'var(--color-foreground)' }}>Metric Tile</p>
              <p className="dashboard-empty-description">Not Configured</p>
              {builderMode && onConfigureMetricTile && (
                <Button
                  onClick={() => onConfigureMetricTile(section.id)}
                  size="sm"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--color-chart-5), var(--color-chart-1))' }}
                >
                  <BarChart3 size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Configure
                </Button>
              )}
            </div>
          </Card>
        </div>
      );
    }

    // Get the display value
    let displayValue = '—';
    
    if (config.dataSource === 'custom') {
      displayValue = config.customValue || '—';
    } else if (config.dataSource === 'system' && config.systemMetric) {
      // Calculate system metric value
      const metricsWithData = contextMetrics.filter(m => m.performance !== null);
      
      switch (config.systemMetric) {
        case 'total-performance':
        case 'avg-performance':
          if (metricsWithData.length > 0) {
            const avgPerf = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
            displayValue = `${avgPerf.toFixed(1)}%`;
          } else {
            displayValue = 'N/A';  // Match KPI Cards behavior when no data
          }
          break;
        case 'total-hours':
          const totalHours = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
          displayValue = totalHours.toLocaleString('en-US', { maximumFractionDigits: 0 });
          break;
        case 'active-staff':
          displayValue = '42'; // Mock value
          break;
        case 'tasks-completed':
          displayValue = metricsWithData.length.toString();
          break;
        case 'revenue':
          displayValue = '$' + (contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0) * 25).toLocaleString('en-US', { maximumFractionDigits: 0 });
          break;
        case 'cost-savings':
          const savings = contextMetrics.reduce((sum, m) => {
            const saved = (m.expectedHours - (m.actualHours || 0)) * 25;
            return sum + (saved > 0 ? saved : 0);
          }, 0);
          displayValue = '$' + savings.toLocaleString('en-US', { maximumFractionDigits: 0 });
          break;
        case 'efficiency-rate':
          const totalExpected = contextMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
          const totalActual = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
          const efficiency = totalExpected > 0 ? (totalExpected / totalActual) * 100 : 0;
          displayValue = `${efficiency.toFixed(1)}%`;
          break;
        case 'completion-rate':
          const completionRate = contextMetrics.length > 0 
            ? (metricsWithData.length / contextMetrics.length) * 100 
            : 0;
          displayValue = `${completionRate.toFixed(1)}%`;
          break;
        case 'quality-score':
          displayValue = '8.7'; // Mock value
          break;
        default:
          displayValue = '—';
      }
    }

    // Color theme styles
    const colorStyles: Record<string, React.CSSProperties> = {
      blue: { backgroundColor: 'var(--color-state-info-light)', borderColor: 'var(--color-chart-1)' },
      green: { backgroundColor: 'var(--color-state-success-light)', borderColor: 'var(--color-chart-2)' },
      purple: { backgroundColor: 'rgba(168, 85, 247, 0.1)', borderColor: 'var(--color-chart-5)' },
      orange: { backgroundColor: 'var(--color-state-warning-light)', borderColor: 'var(--color-chart-3)' },
      red: { backgroundColor: 'var(--color-state-error-light)', borderColor: 'var(--color-chart-4)' },
    };

    const trendColorStyles: Record<string, React.CSSProperties> = {
      up: { color: 'var(--color-state-success)' },
      down: { color: 'var(--color-state-error)' },
      neutral: { color: 'var(--color-muted-foreground)' },
    };

    return (
      <div style={{ display: 'inline-block' }}>
        <Card className={`card-kpi card-kpi-${config.colorTheme || 'blue'}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                {config.icon && <span className="kpi-card-icon">{config.icon}</span>}
                <p className="kpi-card-label">{config.label}</p>
              </div>
              <p className="kpi-card-value">{displayValue}</p>
              {config.trend !== 'neutral' && config.trendValue && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-2)', ...trendColorStyles[config.trend || 'neutral'] }}>
                  {config.trend === 'up' ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span className="kpi-card-trend-icon">{config.trendValue}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Render saved sections from Section Builder
  const renderSavedSection = (section: DashboardSection) => {
    const savedSectionData = (section as any).savedSectionData as SavedReportSection | undefined;
    
    if (!savedSectionData || !savedSectionData.tiles || savedSectionData.tiles.length === 0) {
      return (
        <FlatCard>
          <ChartHeader 
            title={section.title} 
            description={!hideDescription ? section.description : undefined} 
          />
          <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
            <p>This saved section has no configured tiles.</p>
            <p className="section-error-message">This section may have been created incorrectly.</p>
          </div>
        </FlatCard>
      );
    }

    // Render tiles in a grid layout based on their positions
    const maxColumns = savedSectionData.layout?.columns || 12;
    
    return (
      <FlatCard>
        <ChartHeader 
          title={section.title} 
          description={!hideDescription ? section.description : undefined} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--spacing-4)' }}>
          {savedSectionData.tiles.map((tile, index) => {
            // Calculate grid column span based on tile width
            const colSpan = tile.position.w ? Math.min(tile.position.w, 12) : 6;
            
            return (
              <div key={tile.id || index} style={{ gridColumn: `span ${colSpan}` }}>
                {renderSavedTile(tile)}
              </div>
            );
          })}
        </div>
      </FlatCard>
    );
  };

  // Render individual tiles from saved sections
  const renderSavedTile = (tile: any) => {
    const config = tile.config || {};
    
    // Get sample data from contextMetrics
    const avgPerformance = contextMetrics.length > 0
      ? contextMetrics.reduce((sum, m) => sum + (m.performance || 0), 0) / contextMetrics.length
      : 0;
    const totalHours = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    
    // Render based on tile type
    switch (tile.type) {
      case 'kpi':
        return (
          <Card className="card-full-height">
            <p className="ds-card-description">{config.title || 'KPI'}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <p className="performance-overview-value">
                {config.systemMetric === 'performance' ? `${avgPerformance.toFixed(1)}%` : 
                 config.systemMetric === 'totalHours' ? totalHours.toFixed(0) :
                 config.customData ? config.customData.data?.[0]?.value || 'N/A' : 'N/A'}
              </p>
              {config.kpiConfig?.showComparison && (
                <div className="performance-overview-trend">
                  <TrendingUp size={12} />
                  <span>+5.2%</span>
                </div>
              )}
            </div>
          </Card>
        );
      
      case 'chart':
        if (tile.chartType === 'line' || tile.chartType === 'area') {
          // Line/Area chart
          const chartData = contextMetrics.slice(0, 7).map((m, i) => ({
            name: `Day ${i + 1}`,
            value: m.performance || 0,
            target: 90,
          }));
          
          const ChartComponent = tile.chartType === 'line' ? LineChart : BarChart;
          const DataComponent = tile.chartType === 'line' ? Line : Bar;
          
          return (
            <Card className="card-full-height">
              <CardTitle>{config.title}</CardTitle>
              <ResponsiveContainer width="100%" height={200}>
                <ChartComponent data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  {config.timeSeriesConfig?.showTarget && (
                    <ReferenceLine y={90} stroke="#666" strokeDasharray="3 3" />
                  )}
                  <DataComponent 
                    dataKey="value" 
                    fill="#3b82f6"
                    stroke="#3b82f6"
                  />
                </ChartComponent>
              </ResponsiveContainer>
            </Card>
          );
        } else if (tile.chartType === 'bar') {
          // Bar chart
          const chartData = contextMetrics.slice(0, 5).map((m, i) => ({
            name: `Item ${i + 1}`,
            value: m.performance || 0,
          }));
          
          return (
            <Card className="card-full-height">
              <CardTitle>{config.title}</CardTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} layout={config.barConfig?.orientation === 'horizontal' ? 'horizontal' : 'vertical'}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={config.barConfig?.orientation === 'horizontal' ? 'value' : 'name'} tick={{ fontSize: 12 }} />
                  <YAxis dataKey={config.barConfig?.orientation === 'horizontal' ? 'name' : 'value'} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          );
        } else if (tile.chartType === 'pie') {
          // Pie chart - would need recharts PieChart component
          return (
            <Card className="card-full-height">
              <CardTitle>{config.title}</CardTitle>
              <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                <p>Pie Chart</p>
                <p className="chart-placeholder-text">Pie chart rendering coming soon</p>
              </div>
            </Card>
          );
        }
        break;
      
      case 'table':
        const tableData = contextMetrics.slice(0, config.tableConfig?.rowsPerPage || 10);
        
        return (
          <Card className="card-full-height">
            <CardTitle>{config.title}</CardTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="table-cell-right">Performance</TableHead>
                  <TableHead className="table-cell-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>Item {i + 1}</TableCell>
                    <TableCell className="table-cell-right">{m.performance?.toFixed(1)}%</TableCell>
                    <TableCell className="table-cell-right">{m.actualHours?.toFixed(0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {config.tableConfig?.showTotals && (
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)' }}>
                <div className="chart-legend">
                  <span>Total</span>
                  <span>{totalHours.toFixed(0)} hrs</span>
                </div>
              </div>
            )}
          </Card>
        );
      
      default:
        return (
          <Card className="card-full-height">
            <CardTitle>{config.title || 'Tile'}</CardTitle>
            <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)', color: 'var(--color-muted-foreground)' }}>
              <p style={{ fontSize: 'var(--text-label)' }}>Unknown tile type: {tile.type}</p>
            </div>
          </Card>
        );
    }
    
    return null;
  };

  // Render configurable chart sections (line, bar, area, pie, combo)
  // Render individual section based on type
  const renderSection = (section: DashboardSection) => {
    switch (section.type) {
      case 'kpi-cards':
        return renderKPICards(section);
      case 'hours-chart':
        return renderHoursChart(section);
      case 'top-tasks':
        return renderTopTasks(section);
      case 'trend-chart':
        return renderTrendChart(section);
      case 'rankings':
        return renderRankings(section);
      case 'budget-tracking':
        return renderBudgetTracking(section);
      case 'hierarchical-performance':
        return renderHierarchicalPerformance(section);
      case 'site-map':
        return renderSiteMap(section);
      case 'custom-section':
        return renderCustomSection(section);
      case 'metric-tile':
        return renderMetricTile(section);
      case 'saved-section':
        return renderSavedSection(section);
      case 'task-distribution-pie':
        return renderTaskDistributionPie(section);
      case 'performance-pie-chart':
        return renderPieChart(section);
      default:
        return (
          <FlatCard>
            <ChartHeader title={section.title} />
            <p style={{ color: 'var(--color-muted-foreground)' }}>Section type not implemented: {section.type}</p>
          </FlatCard>
        );
    }
  };

  const renderTaskDistributionPie = (section: DashboardSection) => {
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    // Determine current drill-down level and aggregate data accordingly
    let pieData: any[] = [];
    let dataLabel = '';
    let currentLevel = '';
    let canDrillDown = false;
    
    // Determine drill-down level
    if (effectiveRole === 'vp') {
      if (!pieDrillDown.siteId) {
        // VP Level 1: Show sites
        dataLabel = 'Hours by Site';
        currentLevel = 'Company Level';
        canDrillDown = true;
        
        const siteGroups = new Map<string, { value: number; id: string }>();
        contextMetrics.forEach(m => {
          const site = sites.find(s => s.id === m.siteId);
          if (site) {
            const existing = siteGroups.get(site.name) || { value: 0, id: site.id };
            existing.value += (m.actualHours || 0);
            siteGroups.set(site.name, existing);
          }
        });
        pieData = Array.from(siteGroups.entries())
          .map(([name, data]) => ({ name, value: Math.round(data.value), id: data.id }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      } else if (!pieDrillDown.jobFunctionId) {
        // VP Level 2: Show job functions for selected site
        dataLabel = `Hours by Job Function (${pieDrillDown.siteName})`;
        currentLevel = pieDrillDown.siteName || '';
        canDrillDown = true;
        
        const filteredMetrics = contextMetrics.filter(m => m.siteId === pieDrillDown.siteId);
        const jfGroups = new Map<string, { value: number; id: string }>();
        filteredMetrics.forEach(m => {
          const jf = allJobFunctions.find(j => j.id === m.jobFunctionId);
          if (jf) {
            const existing = jfGroups.get(jf.name) || { value: 0, id: jf.id };
            existing.value += (m.actualHours || 0);
            jfGroups.set(jf.name, existing);
          }
        });
        pieData = Array.from(jfGroups.entries())
          .map(([name, data]) => ({ name, value: Math.round(data.value), id: data.id }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      } else {
        // VP Level 3: Show tasks for selected job function
        dataLabel = `Hours by Task (${pieDrillDown.jobFunctionName})`;
        currentLevel = `${pieDrillDown.siteName} > ${pieDrillDown.jobFunctionName}`;
        canDrillDown = false;
        
        const filteredMetrics = contextMetrics.filter(
          m => m.siteId === pieDrillDown.siteId && m.jobFunctionId === pieDrillDown.jobFunctionId
        );
        const taskGroups = new Map<string, { value: number; id: string }>();
        filteredMetrics.forEach(m => {
          const task = tasks.find(t => t.id === m.taskId);
          if (task) {
            const existing = taskGroups.get(task.name) || { value: 0, id: task.id };
            existing.value += (m.actualHours || 0);
            taskGroups.set(task.name, existing);
          }
        });
        pieData = Array.from(taskGroups.entries())
          .map(([name, data]) => ({ name, value: Math.round(data.value), id: data.id }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      }
    } else if (effectiveRole === 'site-manager') {
      if (!pieDrillDown.jobFunctionId) {
        // Site Manager Level 1: Show job functions
        dataLabel = 'Hours by Job Function';
        currentLevel = 'Site Level';
        canDrillDown = true;
        
        const jfGroups = new Map<string, { value: number; id: string }>();
        contextMetrics.forEach(m => {
          const jf = allJobFunctions.find(j => j.id === m.jobFunctionId);
          if (jf) {
            const existing = jfGroups.get(jf.name) || { value: 0, id: jf.id };
            existing.value += (m.actualHours || 0);
            jfGroups.set(jf.name, existing);
          }
        });
        pieData = Array.from(jfGroups.entries())
          .map(([name, data]) => ({ name, value: Math.round(data.value), id: data.id }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      } else {
        // Site Manager Level 2: Show tasks for selected job function
        dataLabel = `Hours by Task (${pieDrillDown.jobFunctionName})`;
        currentLevel = pieDrillDown.jobFunctionName || '';
        canDrillDown = false;
        
        const filteredMetrics = contextMetrics.filter(m => m.jobFunctionId === pieDrillDown.jobFunctionId);
        const taskGroups = new Map<string, { value: number; id: string }>();
        filteredMetrics.forEach(m => {
          const task = tasks.find(t => t.id === m.taskId);
          if (task) {
            const existing = taskGroups.get(task.name) || { value: 0, id: task.id };
            existing.value += (m.actualHours || 0);
            taskGroups.set(task.name, existing);
          }
        });
        pieData = Array.from(taskGroups.entries())
          .map(([name, data]) => ({ name, value: Math.round(data.value), id: data.id }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
      }
    } else {
      // Supervisor: Show tasks only (no drill-down)
      dataLabel = 'Hours by Task';
      currentLevel = 'Task Level';
      canDrillDown = false;
      
      const taskGroups = new Map<string, { value: number; id: string }>();
      contextMetrics.forEach(m => {
        const task = tasks.find(t => t.id === m.taskId);
        if (task) {
          const existing = taskGroups.get(task.name) || { value: 0, id: task.id };
          existing.value += (m.actualHours || 0);
          taskGroups.set(task.name, existing);
        }
      });
      pieData = Array.from(taskGroups.entries())
        .map(([name, data]) => ({ name, value: Math.round(data.value), id: data.id }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    }
    
    // Handle pie slice click for drill-down
    const handlePieClick = (data: any) => {
      if (!canDrillDown) return;
      
      if (effectiveRole === 'vp') {
        if (!pieDrillDown.siteId) {
          // Drilling from sites to job functions
          setPieDrillDown({ siteId: data.id, siteName: data.name });
        } else if (!pieDrillDown.jobFunctionId) {
          // Drilling from job functions to tasks
          setPieDrillDown({
            ...pieDrillDown,
            jobFunctionId: data.id,
            jobFunctionName: data.name
          });
        }
      } else if (effectiveRole === 'site-manager') {
        if (!pieDrillDown.jobFunctionId) {
          // Drilling from job functions to tasks
          setPieDrillDown({ jobFunctionId: data.id, jobFunctionName: data.name });
        }
      }
    };
    
    // Handle back navigation
    const handleBack = () => {
      if (pieDrillDown.jobFunctionId) {
        // Go back from tasks to job functions
        setPieDrillDown({ siteId: pieDrillDown.siteId, siteName: pieDrillDown.siteName });
      } else if (pieDrillDown.siteId) {
        // Go back from job functions to sites
        setPieDrillDown({});
      }
    };
    
    // Colors for pie chart segments
    const COLORS = [
      'var(--color-chart-1)',
      'var(--color-chart-2)',
      'var(--color-chart-3)',
      'var(--color-chart-4)',
      'var(--color-chart-5)',
      '#8b5cf6',
      '#ec4899',
      '#14b8a6'
    ];
    
    return (
      <FlatCard className="card-section-full">
        <ChartHeader
          title={section.title}
          description={!hideDescription ? section.description : undefined}
          currentLevel={currentLevel}
          drillDownHint={canDrillDown ? "Click any slice to drill down" : undefined}
          showBackButton={!!(pieDrillDown.siteId || pieDrillDown.jobFunctionId)}
          onBack={handleBack}
          metricValue="hours"
          onMetricChange={() => {}}
          metricOptions={[
            { value: 'hours', label: 'Actual Hours' },
            { value: 'volume', label: 'Volume' },
            { value: 'tasks', label: 'Task Count' }
          ]}
        />
        <div className="card-content-chart-flex">
          <Badge variant="outline" className="badge-info-spaced">
            {dataLabel}
          </Badge>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="var(--color-chart-1)"
                dataKey="value"
                onClick={handlePieClick}
                style={{ 
                  fontFamily: 'var(--font-family-inter)', 
                  fontSize: '11px',
                  cursor: canDrillDown ? 'pointer' : 'default'
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    style={{ cursor: canDrillDown ? 'pointer' : 'default' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  fontFamily: 'var(--font-family-inter)', 
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-popover)'
                }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-family-inter)' }}
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </FlatCard>
    );
  };

  const renderKPICards = (section: DashboardSection) => {
    // Check if this section has configured cards
    const configuredCards = (section as any).kpiCards as any[] | undefined;
    
    if (!configuredCards || configuredCards.length === 0) {
      // Show placeholder if no cards configured
      return (
        <FlatCard className="card-section-loading">
          <ChartHeader 
            title={section.title} 
            description={section.description} 
          />
          <div style={{ textAlign: 'center', color: 'var(--color-muted-foreground)' }}>
            <div style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--spacing-2)' }}>📊</div>
            <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-foreground)' }}>No KPI cards configured</p>
            <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-muted-foreground)', marginTop: 'var(--spacing-1)' }}>Click "Configure Data" to add metric cards</p>
          </div>
        </FlatCard>
      );
    }

    // Determine grid columns based on number of cards
    const cardCount = configuredCards.length;
    const gridCols = 
      cardCount === 1 ? '1fr' :
      cardCount === 2 ? 'repeat(auto-fit, minmax(250px, 1fr))' :
      cardCount === 3 ? 'repeat(auto-fit, minmax(200px, 1fr))' :
      'repeat(auto-fit, minmax(200px, 1fr))';

    // Helper to calculate metric values (reuse logic from renderMetricTile)
    const calculateMetricValue = (cardConfig: any): string => {
      let displayValue = '—';
      
      if (cardConfig.dataSource === 'custom') {
        displayValue = cardConfig.customValue || '—';
      } else if (cardConfig.dataSource === 'system' && cardConfig.systemMetric) {
        const metricsWithData = contextMetrics.filter(m => m.performance !== null);
        
        switch (cardConfig.systemMetric) {
          case 'total-performance':
          case 'avg-performance':
            if (metricsWithData.length > 0) {
              const avgPerf = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
              displayValue = `${avgPerf.toFixed(1)}%`;
            } else {
              displayValue = 'N/A';
            }
            break;
          case 'total-hours':
            const totalHours = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
            displayValue = totalHours.toLocaleString('en-US', { maximumFractionDigits: 0 });
            break;
          case 'active-staff':
            displayValue = '42'; // Mock value
            break;
          case 'tasks-completed':
            displayValue = metricsWithData.length.toString();
            break;
          case 'revenue':
            displayValue = '$' + (contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0) * 25).toLocaleString('en-US', { maximumFractionDigits: 0 });
            break;
          case 'cost-savings':
            const savings = contextMetrics.reduce((sum, m) => {
              const saved = (m.expectedHours - (m.actualHours || 0)) * 25;
              return sum + (saved > 0 ? saved : 0);
            }, 0);
            displayValue = '$' + savings.toLocaleString('en-US', { maximumFractionDigits: 0 });
            break;
          case 'efficiency-rate':
            const totalExpected = contextMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
            const totalActual = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
            const efficiency = totalExpected > 0 && totalActual > 0 ? (totalExpected / totalActual) * 100 : 0;
            displayValue = `${efficiency.toFixed(1)}%`;
            break;
          case 'completion-rate':
            const completionRate = contextMetrics.length > 0 
              ? (metricsWithData.length / contextMetrics.length) * 100 
              : 0;
            displayValue = `${completionRate.toFixed(1)}%`;
            break;
          case 'quality-score':
            displayValue = '8.7'; // Mock value
            break;
          default:
            displayValue = '—';
        }
      }
      
      return displayValue;
    };

    // Render configured cards
    return (
      <FlatCard className="card-section-kpi">
        <ChartHeader 
          title={section.title} 
          description={!hideDescription ? section.description : undefined} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 'var(--spacing-4)' }}>
            {configuredCards.map((cardConfig, index) => {
              const displayValue = calculateMetricValue(cardConfig);
              
              // Default trend/comparison if not set - show positive trend for demo
              const trend = cardConfig.trend || 'up';
              const trendValue = cardConfig.trendValue || '+5%';

              // Determine background and border color based on trend status
              // Use intense solid backgrounds with darker borders
              const getStatusColor = () => {
                if (trend === 'up') return 'rgb(34, 197, 94)'; // Solid green
                if (trend === 'down') return 'rgb(239, 68, 68)'; // Solid red
                return 'hsl(240, 5%, 96%)'; // Light gray for neutral
              };

              const getBorderColor = () => {
                if (trend === 'up') return 'rgb(21, 128, 61)'; // Darker green border
                if (trend === 'down') return 'rgb(220, 38, 38)'; // Darker red border
                return 'hsl(240, 6%, 90%)'; // Gray border
              };

              const getTextColor = () => {
                if (trend === 'up' || trend === 'down') return 'white'; // White text on colored backgrounds
                return 'var(--color-foreground)'; // Default text color for neutral
              };

              const getMutedTextColor = () => {
                if (trend === 'up' || trend === 'down') return 'rgba(255, 255, 255, 0.8)'; // Semi-transparent white
                return 'var(--color-muted-foreground)'; // Default muted text for neutral
              };

              return (
                <div 
                  key={index} 
                  style={{ 
                    padding: 'var(--spacing-3)', 
                    borderRadius: 'var(--radius-lg)', 
                    backgroundColor: getStatusColor(),
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <p style={{ 
                    fontFamily: 'var(--font-family-inter)',
                    fontSize: 'var(--text-label)',
                    color: getMutedTextColor(),
                    marginBottom: 'var(--spacing-1)'
                  }}>
                    {cardConfig.label}
                  </p>
                  <p style={{ 
                    fontFamily: 'var(--font-family-inter)',
                    fontSize: 'var(--text-h2)',
                    color: getTextColor(),
                    marginBottom: 'var(--spacing-1)'
                  }}>
                    {displayValue}
                  </p>
                  {/* Always show comparison */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-label)' }}>
                    {trend === 'up' ? (
                      <>
                        <TrendingUp size={12} style={{ color: 'white' }} />
                        <span style={{ color: 'white', fontFamily: 'var(--font-family-inter)' }}>{trendValue}</span>
                      </>
                    ) : trend === 'down' ? (
                      <>
                        <TrendingDown size={12} style={{ color: 'white' }} />
                        <span style={{ color: 'white', fontFamily: 'var(--font-family-inter)' }}>{trendValue}</span>
                      </>
                    ) : (
                      <>
                        <Minus size={12} style={{ color: 'var(--color-muted-foreground)' }} />
                        <span style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>{trendValue}</span>
                      </>
                    )}
                  </div>
                  {cardConfig.description && (
                    <p style={{ 
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-detail)',
                      color: 'var(--color-muted-foreground)',
                      marginTop: 'var(--spacing-1)'
                    }}>
                      {cardConfig.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
      </FlatCard>
    );
  };

  const renderTopTasks = (section: DashboardSection) => {
    // Determine effective role for hierarchical display
    // In preview mode, use previewRole. Otherwise, determine from user's actual context
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    if (effectiveRole === 'vp') {
      // Check if we're drilling down into a specific job function's tasks
      if (drillDownPath.jobFunctionId && drillDownPath.siteId) {
        const jfMetrics = contextMetrics.filter(m => 
          m.jobFunctionId === drillDownPath.jobFunctionId && 
          m.siteId === drillDownPath.siteId
        );
        
        // Extract unique task IDs from metrics (matching Performance Trend logic)
        const taskIds = Array.from(new Set(jfMetrics.map(m => m.taskId)));
        
        // Aggregate performance by task
        const taskPerformance = taskIds.map(taskId => {
          const task = tasks.find(t => t.id === taskId);
          if (!task) return null;
          
          const taskMetrics = jfMetrics.filter(m => m.taskId === taskId);
          const metricsWithData = taskMetrics.filter(m => m.actualVolume !== null && m.performance !== null);
          
          if (metricsWithData.length === 0) return null;
          
          const totalActualVolume = metricsWithData.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
          const totalBudgetedVolume = metricsWithData.reduce((sum, m) => sum + (m.budgetedVolume || 0), 0);
          const totalActualHours = metricsWithData.reduce((sum, m) => sum + (m.actualHours || 0), 0);
          const totalBudgetedHours = metricsWithData.reduce((sum, m) => sum + (m.budgetedHours || 0), 0);
          const avgPerformance = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
          const avgBudgetedRate = metricsWithData.reduce((sum, m) => sum + m.budgetedRate, 0) / metricsWithData.length;
          
          // Get job function name
          const jobFunctionName = (task.jobFunctionType.charAt(0).toUpperCase() + 
            task.jobFunctionType.slice(1).replace(/([A-Z])/g, ' $1')).trim();
          
          return {
            taskId,
            taskName: task.name,
            jobFunctionName,
            actualVolume: totalActualVolume,
            budgetedVolume: totalBudgetedVolume,
            actualHours: totalActualHours,
            budgetedHours: totalBudgetedHours,
            performance: avgPerformance,
            budgetedRate: avgBudgetedRate,
          };
        })
        .filter(t => t !== null)
        .sort((a, b) => (b!.performance || 0) - (a!.performance || 0));

        return (
          <FlatCard className="card-section-flex card-section-height">
            <ChartHeader 
              title={section.title} 
              description={section.description} 
            />
            <div className="card-content-flex-scroll">
              <div style={{ display: 'grid', gap: 'var(--spacing-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {taskPerformance.map((taskData) => {
                  if (!taskData) return null;

                  return (
                    <TaskTile
                      key={taskData.taskId}
                      taskName={taskData.taskName}
                      jobFunctionName={taskData.jobFunctionName}
                      actual={taskData.actualVolume}
                      budget={taskData.budgetedVolume}
                      rate={1 / taskData.budgetedRate}
                      actualHours={taskData.actualHours}
                      budgetedHours={taskData.budgetedHours}
                      performance={taskData.performance}
                    />
                  );
                })}
              </div>
              {taskPerformance.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                  <p>No completed process steps for the selected period.</p>
                </div>
              )}
            </div>
          </FlatCard>
        );
      }
      
      // Check if we're drilling down into a site's job functions
      if (drillDownPath.siteId) {
        // Extract unique job function IDs from metrics for this site (matching Performance Trend logic)
        const siteMetrics = contextMetrics.filter(m => m.siteId === drillDownPath.siteId);
        const jobFunctionIds = Array.from(new Set(siteMetrics.map(m => m.jobFunctionId)));
        
        const jobFunctionPerformance = jobFunctionIds.map(jfId => {
          const jf = allJobFunctions.find(jf => jf.id === jfId);
          if (!jf) return null;
          
          const jfMetrics = contextMetrics.filter(m => m.jobFunctionId === jfId);
          const metricsWithData = jfMetrics.filter(m => m.actualVolume !== null && m.performance !== null);
          const totalExpectedHours = jfMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
          const totalActualHours = jfMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
          const avgPerformance = metricsWithData.length > 0
            ? metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length
            : null;
          
          return {
            id: jf.id,
            name: jf.name,
            totalHours: totalActualHours,
            budgetedHours: totalExpectedHours,
            performance: avgPerformance,
          };
        })
        .filter(jf => jf !== null && jf.performance !== null)
        .sort((a, b) => (b!.performance || 0) - (a!.performance || 0));

        return (
          <FlatCard>
            <ChartHeader 
              title={section.title} 
              description={section.description}
              drillDownHint="Click on a job function to view tasks"
            />
            <div>
              <div style={{ display: 'grid', gap: 'var(--spacing-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {jobFunctionPerformance.map((jf) => (
                  <div
                    key={jf.id}
                    onClick={() => setDrillDownPath({
                      siteId: drillDownPath.siteId,
                      siteName: drillDownPath.siteName,
                      jobFunctionId: jf.id,
                      jobFunctionName: jf.name
                    })}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <TaskTile
                      taskName={jf.name}
                      actual={jf.totalHours}
                      budget={jf.budgetedHours}
                      rate={0.001}
                      actualHours={jf.totalHours}
                      budgetedHours={jf.budgetedHours}
                      performance={jf.performance || 0}
                    />
                  </div>
                ))}
              </div>
              {jobFunctionPerformance.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                  <p>No data available for job functions in the selected period.</p>
                </div>
              )}
            </div>
          </FlatCard>
        );
      }
      
      // Default VP view: Show Sites - Extract unique site IDs from metrics (matching Performance Trend logic)
      const siteIds = Array.from(new Set(contextMetrics.map(m => m.siteId)));
      
      const sitePerformance = siteIds.map(siteId => {
        const site = sites.find(s => s.id === siteId);
        if (!site) return null;
        
        const siteMetrics = contextMetrics.filter(m => m.siteId === siteId);
        const metricsWithData = siteMetrics.filter(m => m.actualVolume !== null && m.performance !== null);
        const totalExpectedHours = siteMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
        const totalActualHours = siteMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        const avgPerformance = metricsWithData.length > 0
          ? metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length
          : null;
        
        return {
          id: site.id,
          name: site.name,
          location: site.location,
          totalHours: totalActualHours,
          budgetedHours: totalExpectedHours,
          performance: avgPerformance,
        };
      })
      .filter(s => s !== null && s.performance !== null)
      .sort((a, b) => (b!.performance || 0) - (a!.performance || 0));

      return (
        <Card className="card-elevated">
          <ChartHeader 
            title={section.title} 
            description={section.description}
            drillDownHint="Click on a site to view job functions"
          />
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
              {sitePerformance.map((site) => (
                <div
                  key={site.id}
                  onClick={() => setDrillDownPath({ siteId: site.id, siteName: site.name })}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <TaskTile
                    taskName={site.name}
                    actual={site.totalHours}
                    budget={site.budgetedHours}
                    rate={0.001}
                    actualHours={site.totalHours}
                    budgetedHours={site.budgetedHours}
                    performance={site.performance || 0}
                  />
                </div>
              ))}
            </div>
            {sitePerformance.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                <p>No data available for sites in the selected period.</p>
              </div>
            )}
          </div>
        </Card>
      );
    } else if (effectiveRole === 'site-manager') {
      // Check if we're drilling down into a specific job function's tasks
      if (drillDownPath.jobFunctionId) {
        const jfMetrics = contextMetrics.filter(m => m.jobFunctionId === drillDownPath.jobFunctionId);
        
        // Extract unique task IDs from metrics (matching Performance Trend logic)
        const taskIds = Array.from(new Set(jfMetrics.map(m => m.taskId)));
        
        // Aggregate performance by task
        const taskPerformance = taskIds.map(taskId => {
          const task = tasks.find(t => t.id === taskId);
          if (!task) return null;
          
          const taskMetrics = jfMetrics.filter(m => m.taskId === taskId);
          const metricsWithData = taskMetrics.filter(m => m.actualVolume !== null && m.performance !== null);
          
          if (metricsWithData.length === 0) return null;
          
          const totalActualVolume = metricsWithData.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
          const totalBudgetedVolume = metricsWithData.reduce((sum, m) => sum + (m.budgetedVolume || 0), 0);
          const totalActualHours = metricsWithData.reduce((sum, m) => sum + (m.actualHours || 0), 0);
          const totalBudgetedHours = metricsWithData.reduce((sum, m) => sum + (m.budgetedHours || 0), 0);
          const avgPerformance = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
          const avgBudgetedRate = metricsWithData.reduce((sum, m) => sum + m.budgetedRate, 0) / metricsWithData.length;
          
          // Get job function name
          const jobFunctionName = (task.jobFunctionType.charAt(0).toUpperCase() + 
            task.jobFunctionType.slice(1).replace(/([A-Z])/g, ' $1')).trim();
          
          return {
            taskId,
            taskName: task.name,
            jobFunctionName,
            actualVolume: totalActualVolume,
            budgetedVolume: totalBudgetedVolume,
            actualHours: totalActualHours,
            budgetedHours: totalBudgetedHours,
            performance: avgPerformance,
            budgetedRate: avgBudgetedRate,
          };
        })
        .filter(t => t !== null)
        .sort((a, b) => (b!.performance || 0) - (a!.performance || 0));

        return (
          <FlatCard>
            <ChartHeader 
              title={section.title} 
              description={section.description} 
            />
            <div>
              <div style={{ display: 'grid', gap: 'var(--spacing-4)', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {taskPerformance.map((taskData) => {
                  if (!taskData) return null;

                  return (
                    <TaskTile
                      key={taskData.taskId}
                      taskName={taskData.taskName}
                      jobFunctionName={taskData.jobFunctionName}
                      actual={taskData.actualVolume}
                      budget={taskData.budgetedVolume}
                      rate={1 / taskData.budgetedRate}
                      actualHours={taskData.actualHours}
                      budgetedHours={taskData.budgetedHours}
                      performance={taskData.performance}
                    />
                  );
                })}
              </div>
              {taskPerformance.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                  <p>No completed process steps for the selected period.</p>
                </div>
              )}
            </div>
          </FlatCard>
        );
      }

      // Default Site Manager view: Show Job Functions - Extract unique job function IDs from metrics (matching Performance Trend logic)
      const jobFunctionIds = Array.from(new Set(contextMetrics.map(m => m.jobFunctionId)));
      
      const jobFunctionPerformance = jobFunctionIds.map(jfId => {
        const jf = allJobFunctions.find(jf => jf.id === jfId);
        if (!jf) return null;
        
        const jfMetrics = contextMetrics.filter(m => m.jobFunctionId === jfId);
        const metricsWithData = jfMetrics.filter(m => m.actualVolume !== null && m.performance !== null);
        const totalExpectedHours = jfMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
        const totalActualHours = jfMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        const avgPerformance = metricsWithData.length > 0
          ? metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length
          : null;
        
        return {
          id: jf.id,
          name: jf.name,
          totalHours: totalActualHours,
          budgetedHours: totalExpectedHours,
          performance: avgPerformance,
        };
      })
      .filter(jf => jf !== null && jf.performance !== null)
      .sort((a, b) => (b!.performance || 0) - (a!.performance || 0));

      return (
        <FlatCard>
          <ChartHeader 
            title={section.title} 
            description={section.description}
            drillDownHint="Click on a job function to view tasks"
          />
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
              {jobFunctionPerformance.map((jf) => (
                <div
                  key={jf.id}
                  onClick={() => setDrillDownPath({ jobFunctionId: jf.id, jobFunctionName: jf.name })}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <TaskTile
                    taskName={jf.name}
                    actual={jf.totalHours}
                    budget={jf.budgetedHours}
                    rate={0.001}
                    actualHours={jf.totalHours}
                    budgetedHours={jf.budgetedHours}
                    performance={jf.performance || 0}
                  />
                </div>
              ))}
            </div>
            {jobFunctionPerformance.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                <p>No data available for job functions in the selected period.</p>
              </div>
            )}
          </div>
        </FlatCard>
      );
    } else {
      // Supervisor: Show Tasks - Extract unique tasks and aggregate (matching Performance Trend logic)
      // Extract unique task IDs from metrics
      const taskIds = Array.from(new Set(contextMetrics.map(m => m.taskId)));
      
      // Aggregate performance by task
      const taskPerformance = taskIds.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return null;
        
        const taskMetrics = contextMetrics.filter(m => m.taskId === taskId);
        const metricsWithData = taskMetrics.filter(m => m.actualVolume !== null && m.performance !== null);
        
        if (metricsWithData.length === 0) return null;
        
        const totalActualVolume = metricsWithData.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
        const totalBudgetedVolume = metricsWithData.reduce((sum, m) => sum + (m.budgetedVolume || 0), 0);
        const totalActualHours = metricsWithData.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        const totalBudgetedHours = metricsWithData.reduce((sum, m) => sum + (m.budgetedHours || 0), 0);
        const avgPerformance = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
        const avgBudgetedRate = metricsWithData.reduce((sum, m) => sum + m.budgetedRate, 0) / metricsWithData.length;
        
        // Get job function name
        const jobFunctionName = (task.jobFunctionType.charAt(0).toUpperCase() + 
          task.jobFunctionType.slice(1).replace(/([A-Z])/g, ' $1')).trim();
        
        return {
          taskId,
          taskName: task.name,
          jobFunctionName,
          actualVolume: totalActualVolume,
          budgetedVolume: totalBudgetedVolume,
          actualHours: totalActualHours,
          budgetedHours: totalBudgetedHours,
          performance: avgPerformance,
          budgetedRate: avgBudgetedRate,
        };
      })
      .filter(t => t !== null)
      .sort((a, b) => (b!.performance || 0) - (a!.performance || 0));

      return (
        <FlatCard>
          <ChartHeader 
            title={section.title} 
            description={section.description} 
          />
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
              {taskPerformance.map((taskData) => {
                if (!taskData) return null;

                return (
                  <TaskTile
                    key={taskData.taskId}
                    taskName={taskData.taskName}
                    jobFunctionName={taskData.jobFunctionName}
                    actual={taskData.actualVolume}
                    budget={taskData.budgetedVolume}
                    rate={1 / taskData.budgetedRate}
                    actualHours={taskData.actualHours}
                    budgetedHours={taskData.budgetedHours}
                    performance={taskData.performance}
                  />
                );
              })}
            </div>
            {taskPerformance.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)', color: 'var(--color-muted-foreground)' }}>
                <p>No completed process steps for the selected period.</p>
              </div>
            )}
          </div>
        </FlatCard>
      );
    }
  };

  // Add state for metric selection in trend chart
  const [trendMetric, setTrendMetric] = React.useState<'performance' | 'hours' | 'volume'>('performance');
  
  // Add state for metric selection in hours chart
  const [hoursMetric, setHoursMetric] = React.useState<'performance' | 'hours' | 'volume' | 'budget'>('hours');

  const renderTrendChart = (section: DashboardSection) => {
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    // Filter metrics based on drill-down state
    let filteredMetrics = contextMetrics;
    if (trendDrillDown.jobFunctionId) {
      filteredMetrics = contextMetrics.filter(m => m.jobFunctionId === trendDrillDown.jobFunctionId);
    } else if (trendDrillDown.siteId) {
      filteredMetrics = contextMetrics.filter(m => m.siteId === trendDrillDown.siteId);
    }

    // Helper to calculate metric value based on selected metric type
    const calculateMetricValue = (metrics: DailyMetrics[]): number | null => {
      if (metrics.length === 0) return null;
      
      switch (trendMetric) {
        case 'performance':
          const withPerf = metrics.filter(m => m.performance !== null);
          if (withPerf.length === 0) return null;
          return withPerf.reduce((sum, m) => sum + (m.performance || 0), 0) / withPerf.length;
        
        case 'hours':
          return metrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        
        case 'volume':
          return metrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
        
        default:
          return null;
      }
    };

    // Group metrics by date first
    const dateGroups: { [date: string]: DailyMetrics[] } = {};
    filteredMetrics.forEach(m => {
      if (!dateGroups[m.date]) dateGroups[m.date] = [];
      dateGroups[m.date].push(m);
    });

    // Build drill-down data based on role and current drill-down state
    let trendData: any[] = [];
    let lineKeys: string[] = [];
    let lineMetadata: Array<{ key: string; id: string; type: 'site' | 'job-function' | 'task' }> = [];
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    if (effectiveRole === 'vp') {
      if (trendDrillDown.jobFunctionId) {
        // VP drilled down to job function level - show tasks
        const jfMetrics = filteredMetrics;
        const taskIds = Array.from(new Set(jfMetrics.map(m => m.taskId)));
        
        taskIds.forEach(taskId => {
          const task = tasks.find(t => t.id === taskId);
          const taskName = task?.name || taskId;
          lineKeys.push(taskName);
          lineMetadata.push({ key: taskName, id: taskId, type: 'task' });
        });

        trendData = Object.entries(dateGroups)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, dateMetrics]) => {
            const dataPoint: any = {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };
            
            taskIds.forEach(taskId => {
              const task = tasks.find(t => t.id === taskId);
              const taskName = task?.name || taskId;
              const taskMetrics = dateMetrics.filter(m => m.taskId === taskId);
              
              const value = calculateMetricValue(taskMetrics);
              if (value !== null) {
                dataPoint[taskName] = parseFloat(value.toFixed(1));
              }
            });
            
            return dataPoint;
          });
      } else if (trendDrillDown.siteId) {
        // VP drilled down to site level - show job functions
        const siteJobFunctions = allJobFunctions.filter(jf => jf.siteId === trendDrillDown.siteId);
        
        siteJobFunctions.forEach(jf => {
          lineKeys.push(jf.name);
          lineMetadata.push({ key: jf.name, id: jf.id, type: 'job-function' });
        });

        trendData = Object.entries(dateGroups)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, dateMetrics]) => {
            const dataPoint: any = {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };
            
            siteJobFunctions.forEach(jf => {
              const jfMetrics = dateMetrics.filter(m => m.jobFunctionId === jf.id);
              
              const value = calculateMetricValue(jfMetrics);
              if (value !== null) {
                dataPoint[jf.name] = parseFloat(value.toFixed(1));
              }
            });
            
            return dataPoint;
          });
      } else {
        // VP top level - show sites
        const siteIds = Array.from(new Set(contextMetrics.map(m => m.siteId)));
        
        siteIds.forEach(id => {
          const site = sites.find(s => s.id === id);
          const siteName = site?.name || id;
          lineKeys.push(siteName);
          lineMetadata.push({ key: siteName, id, type: 'site' });
        });

        trendData = Object.entries(dateGroups)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, dateMetrics]) => {
            const dataPoint: any = {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };
            
            siteIds.forEach(siteId => {
              const site = sites.find(s => s.id === siteId);
              const siteName = site?.name || siteId;
              const siteMetrics = dateMetrics.filter(m => m.siteId === siteId);
              
              const value = calculateMetricValue(siteMetrics);
              if (value !== null) {
                dataPoint[siteName] = parseFloat(value.toFixed(1));
              }
            });
            
            return dataPoint;
          });
      }
    } else if (effectiveRole === 'site-manager' && siteId) {
      if (trendDrillDown.jobFunctionId) {
        // Site Manager drilled down to job function - show tasks
        const jfMetrics = filteredMetrics;
        const taskIds = Array.from(new Set(jfMetrics.map(m => m.taskId)));
        
        taskIds.forEach(taskId => {
          const task = tasks.find(t => t.id === taskId);
          const taskName = task?.name || taskId;
          lineKeys.push(taskName);
          lineMetadata.push({ key: taskName, id: taskId, type: 'task' });
        });

        trendData = Object.entries(dateGroups)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, dateMetrics]) => {
            const dataPoint: any = {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };
            
            taskIds.forEach(taskId => {
              const task = tasks.find(t => t.id === taskId);
              const taskName = task?.name || taskId;
              const taskMetrics = dateMetrics.filter(m => m.taskId === taskId);
              
              const value = calculateMetricValue(taskMetrics);
              if (value !== null) {
                dataPoint[taskName] = parseFloat(value.toFixed(1));
              }
            });
            
            return dataPoint;
          });
      } else {
        // Site Manager top level - show job functions
        const jobFuncs = allJobFunctions.filter(jf => jf.siteId === siteId);
        
        jobFuncs.forEach(jf => {
          lineKeys.push(jf.name);
          lineMetadata.push({ key: jf.name, id: jf.id, type: 'job-function' });
        });

        trendData = Object.entries(dateGroups)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, dateMetrics]) => {
            const dataPoint: any = {
              date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            };
            
            jobFuncs.forEach(jf => {
              const jfMetrics = dateMetrics.filter(m => m.jobFunctionId === jf.id);
              
              const value = calculateMetricValue(jfMetrics);
              if (value !== null) {
                dataPoint[jf.name] = parseFloat(value.toFixed(1));
              }
            });
            
            return dataPoint;
          });
      }
    } else if (effectiveRole === 'supervisor' && jobFunctionId) {
      // Supervisor sees one line per task
      const supervisorMetrics = contextMetrics.filter(m => m.jobFunctionId === jobFunctionId);
      const taskIds = Array.from(new Set(supervisorMetrics.map(m => m.taskId)));
      
      taskIds.forEach(taskId => {
        const task = tasks.find(t => t.id === taskId);
        const taskName = task?.name || taskId;
        lineKeys.push(taskName);
        lineMetadata.push({ key: taskName, id: taskId, type: 'task' });
      });

      trendData = Object.entries(dateGroups)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, dateMetrics]) => {
          const dataPoint: any = {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          };
          
          taskIds.forEach(taskId => {
            const task = tasks.find(t => t.id === taskId);
            const taskName = task?.name || taskId;
            const taskMetrics = dateMetrics.filter(m => m.taskId === taskId);
            
            const value = calculateMetricValue(taskMetrics);
            if (value !== null) {
              dataPoint[taskName] = parseFloat(value.toFixed(1));
            }
          });
          
          return dataPoint;
        });
    }

    // Determine what's shown and drill-down capabilities
    let currentLevel = '';
    let drillDownHint = '';
    
    if (effectiveRole === 'vp') {
      if (trendDrillDown.jobFunctionId) {
        currentLevel = `${trendDrillDown.siteName} → ${trendDrillDown.jobFunctionName}`;
        drillDownHint = 'Showing task-level performance trends';
      } else if (trendDrillDown.siteId) {
        currentLevel = trendDrillDown.siteName || '';
        drillDownHint = 'Click a job function below to drill down to tasks';
      } else {
        currentLevel = 'All Sites';
        drillDownHint = 'Click a site below to drill down to job functions';
      }
    } else if (effectiveRole === 'site-manager') {
      if (trendDrillDown.jobFunctionId) {
        currentLevel = trendDrillDown.jobFunctionName || '';
        drillDownHint = 'Showing task-level performance trends';
      } else {
        currentLevel = 'All Job Functions';
        drillDownHint = 'Click a job function below to drill down to tasks';
      }
    } else {
      currentLevel = 'All Tasks';
      drillDownHint = 'Task-level performance trends';
    }

    // Update drill-down hint to reflect selected metric
    const metricLabel = trendMetric === 'performance' ? 'performance' : trendMetric === 'hours' ? 'hours' : 'volume';
    drillDownHint = drillDownHint.replace('performance', metricLabel);

    return (
      <FlatCard className="card-section-full">
        <ChartHeader
          title={section.title}
          description={section.description}
          currentLevel={currentLevel}
          drillDownHint={drillDownHint}
          showBackButton={!!(trendDrillDown.siteId || trendDrillDown.jobFunctionId)}
          onBack={() => {
            if (trendDrillDown.jobFunctionId) {
              // Go back to site level
              setTrendDrillDown({ siteId: trendDrillDown.siteId, siteName: trendDrillDown.siteName });
            } else {
              // Go back to top level
              setTrendDrillDown({});
            }
          }}
          metricValue={trendMetric}
          onMetricChange={(value: string) => setTrendMetric(value as 'performance' | 'hours' | 'volume')}
          metricOptions={[
            { value: 'performance', label: 'Performance %' },
            { value: 'hours', label: 'Actual Hours' },
            { value: 'volume', label: 'Volume' },
          ]}
        />
        {/* Chart */}
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'var(--font-family-inter)' }} stroke="var(--color-muted-foreground)" />
              <YAxis 
                domain={trendMetric === 'performance' ? [80, 110] : [0, 'auto']} 
                tick={{ fontSize: 11, fontFamily: 'var(--font-family-inter)' }} 
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-family-inter)', borderColor: 'var(--color-border)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-family-inter)' }} />
              {trendMetric === 'performance' && (
                <ReferenceLine 
                  y={100} 
                  stroke="var(--color-success)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{ value: '100% Target', position: 'right', fill: 'var(--color-success)', fontSize: 11, fontFamily: 'var(--font-family-inter)' }} 
                />
              )}
              {lineKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  name={key}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>

          {/* Drill-down buttons */}
          {lineMetadata.length > 0 && lineMetadata[0].type !== 'task' && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-4)' }}>
              <p style={{ fontSize: 'var(--text-label)', marginBottom: 'var(--spacing-3)', fontFamily: 'var(--font-family-inter)' }}>
                Click to drill down into {lineMetadata[0].type === 'site' ? 'job functions' : 'tasks'}:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {lineMetadata.map((meta, index) => (
                  <Button
                    key={meta.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (meta.type === 'site') {
                        setTrendDrillDown({ siteId: meta.id, siteName: meta.key });
                      } else if (meta.type === 'job-function') {
                        setTrendDrillDown({ 
                          ...trendDrillDown,
                          jobFunctionId: meta.id, 
                          jobFunctionName: meta.key 
                        });
                      }
                    }}
                    style={{ gap: 'var(--spacing-2)', borderColor: colors[index % colors.length], color: colors[index % colors.length], fontFamily: 'var(--font-family-inter)' }}
                  >
                    {meta.key}
                    <ChevronRight size={12} />
                  </Button>
                ))}
              </div>
            </div>
          )}
      </FlatCard>
    );
  };

  const renderHoursChart = (section: DashboardSection) => {
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    // Filter metrics based on drill-down state
    let filteredMetrics = contextMetrics;
    if (hoursDrillDown.jobFunctionId) {
      filteredMetrics = contextMetrics.filter(m => m.jobFunctionId === hoursDrillDown.jobFunctionId);
    } else if (hoursDrillDown.siteId) {
      filteredMetrics = contextMetrics.filter(m => m.siteId === hoursDrillDown.siteId);
    }

    let chartData: Array<{ 
      name: string; 
      variance: number; 
      expected: number; 
      actual: number; 
      id: string; 
      type: 'site' | 'job-function' | 'task' 
    }> = [];
    let currentLevel = '';
    let drillDownHint = '';
    
    // Helper function to calculate metric values based on selected metric
    const calculateChartMetrics = (metrics: DailyMetrics[]) => {
      if (hoursMetric === 'performance') {
        // Calculate average performance and variance from 100% target
        const metricsWithPerf = metrics.filter(m => m.performance !== null && m.performance !== undefined);
        if (metricsWithPerf.length === 0) {
          return { expected: 100, actual: 0, variance: -100 };
        }
        const avgPerformance = metricsWithPerf.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithPerf.length;
        return {
          expected: 100, // Target is always 100%
          actual: Math.round(avgPerformance * 10) / 10, // Round to 1 decimal
          variance: Math.round((avgPerformance - 100) * 10) / 10, // Variance from target
        };
      } else if (hoursMetric === 'hours') {
        const totalExpected = metrics.reduce((sum, m) => sum + m.expectedHours, 0);
        const totalActual = metrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        return {
          expected: Math.round(totalExpected),
          actual: Math.round(totalActual),
          variance: Math.round(totalActual - totalExpected),
        };
      } else if (hoursMetric === 'volume') {
        const totalExpected = metrics.reduce((sum, m) => sum + m.budgetedVolume, 0);
        const totalActual = metrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
        return {
          expected: Math.round(totalExpected),
          actual: Math.round(totalActual),
          variance: Math.round(totalActual - totalExpected),
        };
      } else { // budget (hours * rate approximation)
        const totalExpected = metrics.reduce((sum, m) => sum + m.expectedHours, 0);
        const totalActual = metrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
        // For budget, we'll show hours as proxy since we don't have cost rates
        return {
          expected: Math.round(totalExpected),
          actual: Math.round(totalActual),
          variance: Math.round(totalActual - totalExpected),
        };
      }
    };

    if (effectiveRole === 'vp') {
      if (hoursDrillDown.jobFunctionId) {
        // VP drilled down to job function level - show tasks
        const taskIds = Array.from(new Set(filteredMetrics.map(m => m.taskId)));
        
        chartData = taskIds.map(taskId => {
          const task = tasks.find(t => t.id === taskId);
          const taskMetrics = filteredMetrics.filter(m => m.taskId === taskId);
          const metrics = calculateChartMetrics(taskMetrics);
          
          return {
            name: task?.name || taskId,
            variance: metrics.variance,
            expected: metrics.expected,
            actual: metrics.actual,
            id: taskId,
            type: 'task' as const,
          };
        }).filter(d => d.expected > 0 || d.actual > 0);

        currentLevel = `${hoursDrillDown.siteName} → ${hoursDrillDown.jobFunctionName}`;
        drillDownHint = 'Showing task-level variance (actual - expected)';
      } else if (hoursDrillDown.siteId) {
        // VP drilled down to site level - show job functions
        const siteJobFunctions = allJobFunctions.filter(jf => jf.siteId === hoursDrillDown.siteId);
        
        chartData = siteJobFunctions.map(jf => {
          const jfMetrics = filteredMetrics.filter(m => m.jobFunctionId === jf.id);
          const metrics = calculateChartMetrics(jfMetrics);
          
          return {
            name: jf.name,
            variance: metrics.variance,
            expected: metrics.expected,
            actual: metrics.actual,
            id: jf.id,
            type: 'job-function' as const,
          };
        }).filter(d => d.expected > 0 || d.actual > 0);

        currentLevel = hoursDrillDown.siteName || '';
        drillDownHint = 'Click on a bar to drill down to tasks';
      } else {
        // VP top level - show sites with region total
        const siteIds = Array.from(new Set(contextMetrics.map(m => m.siteId)));
        
        chartData = siteIds.map(siteId => {
          const site = sites.find(s => s.id === siteId);
          const siteMetrics = contextMetrics.filter(m => m.siteId === siteId);
          const metrics = calculateChartMetrics(siteMetrics);
          
          return {
            name: site?.name || siteId,
            variance: metrics.variance,
            expected: metrics.expected,
            actual: metrics.actual,
            id: siteId,
            type: 'site' as const,
          };
        }).filter(d => d.expected > 0 || d.actual > 0);

        currentLevel = 'Region View';
        drillDownHint = 'Click on a bar to drill down to job functions';
      }
    } else if (effectiveRole === 'site-manager' && siteId) {
      if (hoursDrillDown.jobFunctionId) {
        // Site Manager drilled down to job function - show tasks
        const taskIds = Array.from(new Set(filteredMetrics.map(m => m.taskId)));
        
        chartData = taskIds.map(taskId => {
          const task = tasks.find(t => t.id === taskId);
          const taskMetrics = filteredMetrics.filter(m => m.taskId === taskId);
          const metrics = calculateChartMetrics(taskMetrics);
          
          return {
            name: task?.name || taskId,
            variance: metrics.variance,
            expected: metrics.expected,
            actual: metrics.actual,
            id: taskId,
            type: 'task' as const,
          };
        }).filter(d => d.expected > 0 || d.actual > 0);

        currentLevel = hoursDrillDown.jobFunctionName || '';
        drillDownHint = 'Showing task-level variance (actual - expected)';
      } else {
        // Site Manager top level - show job functions
        const siteJobFunctions = allJobFunctions.filter(jf => jf.siteId === siteId);
        
        chartData = siteJobFunctions.map(jf => {
          const jfMetrics = contextMetrics.filter(m => m.jobFunctionId === jf.id);
          const metrics = calculateChartMetrics(jfMetrics);
          
          return {
            name: jf.name,
            variance: metrics.variance,
            expected: metrics.expected,
            actual: metrics.actual,
            id: jf.id,
            type: 'job-function' as const,
          };
        }).filter(d => d.expected > 0 || d.actual > 0);

        currentLevel = 'Site View';
        drillDownHint = 'Click on a bar to drill down to tasks';
      }
    } else if (effectiveRole === 'supervisor' && jobFunctionId) {
      if (hoursDrillDown.jobFunctionId) {
        // Supervisor drilled down - show tasks
        const taskIds = Array.from(new Set(filteredMetrics.map(m => m.taskId)));
        
        chartData = taskIds.map(taskId => {
          const task = tasks.find(t => t.id === taskId);
          const taskMetrics = filteredMetrics.filter(m => m.taskId === taskId);
          const metrics = calculateChartMetrics(taskMetrics);
          
          return {
            name: task?.name || taskId,
            variance: metrics.variance,
            expected: metrics.expected,
            actual: metrics.actual,
            id: taskId,
            type: 'task' as const,
          };
        }).filter(d => d.expected > 0 || d.actual > 0);

        currentLevel = 'Tasks View';
        drillDownHint = 'Showing task-level variance (actual - expected)';
      } else {
        // Supervisor top level - show aggregated job function hours
        const jfMetrics = contextMetrics.filter(m => m.jobFunctionId === jobFunctionId);
        const metrics = calculateChartMetrics(jfMetrics);
        
        const jobFunc = allJobFunctions.find(jf => jf.id === jobFunctionId);
        
        chartData = [{
          name: jobFunc?.name || 'Job Function',
          variance: metrics.variance,
          expected: metrics.expected,
          actual: metrics.actual,
          id: jobFunctionId,
          type: 'job-function' as const,
        }];

        currentLevel = 'Job Function View';
        drillDownHint = 'Click on the bar to drill down to individual tasks';
      }
    }

    return (
      <FlatCard>
        <ChartHeader
          title={section.title}
          description={!hideDescription ? section.description : undefined}
          currentLevel={currentLevel}
          drillDownHint={drillDownHint}
          showBackButton={!!(hoursDrillDown.siteId || hoursDrillDown.jobFunctionId)}
          onBack={() => {
            if (hoursDrillDown.jobFunctionId) {
              // Go back to site/job function level
              if (effectiveRole === 'vp') {
                setHoursDrillDown({ siteId: hoursDrillDown.siteId, siteName: hoursDrillDown.siteName });
              } else {
                setHoursDrillDown({});
              }
            } else {
              // Go back to top level
              setHoursDrillDown({});
              }
            }}
            metricValue={hoursMetric}
            onMetricChange={(value: string) => setHoursMetric(value as 'performance' | 'hours' | 'volume' | 'budget')}
            metricOptions={[
              { value: 'performance', label: 'Performance %' },
              { value: 'hours', label: 'Hours' },
              { value: 'volume', label: 'Volume' },
              { value: 'budget', label: 'Budget' },
            ]}
          />
        <div className="card-content-flex-col-gap-large">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis 
                label={{ 
                  value: `${
                    hoursMetric === 'performance' ? 'Performance % Variance Δ' :
                    hoursMetric === 'hours' ? 'Hours Variance Δ' : 
                    hoursMetric === 'volume' ? 'Volume Variance Δ' : 
                    'Budget Variance Δ'
                  }`, 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fontSize: 12 } 
                }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const unit = hoursMetric === 'performance' ? '%' : hoursMetric === 'hours' ? ' hrs' : hoursMetric === 'volume' ? ' units' : ' hrs';
                    const isPerformance = hoursMetric === 'performance';
                    return (
                      <div style={{ backgroundColor: 'var(--color-background)', padding: 'var(--spacing-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-elevation-lg)' }}>
                        <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-2)' }}>{data.name}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', fontSize: 'var(--text-label)' }}>
                          <p>{isPerformance ? 'Target' : 'Expected'}: {data.expected}{unit}</p>
                          <p>Actual: {data.actual}{unit}</p>
                          <p style={{
                            color: isPerformance 
                              ? (data.variance >= 0 ? 'var(--color-success)' : 'var(--color-error)')
                              : (data.variance >= 0 ? 'var(--color-error)' : 'var(--color-success)')
                          }}>
                            Variance: {data.variance > 0 ? '+' : ''}{data.variance}{unit}
                            {isPerformance 
                              ? (data.variance > 0 ? ' (Above Target)' : ' (Below Target)')
                              : (data.variance > 0 ? ' (Over Budget)' : ' (Under Budget)')
                            }
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={0} stroke="#666" strokeWidth={2} label={{ value: 'Target', position: 'right', fill: '#666', fontSize: 11 }} />
              <Bar 
                dataKey="variance" 
                name={`${
                  hoursMetric === 'performance' ? 'Performance %' :
                  hoursMetric === 'hours' ? 'Hours' : 
                  hoursMetric === 'volume' ? 'Volume' : 
                  'Budget'
                } Variance`}
                onClick={(data: any) => {
                  if (!data || !data.payload) return;
                  const item = data.payload;
                  
                  // Don't drill down if already at task level
                  if (item.type === 'task') return;
                  
                  // Handle drill down
                  if (item.type === 'site') {
                    setHoursDrillDown({ siteId: item.id, siteName: item.name });
                  } else if (item.type === 'job-function') {
                    if (effectiveRole === 'supervisor') {
                      setHoursDrillDown({ jobFunctionId: item.id, jobFunctionName: item.name });
                    } else {
                      setHoursDrillDown({ 
                        ...hoursDrillDown,
                        jobFunctionId: item.id, 
                        jobFunctionName: item.name 
                      });
                    }
                  }
                }}
                cursor={chartData.length > 0 && chartData[0].type !== 'task' ? 'pointer' : 'default'}
              >
                {chartData.map((entry, index) => {
                  // For performance, green is good (positive variance), red is bad (negative)
                  // For others, green is good (negative variance = under budget), red is bad (positive = over budget)
                  const isGood = hoursMetric === 'performance' ? entry.variance >= 0 : entry.variance < 0;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isGood ? '#14b8a6' : '#fb7185'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-6)', fontSize: 'var(--text-label)' }}>
            {hoursMetric === 'performance' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#14b8a6', borderRadius: 'var(--radius-sm)' }}></div>
                  <span>Above Target (Good)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#fb7185', borderRadius: 'var(--radius-sm)' }}></div>
                  <span>Below Target (Needs Attention)</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#14b8a6', borderRadius: 'var(--radius-sm)' }}></div>
                  <span>Under Budget (Saved {hoursMetric === 'volume' ? 'Volume' : 'Hours'})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#fb7185', borderRadius: 'var(--radius-sm)' }}></div>
                  <span>Over Budget (Extra {hoursMetric === 'volume' ? 'Volume' : 'Hours'})</span>
                </div>
              </>
            )}
          </div>


        </div>
      </FlatCard>
    );
  };

  const renderTaskTable = (section: DashboardSection) => {
    return (
      <FlatCard>
        <div>
          <h3 className="ds-card-title">{section.title}</h3>
          {section.description && <p className="ds-card-description">{section.description}</p>}
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="table-cell-right">Forecasted Vol.</TableHead>
                <TableHead className="table-cell-right">Actual Vol.</TableHead>
                <TableHead className="table-cell-right">Rate (U/H)</TableHead>
                <TableHead className="table-cell-right">Expected Hrs</TableHead>
                <TableHead className="table-cell-right">Actual Hrs</TableHead>
                <TableHead className="table-cell-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contextMetrics.slice(0, 20).map((metric) => {
                const task = tasks.find(t => t.id === metric.taskId);
                return (
                  <TableRow key={metric.id}>
                    <TableCell>{task?.name || 'Unknown'}</TableCell>
                    <TableCell className="table-cell-right">{metric.forecastedVolume.toLocaleString()}</TableCell>
                    <TableCell className="table-cell-right">
                      {metric.actualVolume !== null ? metric.actualVolume.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="table-cell-right">{metric.budgetedRate.toFixed(1)}</TableCell>
                    <TableCell className="table-cell-right">{metric.expectedHours.toFixed(1)}</TableCell>
                    <TableCell className="table-cell-right">
                      {metric.actualHours !== null ? metric.actualHours.toFixed(1) : '-'}
                    </TableCell>
                    <TableCell className="table-cell-right">
                      {metric.performance !== null ? `${metric.performance.toFixed(1)}%` : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </FlatCard>
    );
  };

  const renderJobFunctionTable = (section: DashboardSection) => {
    let jobFunctions = [];
    if (siteId) {
      jobFunctions = getJobFunctionsBySite(siteId);
    } else {
      jobFunctions = allJobFunctions;
    }

    const jobFunctionMetrics = jobFunctions.map(jf => {
      const jfMetrics = contextMetrics.filter(m => m.jobFunctionId === jf.id);
      const metricsWithPerf = jfMetrics.filter(m => m.performance !== null);
      
      return {
        jobFunc: jf,
        totalExpectedHours: jfMetrics.reduce((sum, m) => sum + m.expectedHours, 0),
        totalActualHours: jfMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0),
        avgPerformance: metricsWithPerf.length > 0
          ? metricsWithPerf.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithPerf.length
          : null,
        completedTasks: metricsWithPerf.length,
        taskCount: jfMetrics.length,
      };
    });

    const getPerformanceBadge = (performance: number | null) => {
      if (performance === null) return <Badge variant="outline">Pending</Badge>;
      if (performance >= 100) return <Badge className="badge-success">Over Performing</Badge>;
      if (performance >= 95) return <Badge className="badge-info-colored">On Target</Badge>;
      if (performance >= 85) return <Badge className="badge-warning">Below Target</Badge>;
      return <Badge className="badge-error">Critical</Badge>;
    };

    return (
      <FlatCard>
        <div>
          <h3 className="ds-card-title">{section.title}</h3>
          {section.description && <p className="ds-card-description">{section.description}</p>}
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Function</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead className="table-cell-right">Expected Hours</TableHead>
                <TableHead className="table-cell-right">Actual Hours</TableHead>
                <TableHead className="table-cell-right">Performance</TableHead>
                <TableHead className="table-cell-right">Completion</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobFunctionMetrics.map(({ jobFunc, totalExpectedHours, totalActualHours, avgPerformance, completedTasks, taskCount }) => (
                <TableRow key={jobFunc.id}>
                  <TableCell>{jobFunc.name}</TableCell>
                  <TableCell className="table-cell-muted">{jobFunc.supervisorName}</TableCell>
                  <TableCell className="table-cell-right">{totalExpectedHours.toFixed(0)}</TableCell>
                  <TableCell className="table-cell-right">{totalActualHours.toFixed(0)}</TableCell>
                  <TableCell className="table-cell-right">
                    {avgPerformance ? `${avgPerformance.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell className="table-cell-right">
                    {completedTasks}/{taskCount}
                  </TableCell>
                  <TableCell>{getPerformanceBadge(avgPerformance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </FlatCard>
    );
  };

  const renderRankings = (section: DashboardSection) => {
    // Determine user role/context
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    // Get all metrics for comparison
    const allSitesMetrics = getMetricsByDateRange(startDate, endDate);
    
    // Get previous period metrics for trend calculation
    const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const prevStartDate = new Date(new Date(startDate).getTime() - daysDiff * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const prevEndDate = new Date(new Date(startDate).getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const previousMetrics = getMetricsByDateRange(prevStartDate, prevEndDate);
    
    // Use the new DynamicRankings component
    return (
      <DynamicRankings
        title={section.title || 'Rankings'}
        description={hideDescription ? undefined : section.description}
        role={effectiveRole}
        currentSiteId={siteId}
        currentJobFunctionId={jobFunctionId}
        sites={sites}
        jobFunctions={allJobFunctions}
        tasks={tasks}
        allMetrics={allSitesMetrics}
        previousMetrics={previousMetrics}
      />
    );
  };

  const renderBudgetTracking = (section: DashboardSection) => {
    const totalBudgetedHours = contextMetrics.reduce((sum, m) => sum + m.budgetedHours, 0);
    const totalExpectedHours = contextMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
    const totalActualHours = contextMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    const totalBudgetedVolume = contextMetrics.reduce((sum, m) => sum + m.budgetedVolume, 0);
    const totalActualVolume = contextMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);

    return (
      <FlatCard>
        <ChartHeader
          title={section.title}
          description={section.description}
          drillDownHint="Track hours against budget and forecast"
        />
        <div className="card-content-padded">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--spacing-4)' 
          }}>
            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginBottom: 'var(--spacing-1)' }}>Budgeted Hours</p>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-foreground)' }}>{totalBudgetedHours.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginBottom: 'var(--spacing-1)' }}>Expected Hours</p>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-foreground)' }}>{totalExpectedHours.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontFamily: 'var(--font-family-inter)', marginTop: 'var(--spacing-1)' }}>
                {totalExpectedHours <= totalBudgetedHours ? (
                  <>
                    <TrendingUp style={{ height: '12px', width: '12px', color: 'var(--color-success)' }} />
                    <span style={{ color: 'var(--color-success)' }}>Within budget</span>
                  </>
                ) : (
                  <>
                    <TrendingDown style={{ height: '12px', width: '12px', color: 'var(--color-error)' }} />
                    <span style={{ color: 'var(--color-error)' }}>
                      {(totalExpectedHours - totalBudgetedHours).toLocaleString('en-US', { maximumFractionDigits: 0 })} hrs over
                    </span>
                  </>
                )}
              </div>
            </div>
            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginBottom: 'var(--spacing-1)' }}>Actual Hours</p>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-foreground)' }}>{totalActualHours.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontFamily: 'var(--font-family-inter)', marginTop: 'var(--spacing-1)' }}>
                {totalActualHours <= totalExpectedHours ? (
                  <>
                    <TrendingUp style={{ height: '12px', width: '12px', color: 'var(--color-success)' }} />
                    <span style={{ color: 'var(--color-success)' }}>
                      {(totalExpectedHours - totalActualHours).toLocaleString('en-US', { maximumFractionDigits: 0 })} hrs saved
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown style={{ height: '12px', width: '12px', color: 'var(--color-error)' }} />
                    <span style={{ color: 'var(--color-error)' }}>
                      {(totalActualHours - totalExpectedHours).toLocaleString('en-US', { maximumFractionDigits: 0 })} hrs over
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </FlatCard>
    );
  };

  const renderHierarchicalPerformance = (section: DashboardSection) => {
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    return (
      <HierarchicalPerformanceTable
        metrics={contextMetrics}
        role={effectiveRole}
        siteId={siteId}
        jobFunctionId={jobFunctionId}
        title={section.title}
        description={section.description}
      />
    );
  };

  const renderSiteMap = (section: DashboardSection) => {
    return (
      <SitePerformanceMap
        title={section.title}
        description={section.description}
        sites={sites}
        metrics={contextMetrics}
      />
    );
  };

  const renderCustomSection = (section: DashboardSection) => {
    // Custom sections contain composite tiles from Visual Section Builder
    // The section should have a customConfig property with tiles array
    const customConfig = (section as any).customConfig;
    
    if (!customConfig || !customConfig.tiles || customConfig.tiles.length === 0) {
      return (
        <FlatCard>
          <ChartHeader 
            title={section.title} 
            description={!hideDescription ? section.description : undefined} 
          />
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8) 0', color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>
            <p>This custom section has no configured tiles.</p>
            <p style={{ marginTop: 'var(--spacing-2)' }}>Edit the section to add visualizations.</p>
          </div>
        </FlatCard>
      );
    }

    // Render tiles in a grid layout
    return (
      <FlatCard>
        <ChartHeader 
          title={section.title} 
          description={!hideDescription ? section.description : undefined} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--spacing-4)' }}>
          {customConfig.tiles.map((tile: any, index: number) => {
            // Get grid column span based on tile size
            const sizeStyles = {
              'small': { gridColumn: 'span 12 / span 12' }, // Full on mobile, will be 3 cols on desktop
              'medium': { gridColumn: 'span 12 / span 12' }, // Full on mobile, 6 cols on desktop
              'large': { gridColumn: 'span 12 / span 12' },
              'wide': { gridColumn: 'span 12 / span 12' }, // 12 on mobile, 8 on desktop
              'extra-large': { gridColumn: 'span 12 / span 12' }
            };
            
            const baseStyle = sizeStyles[tile.size as keyof typeof sizeStyles] || { gridColumn: 'span 12 / span 12' };
            
            // Add responsive styles via media query in the style attribute
            const responsiveStyle = tile.size === 'small' 
              ? '@media (min-width: 1024px) { grid-column: span 3 / span 3; } @media (min-width: 768px) and (max-width: 1023px) { grid-column: span 6 / span 6; }'
              : tile.size === 'medium'
              ? '@media (min-width: 768px) { grid-column: span 6 / span 6; }'
              : tile.size === 'wide'
              ? '@media (min-width: 768px) { grid-column: span 8 / span 8; }'
              : '';
            
            return (
              <div 
                key={tile.uniqueId || index} 
                style={baseStyle}
                data-responsive={responsiveStyle}
              >
                {renderCustomTile(tile)}
              </div>
            );
          })}
        </div>
      </FlatCard>
    );
  };

  const renderCustomTile = (tile: any) => {
    const config = tile.customConfig || {};
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    // Simple placeholder rendering for different tile types
    // In a full implementation, these would fetch and display real data
    
    switch (tile.type) {
      case 'kpi':
        // Sample KPI data based on metrics
        const avgPerformance = contextMetrics.length > 0
          ? contextMetrics.reduce((sum, m) => sum + (m.performance || 0), 0) / contextMetrics.length
          : 0;
        
        return (
          <Card className="card-full-height">
            <p className="ds-card-description">{tile.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-foreground)' }}>
                {config.metric === 'performance' ? `${avgPerformance.toFixed(1)}%` : 
                 config.metric === 'hours' ? '1,234' :
                 config.metric === 'tasks' ? '42' : 'N/A'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontFamily: 'var(--font-family-inter)', color: 'var(--color-success)' }}>
                <TrendingUp style={{ height: '12px', width: '12px' }} />
                <span>+5.2%</span>
              </div>
            </div>
          </Card>
        );
      
      case 'gauge':
        const gaugeValue = contextMetrics.length > 0
          ? contextMetrics.reduce((sum, m) => sum + (m.performance || 0), 0) / contextMetrics.length
          : 0;
        
        return (
          <Card className="card-full-height">
            <h3 className="ds-card-title">{tile.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-4) 0' }}>
              <div style={{ position: 'relative', width: '128px', height: '128px' }}>
                <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border)" strokeWidth="10" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke={config.color === 'green' ? 'var(--color-success)' : config.color === 'blue' ? 'var(--color-info)' : 'var(--color-warning)'}
                    strokeWidth="10"
                    strokeDasharray={`${(gaugeValue / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-family-inter)' }}>{gaugeValue.toFixed(0)}%</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginTop: 'var(--spacing-2)' }}>Current Progress</p>
            </div>
          </Card>
        );
      
      case 'progress':
        const progressValue = contextMetrics.length > 0
          ? (contextMetrics.filter(m => m.performance !== null).length / contextMetrics.length) * 100
          : 0;
        
        return (
          <Card className="card-full-height">
            <h3 className="ds-card-title">{tile.name}</h3>
            <p className="ds-card-description">{progressValue.toFixed(0)}% Complete</p>
            <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginTop: 'var(--spacing-2)' }}>
              {contextMetrics.filter(m => m.performance !== null).length} of {contextMetrics.length} tasks
            </p>
          </Card>
        );
      
      case 'line':
      case 'bar':
      case 'area':
        // Sample chart data
        const chartData = contextMetrics.slice(0, 7).map((m, i) => ({
          name: `Day ${i + 1}`,
          value: m.performance || 0,
        }));
        
        const ChartComponent = tile.type === 'line' ? LineChart : BarChart;
        const DataComponent = tile.type === 'line' ? Line : Bar;
        
        return (
          <Card className="card-full-height">
            <h3 className="ds-card-title">{tile.name}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ChartComponent data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'var(--font-family-inter)' }} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'var(--font-family-inter)' }} />
                <Tooltip />
                <DataComponent 
                  dataKey="value" 
                  fill={config.color === 'green' ? 'var(--color-success)' : config.color === 'blue' ? 'var(--color-info)' : 'var(--color-warning)'}
                  stroke={config.color === 'green' ? 'var(--color-success)' : config.color === 'blue' ? 'var(--color-info)' : 'var(--color-warning)'}
                />
              </ChartComponent>
            </ResponsiveContainer>
          </Card>
        );
      
      case 'table':
        const tableData = contextMetrics.slice(0, 5);
        
        return (
          <Card className="card-full-height">
            <h3 className="ds-card-title">{tile.name}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="table-cell-right">Performance</TableHead>
                  <TableHead className="table-cell-right">Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>Item {i + 1}</TableCell>
                    <TableCell className="table-cell-right">{m.performance?.toFixed(1)}%</TableCell>
                    <TableCell className="table-cell-right">{m.actualHours?.toFixed(0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        );
      
      default:
        return (
          <Card className="card-full-height">
            <h3 className="ds-card-title">{tile.name}</h3>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-8) 0', color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>
              <p>Tile type: {tile.type}</p>
              <p style={{ marginTop: 'var(--spacing-1)' }}>Preview not available</p>
            </div>
          </Card>
        );
    }
  };

  const renderPieChart = (section: DashboardSection) => {
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    // Get all metrics for comparison
    const allSitesMetrics = getMetricsByDateRange(startDate, endDate);
    
    return (
      <PerformancePieChart
        title={section.title || 'Performance Distribution'}
        description={hideDescription ? undefined : section.description}
        role={effectiveRole}
        currentSiteId={siteId}
        currentJobFunctionId={jobFunctionId}
        sites={sites}
        jobFunctions={allJobFunctions}
        tasks={tasks}
        allMetrics={allSitesMetrics}
      />
    );
  };

  // Determine effective role for breadcrumb display
  const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
  
  // Render global breadcrumb navigation
  const renderGlobalBreadcrumb = () => {
    // Only show breadcrumb for VP or Site Manager when drilling down
    if (effectiveRole === 'supervisor') return null;
    
    if (effectiveRole === 'vp') {
      if (!drillDownPath.siteId && !drillDownPath.jobFunctionId) return null;

      return (
        <FlatCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontFamily: 'var(--font-family-inter)' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrillDownPath({})}
              style={{ height: '32px', padding: '0 var(--spacing-2)' }}
            >
              <Home style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-1)' }} />
              All Sites
            </Button>
            
            {drillDownPath.siteId && (
              <>
                <ChevronRight style={{ height: '16px', width: '16px', color: 'var(--color-muted-foreground)' }} />
                {drillDownPath.jobFunctionId ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDrillDownPath({ siteId: drillDownPath.siteId, siteName: drillDownPath.siteName })}
                    style={{ height: '32px', padding: '0 var(--spacing-2)' }}
                  >
                    {drillDownPath.siteName}
                  </Button>
                ) : (
                  <span style={{ color: 'var(--color-foreground)', padding: '0 var(--spacing-2)' }}>{drillDownPath.siteName}</span>
                )}
              </>
            )}
            
            {drillDownPath.jobFunctionId && (
              <>
                <ChevronRight style={{ height: '16px', width: '16px', color: 'var(--color-muted-foreground)' }} />
                <span style={{ color: 'var(--color-foreground)', padding: '0 var(--spacing-2)' }}>{drillDownPath.jobFunctionName}</span>
              </>
            )}
          </div>
        </FlatCard>
      );
    } else if (effectiveRole === 'site-manager') {
      if (!drillDownPath.jobFunctionId) return null;

      const currentSite = siteId ? getSiteById(siteId) : null;

      return (
        <FlatCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontFamily: 'var(--font-family-inter)' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrillDownPath({})}
              style={{ height: '32px', padding: '0 var(--spacing-2)' }}
            >
              <Home style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-1)' }} />
              {currentSite ? currentSite.name : 'All Job Functions'}
            </Button>
            <ChevronRight style={{ height: '16px', width: '16px', color: 'var(--color-muted-foreground)' }} />
            <span style={{ color: 'var(--color-foreground)', padding: '0 var(--spacing-2)' }}>{drillDownPath.jobFunctionName}</span>
          </div>
        </FlatCard>
      );
    }

    return null;
  };

  // Convert tiles to sections if needed (for EnhancedDashboardBuilder compatibility)
  const effectiveSections = useMemo(() => {
    // If dashboard has tiles but no sections, convert tiles to sections
    if ((dashboard as any).tiles && (!dashboard.sections || dashboard.sections.length === 0)) {
      const tiles = (dashboard as any).tiles;
      return tiles.map((tile: any, index: number) => ({
        id: tile.id,
        title: tile.config?.title || `Tile ${index + 1}`,
        description: '',
        type: tile.type === 'metric' ? 'metric-tile' : 
              tile.type === 'kpi' ? 'kpi-cards' :
              tile.type === 'chart' ? 'trend-chart' :
              tile.type === 'table' ? 'top-tasks' : 
              'custom-section',
        order: index,
        enabled: true,
        ...(tile.type === 'metric' && { metricTileConfig: tile.config }),
        ...(tile.type !== 'metric' && tile.chartType && { chartType: tile.chartType }),
        ...(tile.config && { config: tile.config }),
      }));
    }
    return dashboard.sections || [];
  }, [dashboard]);



  // Build dashboard sections for draggable wrapper
  const dashboardSections = effectiveSections
    .sort((a, b) => a.order - b.order)
    .map(section => {
      // Extract configured height from section (set by builder resize)
      const configuredHeight = (section as any).tileHeight || (section as any).config?.height;
      
      // Wrap content with click handler for layer inspector
      const wrappedContent = onSectionClick ? (
        <div 
          onClick={() => onSectionClick(section)}
          style={{ 
            cursor: 'pointer',
            position: 'relative',
            height: '100%'
          }}
          onMouseEnter={(e) => {
            if (!builderMode) {
              e.currentTarget.style.outline = '2px solid rgba(59, 130, 246, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!builderMode) {
              e.currentTarget.style.outline = 'none';
            }
          }}
        >
          {renderSection(section)}
        </div>
      ) : renderSection(section);
      
      return {
        id: section.id,
        title: section.title,
        content: wrappedContent,
        columnSpan: (section as any).columnSpan || 4, // Default to full width (4 columns in 4-column grid)
        defaultHeight: configuredHeight, // Pass through configured height to match preview
        section: section, // Include reference to original section for stackGroup access
      };
    });

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <div style={{ height: '32px', width: '256px', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            <div style={{ height: '16px', width: '192px', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-6) 0' }} />
        
        {(dashboard.sections || []).map((section, index) => (
          <div key={section.id} style={{ marginBottom: 'var(--spacing-6)' }}>
            {section.type === 'overview-tiles' && <OverviewTilesSkeleton count={6} />}
            {section.type === 'performance-trend' && <ChartSkeleton height={350} />}
            {section.type === 'hours-breakdown' && <ChartSkeleton height={300} />}
            {section.type === 'task-list' && <TableSkeleton rows={8} columns={6} />}
            {section.type === 'rankings' && <TableSkeleton rows={10} columns={5} />}
            {section.type === 'budget-tracking' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
                    <div className="card-content-padded-large">
                      <div style={{ height: '16px', width: '80px', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', marginBottom: 'var(--spacing-2)' }} />
                      <div style={{ height: '32px', width: '128px', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Raw section mode - render just the section content without any wrappers
  // Used for grid-based builder preview where the grid handles layout
  if (rawSectionMode) {
    return (
      <>
        {dashboardSections.map((section) => <React.Fragment key={section.id}>{section.content}</React.Fragment>)}
      </>
    );
  }

  // In builder mode, this is being called FROM DashboardBuilder which already has BuilderPreviewWrapper
  // So we just need to render the section content without any grid/layout wrapper
  // The BuilderPreviewWrapper in DashboardBuilder handles all the grid layout
  if (builderMode) {
    // Just return raw content - BuilderPreviewWrapper handles the grid
    return (
      <>
        {/* Global Breadcrumb Navigation - only if NOT hidden by parent */}
        {!hideFilters && renderGlobalBreadcrumb()}

        {/* Dashboard Title - only if requested */}
        {showTitle && (
          <div>
            <h1 style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-foreground)' }}>{dashboard.name}</h1>
            {dashboard.description && (
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginTop: 'var(--spacing-1)' }}>{dashboard.description}</p>
            )}
          </div>
        )}
        
        {/* Raw section content - BuilderPreviewWrapper provides the grid */}
        {dashboardSections.map((section) => <React.Fragment key={section.id}>{section.content}</React.Fragment>)}
      </>
    );
  }

  // Normal view - Use shared BuilderPreviewWrapper
  return (
    <BuilderPreviewWrapper
      builderMode={false}
      sections={dashboardSections}
      onReorder={() => {}} // No reordering in published view
      breadcrumb={renderGlobalBreadcrumb()}
      globalFilters={null}
      headerControls={
        showTitle ? (
          <div>
            <h3 style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-foreground)' }}>{dashboard.name}</h3>
            {dashboard.description && (
              <p style={{ fontFamily: 'var(--font-family-inter)', color: 'var(--color-muted-foreground)', marginTop: 'var(--spacing-1)' }}>{dashboard.description}</p>
            )}
          </div>
        ) : undefined
      }
      // Note: No drag/drop, resize, or builder features since builderMode=false
    />
  );
}
