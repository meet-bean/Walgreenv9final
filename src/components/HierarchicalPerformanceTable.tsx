import React, { useMemo, useState } from 'react';
import { Card } from './design-system/Card';
import { FlatCard } from './design-system/FlatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { sites, jobFunctions as allJobFunctions, tasks, DailyMetrics } from '../lib/mockData';
import { ChartHeader } from './ChartHeader';

interface HierarchicalPerformanceTableProps {
  metrics: DailyMetrics[];
  role: 'vp' | 'site-manager' | 'supervisor';
  siteId?: string;
  jobFunctionId?: string;
  title?: string;
  description?: string;
}

export function HierarchicalPerformanceTable({
  metrics,
  role,
  siteId,
  jobFunctionId,
  title = 'Hierarchical Performance',
  description,
}: HierarchicalPerformanceTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPerformanceColor = (performance: number | null) => {
    if (performance === null) return 'text-gray-500';
    if (performance >= 98) return 'text-green-600';
    if (performance >= 95) return 'text-info';
    if (performance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadgeVariant = (performance: number | null): "default" | "secondary" | "destructive" | "outline" => {
    if (performance === null) return 'secondary';
    if (performance >= 98) return 'default';
    if (performance >= 95) return 'default';
    if (performance >= 85) return 'secondary';
    return 'destructive';
  };

  // Calculate hierarchy data for Executive
  const hierarchyData = useMemo(() => {
    if (role === 'vp') {
      // Group by region first
      const regionData = new Map<string, {
        region: string;
        sites: Map<string, {
          siteId: string;
          siteName: string;
          jobFunctions: Map<string, {
            jobFunctionId: string;
            jobFunctionName: string;
            tasks: Array<{
              taskId: string;
              taskName: string;
              metrics: DailyMetrics[];
            }>;
          }>;
        }>;
      }>();

      sites.forEach(site => {
        if (!regionData.has(site.region)) {
          regionData.set(site.region, {
            region: site.region,
            sites: new Map(),
          });
        }

        const siteMetrics = metrics.filter(m => m.siteId === site.id);
        if (siteMetrics.length > 0) {
          const siteData = {
            siteId: site.id,
            siteName: site.name,
            jobFunctions: new Map<string, {
              jobFunctionId: string;
              jobFunctionName: string;
              tasks: Array<{
                taskId: string;
                taskName: string;
                metrics: DailyMetrics[];
              }>;
            }>(),
          };

          // Group by job function
          siteMetrics.forEach(metric => {
            const jf = allJobFunctions.find(j => j.id === metric.jobFunctionId);
            if (jf) {
              if (!siteData.jobFunctions.has(jf.id)) {
                siteData.jobFunctions.set(jf.id, {
                  jobFunctionId: jf.id,
                  jobFunctionName: jf.name,
                  tasks: [],
                });
              }

              const jfData = siteData.jobFunctions.get(jf.id)!;
              let taskData = jfData.tasks.find(t => t.taskId === metric.taskId);
              if (!taskData) {
                const task = tasks.find(t => t.id === metric.taskId);
                if (task) {
                  taskData = {
                    taskId: task.id,
                    taskName: task.name,
                    metrics: [],
                  };
                  jfData.tasks.push(taskData);
                }
              }
              if (taskData) {
                taskData.metrics.push(metric);
              }
            }
          });

          regionData.get(site.region)!.sites.set(site.id, siteData);
        }
      });

      return regionData;
    }
    return new Map();
  }, [metrics, role]);

  const calculateAggregateMetrics = (metricsArray: DailyMetrics[]) => {
    const metricsWithData = metricsArray.filter(m => m.performance !== null && m.performance !== undefined);
    const totalExpectedHours = metricsArray.reduce((sum, m) => sum + m.expectedHours, 0);
    
    if (metricsWithData.length === 0) {
      return {
        performance: null,
        expectedHours: totalExpectedHours,
        count: metricsArray.length,
      };
    }

    const avgPerformance = metricsWithData.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithData.length;
    
    return {
      performance: avgPerformance,
      expectedHours: totalExpectedHours,
      count: metricsArray.length,
    };
  };

  // Executive View - Regions → Sites → Job Functions → Tasks
  if (role === 'vp') {
    return (
      <FlatCard>
        <ChartHeader
          title={title}
          description={description}
          drillDownHint="Expand regions to see sites, then job functions, then tasks to find root causes of performance issues"
        />
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hierarchy</TableHead>
                <TableHead></TableHead>
                <TableHead className="text-right">Performance</TableHead>
                <TableHead className="text-right">Expected Hrs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(hierarchyData.entries()).map(([regionName, regionData]) => {
                const allRegionMetrics: DailyMetrics[] = [];
                regionData.sites.forEach(site => {
                  site.jobFunctions.forEach(jf => {
                    jf.tasks.forEach(task => {
                      allRegionMetrics.push(...task.metrics);
                    });
                  });
                });
                const regionAgg = calculateAggregateMetrics(allRegionMetrics);
                const isRegionExpanded = expandedItems.has(`region-${regionName}`);

                return (
                  <React.Fragment key={regionName}>
                    {/* Region Row */}
                    <TableRow className="font-medium bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleExpand(`region-${regionName}`)}
                            className="h-8 w-8 p-0 border-2"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderColor: '#9ca3af',
                              color: '#111827',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isRegionExpanded ? <ChevronDown size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
                          </Button>
                          <Badge variant="outline" className="font-medium">Region</Badge>
                          <span>{regionName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {regionData.sites.size} sites
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {regionAgg.performance !== null ? (
                          <Badge variant={getPerformanceBadgeVariant(regionAgg.performance)}>
                            {regionAgg.performance.toFixed(1)}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{regionAgg.expectedHours.toLocaleString()}</TableCell>
                    </TableRow>

                    {/* Sites under Region */}
                    {isRegionExpanded && Array.from(regionData.sites.entries()).map(([siteId, siteData]) => {
                      const allSiteMetrics: DailyMetrics[] = [];
                      siteData.jobFunctions.forEach(jf => {
                        jf.tasks.forEach(task => {
                          allSiteMetrics.push(...task.metrics);
                        });
                      });
                      const siteAgg = calculateAggregateMetrics(allSiteMetrics);
                      const isSiteExpanded = expandedItems.has(`site-${siteId}`);

                      return (
                        <React.Fragment key={siteId}>
                          {/* Site Row */}
                          <TableRow className="bg-muted/10">
                            <TableCell>
                              <div className="flex items-center gap-2" style={{ paddingLeft: '96px' }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleExpand(`site-${siteId}`)}
                                  className="h-8 w-8 p-0"
                                  style={{
                                    backgroundColor: 'var(--color-card)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-foreground)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {isSiteExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                </Button>
                                <Badge variant="outline" className="font-medium">Site</Badge>
                                <span>{siteData.siteName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-sm text-muted-foreground">
                                {siteData.jobFunctions.size} job functions
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              {siteAgg.performance !== null ? (
                                <Badge variant={getPerformanceBadgeVariant(siteAgg.performance)}>
                                  {siteAgg.performance.toFixed(1)}%
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">{siteAgg.expectedHours.toLocaleString()}</TableCell>
                          </TableRow>

                          {/* Job Functions under Site */}
                          {isSiteExpanded && Array.from(siteData.jobFunctions.entries()).map(([jfId, jfData]) => {
                            const allJfMetrics: DailyMetrics[] = [];
                            jfData.tasks.forEach(task => {
                              allJfMetrics.push(...task.metrics);
                            });
                            const jfAgg = calculateAggregateMetrics(allJfMetrics);
                            const isJfExpanded = expandedItems.has(`jf-${jfId}`);

                            return (
                              <React.Fragment key={jfId}>
                                {/* Job Function Row */}
                                <TableRow>
                                  <TableCell>
                                    <div className="flex items-center gap-2" style={{ paddingLeft: '192px' }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => toggleExpand(`jf-${jfId}`)}
                                        className="h-8 w-8 p-0"
                                        style={{
                                          backgroundColor: 'var(--color-card)',
                                          borderColor: 'var(--color-border)',
                                          color: 'var(--color-foreground)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        {isJfExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                      </Button>
                                      <Badge variant="outline" className="font-medium">Job Function</Badge>
                                      <span>{jfData.jobFunctionName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <span className="text-sm text-muted-foreground">
                                      {jfData.tasks.length} tasks
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {jfAgg.performance !== null ? (
                                      <Badge variant={getPerformanceBadgeVariant(jfAgg.performance)}>
                                        {jfAgg.performance.toFixed(1)}%
                                      </Badge>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">{jfAgg.expectedHours.toLocaleString()}</TableCell>
                                </TableRow>

                                {/* Tasks under Job Function */}
                                {isJfExpanded && jfData.tasks.map(taskData => {
                                  const taskAgg = calculateAggregateMetrics(taskData.metrics);

                                  return (
                                    <TableRow key={taskData.taskId} className="text-sm">
                                      <TableCell>
                                        <div className="flex items-center gap-2" style={{ paddingLeft: '288px' }}>
                                          <Badge variant="outline" className="font-medium">Task</Badge>
                                          <span>{taskData.taskName}</span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <span className="text-xs text-muted-foreground">
                                          {taskData.metrics.length} records
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {taskAgg.performance !== null ? (
                                          <span className={getPerformanceColor(taskAgg.performance)}>
                                            {taskAgg.performance.toFixed(1)}%
                                          </span>
                                        ) : (
                                          <span className="text-muted-foreground">—</span>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">{taskAgg.expectedHours.toLocaleString()}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </FlatCard>
    );
  }

  // Site Manager View - Job Functions → Tasks
  if (role === 'site-manager' && siteId) {
    const siteJobFunctions = allJobFunctions.filter(jf => jf.siteId === siteId);

    return (
      <FlatCard>
        <ChartHeader
          title={title}
          description={description}
          drillDownHint="Expand job functions to see tasks and identify performance issues"
        />
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hierarchy</TableHead>
                <TableHead></TableHead>
                <TableHead className="text-right">Performance</TableHead>
                <TableHead className="text-right">Expected Hrs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {siteJobFunctions.map(jf => {
                const jfMetrics = metrics.filter(m => m.jobFunctionId === jf.id);
                const jfAgg = calculateAggregateMetrics(jfMetrics);
                const isExpanded = expandedItems.has(`jf-${jf.id}`);

                // Group metrics by task
                const taskGroups = new Map<string, DailyMetrics[]>();
                jfMetrics.forEach(metric => {
                  if (!taskGroups.has(metric.taskId)) {
                    taskGroups.set(metric.taskId, []);
                  }
                  taskGroups.get(metric.taskId)!.push(metric);
                });

                return (
                  <React.Fragment key={jf.id}>
                    {/* Job Function Row */}
                    <TableRow className="font-medium bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleExpand(`jf-${jf.id}`)}
                            className="h-8 w-8 p-0 border-2"
                            style={{
                              backgroundColor: '#f3f4f6',
                              borderColor: '#9ca3af',
                              color: '#111827',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isExpanded ? <ChevronDown size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
                          </Button>
                          <Badge variant="outline" className="font-medium">Job Function</Badge>
                          <span>{jf.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {taskGroups.size} tasks
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {jfAgg.performance !== null ? (
                          <Badge variant={getPerformanceBadgeVariant(jfAgg.performance)}>
                            {jfAgg.performance.toFixed(1)}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{jfAgg.expectedHours.toLocaleString()}</TableCell>
                    </TableRow>

                    {/* Tasks under Job Function */}
                    {isExpanded && Array.from(taskGroups.entries()).map(([taskId, taskMetrics]) => {
                      const task = tasks.find(t => t.id === taskId);
                      if (!task) return null;
                      const taskAgg = calculateAggregateMetrics(taskMetrics);

                      return (
                        <TableRow key={taskId} className="text-sm">
                          <TableCell>
                            <div className="flex items-center gap-2" style={{ paddingLeft: '96px' }}>
                              <Badge variant="outline" className="font-medium">Task</Badge>
                              <span>{task.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-xs text-muted-foreground">
                              {taskMetrics.length} records
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {taskAgg.performance !== null ? (
                              <span className={getPerformanceColor(taskAgg.performance)}>
                                {taskAgg.performance.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{taskAgg.expectedHours.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </FlatCard>
    );
  }

  // Supervisor View - Tasks only
  if (role === 'supervisor' && jobFunctionId) {
    const jfMetrics = metrics.filter(m => m.jobFunctionId === jobFunctionId);
    
    // Group metrics by task
    const taskGroups = new Map<string, DailyMetrics[]>();
    jfMetrics.forEach(metric => {
      if (!taskGroups.has(metric.taskId)) {
        taskGroups.set(metric.taskId, []);
      }
      taskGroups.get(metric.taskId)!.push(metric);
    });

    return (
      <FlatCard>
        <ChartHeader
          title={title}
          description={description}
          drillDownHint="Task-level performance for your job function"
        />
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Task</TableHead>
                <TableHead className="w-1/6 text-right">Records</TableHead>
                <TableHead className="w-1/6 text-right">Performance</TableHead>
                <TableHead className="w-1/6 text-right">Expected Hrs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(taskGroups.entries()).map(([taskId, taskMetrics]) => {
                const task = tasks.find(t => t.id === taskId);
                if (!task) return null;
                const taskAgg = calculateAggregateMetrics(taskMetrics);

                return (
                  <TableRow key={taskId}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell className="text-right">{taskMetrics.length}</TableCell>
                    <TableCell className="text-right">
                      {taskAgg.performance !== null ? (
                        <Badge variant={getPerformanceBadgeVariant(taskAgg.performance)}>
                          {taskAgg.performance.toFixed(1)}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{taskAgg.expectedHours.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </FlatCard>
    );
  }

  return (
    <FlatCard>
      <ChartHeader
        title={title}
        description={description}
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>No hierarchical data available for the current context.</p>
      </div>
    </FlatCard>
  );
}