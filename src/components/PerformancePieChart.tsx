import React, { useState, useMemo } from 'react';
import { Card, CardDescription, CardTitle } from './design-system/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Badge } from './design-system/Badge';
import { Button } from './design-system/Button';
import { Site, JobFunction, Task, DailyMetrics } from '../lib/mockData';
import { ChevronLeft } from 'lucide-react';

interface PerformancePieChartProps {
  title: string;
  description?: string;
  role: 'vp' | 'site-manager' | 'supervisor';
  currentSiteId?: string;
  currentJobFunctionId?: string;
  sites: Site[];
  jobFunctions: JobFunction[];
  tasks: Task[];
  allMetrics: DailyMetrics[];
}

type ViewLevel = 'region' | 'site' | 'jobFunction' | 'task';

interface DrilldownState {
  level: ViewLevel;
  regionId?: string;
  siteId?: string;
  jobFunctionId?: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(221, 83%, 53%)', // Additional colors
  'hsl(142, 76%, 36%)',
  'hsl(24, 95%, 53%)',
  'hsl(262, 83%, 58%)',
  'hsl(340, 82%, 52%)',
];

export const PerformancePieChart: React.FC<PerformancePieChartProps> = ({
  title,
  description,
  role,
  currentSiteId,
  currentJobFunctionId,
  sites,
  jobFunctions,
  tasks,
  allMetrics,
}) => {
  const [groupBy, setGroupBy] = useState<'performance' | 'hours' | 'volume'>('performance');
  const [drilldown, setDrilldown] = useState<DrilldownState>(() => {
    // Initialize based on role
    if (role === 'supervisor' && currentJobFunctionId) {
      return { level: 'task', jobFunctionId: currentJobFunctionId };
    }
    if (role === 'site-manager' && currentSiteId) {
      return { level: 'jobFunction', siteId: currentSiteId };
    }
    return { level: 'region' };
  });

  // Calculate aggregate metrics for a set of metrics
  const calculateAggregate = (metrics: DailyMetrics[]) => {
    const validMetrics = metrics.filter(m => m.performance !== null);
    const totalExpectedHours = metrics.reduce((sum, m) => sum + m.expectedHours, 0);
    const totalActualHours = metrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    const totalVolume = metrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
    const avgPerformance = validMetrics.length > 0
      ? validMetrics.reduce((sum, m) => sum + (m.performance || 0), 0) / validMetrics.length
      : 0;

    return {
      performance: avgPerformance,
      expectedHours: totalExpectedHours,
      actualHours: totalActualHours,
      volume: totalVolume,
    };
  };

  // Generate pie chart data based on current drilldown level
  const pieData = useMemo(() => {
    let data: Array<{ name: string; value: number; id: string; color: string; metadata?: any }> = [];

    if (drilldown.level === 'region' && role === 'vp') {
      // Group by regions
      const regionMap = new Map<string, DailyMetrics[]>();
      sites.forEach(site => {
        if (!regionMap.has(site.region)) {
          regionMap.set(site.region, []);
        }
        const siteMetrics = allMetrics.filter(m => m.siteId === site.id);
        regionMap.get(site.region)!.push(...siteMetrics);
      });

      data = Array.from(regionMap.entries()).map(([region, metrics], index) => {
        const agg = calculateAggregate(metrics);
        const value = groupBy === 'performance' ? agg.performance :
                     groupBy === 'hours' ? agg.actualHours :
                     agg.volume;
        return {
          name: region,
          value: Math.round(value * 100) / 100,
          id: region,
          color: COLORS[index % COLORS.length],
          metadata: agg,
        };
      });
    } else if (drilldown.level === 'site' && drilldown.regionId) {
      // Group by sites within a region
      const regionSites = sites.filter(s => s.region === drilldown.regionId);
      data = regionSites.map((site, index) => {
        const siteMetrics = allMetrics.filter(m => m.siteId === site.id);
        const agg = calculateAggregate(siteMetrics);
        const value = groupBy === 'performance' ? agg.performance :
                     groupBy === 'hours' ? agg.actualHours :
                     agg.volume;
        return {
          name: site.name,
          value: Math.round(value * 100) / 100,
          id: site.id,
          color: COLORS[index % COLORS.length],
          metadata: agg,
        };
      });
    } else if (drilldown.level === 'jobFunction') {
      // Group by job functions within a site
      const siteId = drilldown.siteId || currentSiteId;
      if (siteId) {
        const siteJobFunctions = jobFunctions.filter(jf => jf.siteId === siteId);
        data = siteJobFunctions.map((jf, index) => {
          const jfMetrics = allMetrics.filter(m => m.jobFunctionId === jf.id);
          const agg = calculateAggregate(jfMetrics);
          const value = groupBy === 'performance' ? agg.performance :
                       groupBy === 'hours' ? agg.actualHours :
                       agg.volume;
          return {
            name: jf.name,
            value: Math.round(value * 100) / 100,
            id: jf.id,
            color: COLORS[index % COLORS.length],
            metadata: agg,
          };
        });
      }
    } else if (drilldown.level === 'task') {
      // Group by tasks within a job function
      const jobFunctionId = drilldown.jobFunctionId || currentJobFunctionId;
      if (jobFunctionId) {
        const jfMetrics = allMetrics.filter(m => m.jobFunctionId === jobFunctionId);
        const taskMap = new Map<string, DailyMetrics[]>();
        
        jfMetrics.forEach(m => {
          if (!taskMap.has(m.taskId)) {
            taskMap.set(m.taskId, []);
          }
          taskMap.get(m.taskId)!.push(m);
        });

        data = Array.from(taskMap.entries()).map(([taskId, metrics], index) => {
          const task = tasks.find(t => t.id === taskId);
          const agg = calculateAggregate(metrics);
          const value = groupBy === 'performance' ? agg.performance :
                       groupBy === 'hours' ? agg.actualHours :
                       agg.volume;
          return {
            name: task?.name || 'Unknown Task',
            value: Math.round(value * 100) / 100,
            id: taskId,
            color: COLORS[index % COLORS.length],
            metadata: agg,
          };
        });
      }
    }

    // Filter out zero values and sort by value
    return data.filter(d => d.value > 0).sort((a, b) => b.value - a.value);
  }, [drilldown, groupBy, sites, jobFunctions, tasks, allMetrics, role, currentSiteId, currentJobFunctionId]);

  // Handle pie slice click for drill-down
  const handlePieClick = (data: any) => {
    if (drilldown.level === 'region' && role === 'vp') {
      setDrilldown({ level: 'site', regionId: data.id });
    } else if (drilldown.level === 'site') {
      setDrilldown({ level: 'jobFunction', siteId: data.id, regionId: drilldown.regionId });
    } else if (drilldown.level === 'jobFunction') {
      setDrilldown({ level: 'task', jobFunctionId: data.id, siteId: drilldown.siteId });
    }
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (level: ViewLevel) => {
    if (level === 'region') {
      setDrilldown({ level: 'region' });
    } else if (level === 'site' && drilldown.regionId) {
      setDrilldown({ level: 'site', regionId: drilldown.regionId });
    } else if (level === 'jobFunction' && drilldown.siteId) {
      setDrilldown({ level: 'jobFunction', siteId: drilldown.siteId });
    }
  };

  // Determine if drill-down is possible
  const canDrillDown = (drilldown.level === 'region' && role === 'vp') ||
                       (drilldown.level === 'site') ||
                       (drilldown.level === 'jobFunction');

  // Get breadcrumb path
  const getBreadcrumb = () => {
    const parts: { label: string; level: ViewLevel }[] = [];
    
    if (role === 'vp') {
      parts.push({ label: 'All Regions', level: 'region' });
      
      if (drilldown.regionId) {
        parts.push({ label: drilldown.regionId, level: 'site' });
      }
      
      if (drilldown.siteId) {
        const site = sites.find(s => s.id === drilldown.siteId);
        parts.push({ label: site?.name || 'Site', level: 'jobFunction' });
      }
      
      if (drilldown.jobFunctionId) {
        const jf = jobFunctions.find(j => j.id === drilldown.jobFunctionId);
        parts.push({ label: jf?.name || 'Job Function', level: 'task' });
      }
    } else if (role === 'site-manager') {
      const site = sites.find(s => s.id === (drilldown.siteId || currentSiteId));
      parts.push({ label: site?.name || 'Site', level: 'jobFunction' });
      
      if (drilldown.jobFunctionId) {
        const jf = jobFunctions.find(j => j.id === drilldown.jobFunctionId);
        parts.push({ label: jf?.name || 'Job Function', level: 'task' });
      }
    } else if (role === 'supervisor') {
      const jf = jobFunctions.find(j => j.id === (drilldown.jobFunctionId || currentJobFunctionId));
      parts.push({ label: jf?.name || 'Job Function', level: 'task' });
    }
    
    return parts;
  };

  const breadcrumb = getBreadcrumb();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const metadata = data.metadata;
      
      return (
        <div className="bg-card border border-border rounded-md p-3 shadow-lg">
          <p className="font-medium mb-2">{data.name}</p>
          {groupBy === 'performance' && (
            <p className="text-sm">
              Performance: <span className="font-semibold">{data.value.toFixed(1)}%</span>
            </p>
          )}
          {groupBy === 'hours' && (
            <>
              <p className="text-sm">
                Actual Hours: <span className="font-semibold">{data.value.toFixed(0)}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Expected: {metadata?.expectedHours?.toFixed(0)}
              </p>
            </>
          )}
          {groupBy === 'volume' && (
            <p className="text-sm">
              Volume: <span className="font-semibold">{data.value.toFixed(0)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {breadcrumb.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />}
                  <Button
                    variant={index === breadcrumb.length - 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleBreadcrumbClick(crumb.level)}
                    disabled={index === breadcrumb.length - 1}
                    className="h-7"
                  >
                    {crumb.label}
                  </Button>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Metric Selector */}
          <div className="flex items-center gap-2">
            <Select value={groupBy} onValueChange={(v: any) => setGroupBy(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance %</SelectItem>
                <SelectItem value="hours">Actual Hours</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pieData.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No data available for this view
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={canDrillDown ? handlePieClick : undefined}
                  cursor={canDrillDown ? "pointer" : "default"}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry: any) => {
                    const data = pieData.find(d => d.name === value);
                    return `${value} (${data?.value})`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Data Table */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <p className="font-medium text-sm">Breakdown</p>
              </div>
              <div className="divide-y max-h-[200px] overflow-y-auto">
                {pieData.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors ${
                      canDrillDown ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => canDrillDown && handlePieClick(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {groupBy === 'performance' && `${item.value.toFixed(1)}%`}
                        {groupBy === 'hours' && `${item.value.toFixed(0)} hrs`}
                        {groupBy === 'volume' && `${item.value.toFixed(0)} units`}
                      </Badge>
                      {item.metadata && (
                        <span className="text-sm text-muted-foreground">
                          {groupBy === 'performance' && `${item.metadata.actualHours?.toFixed(0)} hrs`}
                          {groupBy === 'hours' && `${item.metadata.performance?.toFixed(1)}%`}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {canDrillDown && (
              <p className="text-sm text-muted-foreground text-center">
                Click on pie slices or items to drill down
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
