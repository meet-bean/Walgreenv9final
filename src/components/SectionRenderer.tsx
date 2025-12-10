import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { Progress } from './design-system/Progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Clock, Activity, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Trophy, Target, ChevronRight, Home, ArrowUp, ArrowDown, Minus, DollarSign, Zap, BarChart3, Award, Database } from 'lucide-react';
import { Button } from './design-system/Button';
import { TaskTile } from './TaskTile';
import { DateRangePicker } from './DateRangePicker';
import { HierarchicalPerformanceTable } from './HierarchicalPerformanceTable';
import { SitePerformanceMap } from './SitePerformanceMap';
import { DynamicRankings } from './DynamicRankings';
import { PerformancePieChart } from './PerformancePieChart';
import { OverviewTilesSkeleton, ChartSkeleton, TableSkeleton } from './SkeletonLoaders';
import {
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

interface SectionRendererProps {
  section: DashboardSection;
  siteId?: string;
  jobFunctionId?: string;
  previewRole?: 'vp' | 'site-manager' | 'supervisor';
  builderMode?: boolean;
  onConfigureMetricTile?: (sectionId: string) => void;
  hideDescription?: boolean;
  onDrillDown?: (drillDownInfo: { siteId?: string; siteName?: string; jobFunctionId?: string; jobFunctionName?: string }) => void;
}

type AggregationMode = 'daily' | 'weekly' | 'monthly' | 'total';

export function SectionRenderer({
  section,
  siteId,
  jobFunctionId,
  previewRole,
  builderMode = false,
  onConfigureMetricTile,
  hideDescription = false,
  onDrillDown,
}: SectionRendererProps) {
  const dateRange = getAvailableDateRange();
  
  // Self-contained state management
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [aggregation, setAggregation] = useState<AggregationMode>('total');
  const [showUnderperformingOnly, setShowUnderperformingOnly] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState(siteId || sites[0]?.id);
  const [isLoading, setIsLoading] = useState(true);
  
  // Self-contained drill-down state
  const [drillDownPath, setDrillDownPath] = useState<{
    siteId?: string;
    siteName?: string;
    jobFunctionId?: string;
    jobFunctionName?: string;
  }>({});

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [section.id, startDate, endDate, selectedSiteId]);

  // Self-contained data fetching
  const contextMetrics = useMemo(() => {
    const effectiveRole = previewRole || (jobFunctionId ? 'supervisor' : siteId ? 'site-manager' : 'vp');
    
    let metrics: DailyMetrics[] = [];
    
    if (effectiveRole === 'supervisor' && jobFunctionId) {
      metrics = getMetricsByDateRange(startDate, endDate).filter(m => m.jobFunctionId === jobFunctionId);
    } else if (effectiveRole === 'site-manager' && siteId) {
      metrics = getMetricsBySiteAndDateRange(siteId, startDate, endDate);
    } else if (selectedSiteId) {
      metrics = getMetricsBySiteAndDateRange(selectedSiteId, startDate, endDate);
    } else {
      metrics = getMetricsByDateRange(startDate, endDate);
    }
    
    if (showUnderperformingOnly) {
      metrics = metrics.filter(m => m.performance !== null && m.performance < 95);
    }
    
    return metrics;
  }, [startDate, endDate, siteId, jobFunctionId, selectedSiteId, previewRole, showUnderperformingOnly]);

  // Handle drill-down
  const handleDrillDown = (info: { siteId?: string; siteName?: string; jobFunctionId?: string; jobFunctionName?: string }) => {
    setDrillDownPath(info);
    if (onDrillDown) {
      onDrillDown(info);
    }
  };

  // Render metric tile
  const renderMetricTile = () => {
    const config = (section as any).metricTileConfig;
    
    if (!config) {
      return (
        <div className="inline-block">
          <Card className="border-2 border-dashed w-64 card-warning card-content-padding-6">
            <div className="text-center" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: 'var(--spacing-8)' }}>
              <div style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--spacing-2)' }}>📊</div>
              <p style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-family-inter)' }}>Metric Tile</p>
              <p style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)', marginTop: 'var(--spacing-1)', marginBottom: 'var(--spacing-3)' }}>Not Configured</p>
              {builderMode && onConfigureMetricTile && (
                <Button
                  onClick={() => onConfigureMetricTile(section.id)}
                  size="sm"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--color-chart-5), var(--color-chart-1))' }}
                >
                  <BarChart3 className="h-4 w-4" style={{ marginRight: 'var(--spacing-2)' }} />
                  Configure
                </Button>
              )}
            </div>
          </Card>
        </div>
      );
    }

    let displayValue = '—';
    
    if (config.dataSource === 'custom') {
      displayValue = config.customValue || '—';
    } else if (config.dataSource === 'system' && config.systemMetric) {
      const metricsWithData = contextMetrics.filter(m => m.performance !== null);
      
      switch (config.systemMetric) {
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
          displayValue = '42';
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
          displayValue = '8.7';
          break;
        default:
          displayValue = '—';
      }
    }

    const getIcon = () => {
      if (!config.icon) return null;
      const iconMap: { [key: string]: any } = {
        'trophy': Trophy,
        'target': Target,
        'activity': Activity,
        'clock': Clock,
        'dollar-sign': DollarSign,
        'zap': Zap,
        'bar-chart': BarChart3,
        'award': Award,
        'database': Database,
      };
      const IconComponent = iconMap[config.icon];
      return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
    };

    return (
      <Card 
        className="inline-block w-64"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: config.backgroundColor || 'var(--color-card)',
        }}
        className="card-content-padding-6"
      >
        <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
          <div className="flex-1">
            <p style={{ 
              fontSize: 'var(--text-label)',
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family-inter)',
              marginBottom: 'var(--spacing-2)'
            }}>
              {config.label || section.title}
            </p>
            <p style={{ 
              fontSize: 'var(--text-h1)',
              color: 'var(--color-foreground)',
              fontFamily: 'var(--font-family-inter)',
            }}>
              {displayValue}
            </p>
          </div>
          {config.showIcon && (
            <div style={{ color: config.iconColor || 'var(--color-primary)' }}>
              {getIcon()}
            </div>
          )}
        </div>
        {config.showComparison && config.comparisonValue && (
          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            {config.trend === 'up' ? (
              <ArrowUp className="h-4 w-4" style={{ color: 'var(--color-success)' }} />
            ) : config.trend === 'down' ? (
              <ArrowDown className="h-4 w-4" style={{ color: 'var(--color-destructive)' }} />
            ) : (
              <Minus className="h-4 w-4" style={{ color: 'var(--color-muted-foreground)' }} />
            )}
            <span style={{ 
              fontSize: 'var(--text-label)',
              color: config.trend === 'up' ? 'var(--color-success)' : config.trend === 'down' ? 'var(--color-destructive)' : 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family-inter)'
            }}>
              {config.comparisonValue}
            </span>
            {config.comparisonLabel && (
              <span style={{ 
                fontSize: 'var(--text-label)',
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family-inter)'
              }}>
                {config.comparisonLabel}
              </span>
            )}
          </div>
        )}
      </Card>
    );
  };

  // Render KPI cards
  const renderKPICards = () => {
    // Check if this section has configured cards using the new kpiCards field
    const configuredCards = (section as any).kpiCards as any[] | undefined;
    
    if (!configuredCards || configuredCards.length === 0) {
      return (
        <Card className="card-stat">
          <CardTitle>{section.title}</CardTitle>
          {!hideDescription && section.description && <CardDescription>{section.description}</CardDescription>}
          <p style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>No KPI cards configured</p>
        </Card>
      );
    }

    // Determine grid columns based on card count
    const cardCount = configuredCards.length;
    const gridClass = 
      cardCount === 1 ? 'grid-cols-1' :
      cardCount === 2 ? 'grid-cols-2' : 
      cardCount === 3 ? 'grid-cols-3' : 
      cardCount === 4 ? 'grid-cols-4' : 
      cardCount === 6 ? 'grid-cols-6' : 
      'grid-cols-4';

    const calculateMetricValue = (cardConfig: any) => {
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
            displayValue = '42';
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
            displayValue = '8.7';
            break;
          default:
            displayValue = '—';
        }
      }
      
      return displayValue;
    };

    return (
      <Card className="card-stat card-fit-content">
        <CardTitle>{section.title}</CardTitle>
        {!hideDescription && section.description && <CardDescription>{section.description}</CardDescription>}
        
        {/* Date Picker in Header */}
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            minDate={dateRange.start}
            maxDate={dateRange.end}
            aggregation={aggregation}
            onAggregationChange={(value) => setAggregation(value as AggregationMode)}
            aggregationOptions={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'total', label: 'Total' },
            ]}
          />
        </div>
        
        <div className={`grid ${gridClass}`} style={{ gap: 'var(--spacing-4)' }}>
          {configuredCards.map((cardConfig: any, index: number) => {
              const displayValue = calculateMetricValue(cardConfig);
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
                  className="p-3 rounded-lg" 
                  style={{ 
                    backgroundColor: getStatusColor(),
                    border: `2px solid ${getBorderColor()}`,
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
                  <div className="flex items-center" style={{ gap: 'var(--spacing-1)', fontSize: 'var(--text-label)' }}>
                    {trend === 'up' ? (
                      <>
                        <TrendingUp className="h-3 w-3" style={{ color: 'white' }} />
                        <span style={{ color: 'white', fontFamily: 'var(--font-family-inter)' }}>{trendValue}</span>
                      </>
                    ) : trend === 'down' ? (
                      <>
                        <TrendingDown className="h-3 w-3" style={{ color: 'white' }} />
                        <span style={{ color: 'white', fontFamily: 'var(--font-family-inter)' }}>{trendValue}</span>
                      </>
                    ) : (
                      <>
                        <Minus className="h-3 w-3" style={{ color: 'var(--color-muted-foreground)' }} />
                        <span style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>{trendValue}</span>
                      </>
                    )}
                    <span style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>vs last period</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };



  // Render based on section type
  const renderContent = () => {
    if (isLoading) {
      if (section.type === 'kpi-cards') {
        return <OverviewTilesSkeleton count={4} />;
      } else if (section.type === 'metric-tile') {
        return (
          <Card className="w-64 card-stat">
            <CardContent className="card-content-padding-6">
              <div className="h-4 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
              <div className="h-8 w-32 rounded animate-pulse mt-2" style={{ backgroundColor: 'var(--color-muted)' }} />
            </CardContent>
          </Card>
        );
      } else {
        return <ChartSkeleton height={300} />;
      }
    }

    switch (section.type) {
      case 'metric-tile':
        return renderMetricTile();
      case 'kpi-cards':
        return renderKPICards();
      case 'saved-section':
        // Render saved section (from library)
        const savedConfig = (section as any).savedSectionConfig as SavedReportSection | undefined;
        if (savedConfig) {
          // Recursively render the saved section
          return (
            <SectionRenderer
              section={{ ...savedConfig, id: section.id }}
              siteId={siteId}
              jobFunctionId={jobFunctionId}
              previewRole={previewRole}
              builderMode={builderMode}
              onConfigureMetricTile={onConfigureMetricTile}
              hideDescription={hideDescription}
              onDrillDown={handleDrillDown}
            />
          );
        }
        return (
          <Card className="card-stat">
            <CardContent className="card-content-padding-6">
              <p style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>
                Saved section not found
              </p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="card-stat">
            <CardHeader noTopPadding>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: 'var(--color-muted-foreground)', fontFamily: 'var(--font-family-inter)' }}>
                Section type "{section.type}" not yet implemented in SectionRenderer
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return renderContent();
}