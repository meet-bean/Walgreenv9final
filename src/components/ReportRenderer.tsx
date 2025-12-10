/**
 * Report Renderer
 * Minimal, table-focused layout for displaying reports
 */

import React from 'react';
import { Badge } from './design-system/Badge';
import { Separator } from './design-system/Separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { ReportData } from '../lib/reportGenerator';
import { ReportDisplayConfig } from './ReportColumnConfig';
import { groupReportData, calculateAdditionalColumns, GroupedData } from '../lib/reportGrouping';
import { PageContainer } from './design-system/PageContainer';
import { PageHeader } from './design-system/PageHeader';

interface ReportRendererProps {
  reportData: ReportData;
  displayConfig?: ReportDisplayConfig;
}

export function ReportRenderer({ reportData, displayConfig }: ReportRendererProps) {
  const { metadata, summary, details } = reportData;
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['all']));
  
  const renderTrendIcon = (trend?: 'up' | 'down' | 'flat') => {
    if (trend === 'up') return <TrendingUp className="icon-sm icon-success" />;
    if (trend === 'down') return <TrendingDown className="icon-sm icon-destructive" />;
    return <Minus className="icon-sm icon-muted" />;
  };
  
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const getEnabledColumns = () => {
    if (!displayConfig) return null;
    return displayConfig.columns
      .filter(col => col.enabled)
      .sort((a, b) => a.order - b.order);
  };

  const renderCellValue = (item: any, columnId: string) => {
    const enrichedItem = calculateAdditionalColumns(item);
    
    switch (columnId) {
      case 'date':
        return new Date(enrichedItem.date).toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        });
      case 'dayOfWeek':
        return enrichedItem.dayOfWeek;
      case 'function':
      case 'jobFunction':
        return enrichedItem.jobFunctionType || enrichedItem.jobFunction;
      case 'task':
        return enrichedItem.task;
      case 'site':
        return enrichedItem.site || enrichedItem.siteName;
      case 'performance':
        const perf = enrichedItem.performance || enrichedItem.avgPerformance;
        const perfLevel = perf < 60 ? 'critical' : 
                         perf < 75 ? 'warning' :
                         perf < 90 ? 'good' : 'excellent';
        return (
          <Badge variant="outline" className={`performance-badge-${perfLevel}`}>
            {perf.toFixed(1)}%
          </Badge>
        );
      case 'budgeted':
        return (enrichedItem.budgetedVolume || 0).toLocaleString();
      case 'budgetedRate':
        return (enrichedItem.budgetedRate || 0).toFixed(1);
      case 'budgetedHours':
        return (enrichedItem.budgetedHours || 0).toFixed(1);
      case 'forecasted':
        return (enrichedItem.forecastedVolume || 0).toLocaleString();
      case 'actual':
        return (enrichedItem.actualVolume || enrichedItem.volume || enrichedItem.totalVolume || 0).toLocaleString();
      case 'hours':
        return (enrichedItem.actualHours || enrichedItem.hours || enrichedItem.totalHours || 0).toFixed(1);
      case 'unitsPerHour':
        return enrichedItem.unitsPerHour.toFixed(1);
      case 'variance':
        const variance = enrichedItem.variance || 0;
        return (
          <span className={variance < 0 ? 'text-destructive' : 'text-success'}>
            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
          </span>
        );
      case 'efficiency':
        return enrichedItem.efficiency ? `${enrichedItem.efficiency.toFixed(1)}%` : 'N/A';
      default:
        return enrichedItem[columnId] || '-';
    }
  };

  const renderGroupedTable = (data: any[], dataType: 'exception' | 'daily' | 'weekly') => {
    if (!displayConfig) return null;

    const enabledColumns = getEnabledColumns();
    if (!enabledColumns) return null;

    const groupedData = groupReportData(data, displayConfig.grouping, dataType);
    const columnGroups = displayConfig.columnGroups || [];
    
    // Build header rows with column groups
    const hasColumnGroups = columnGroups.length > 0 && enabledColumns.some(col => col.groupId);
    
    const renderTableHeaders = () => {
      if (!hasColumnGroups) {
        return (
          <TableRow>
            {enabledColumns.map(col => (
              <TableHead key={col.id}>{col.label}</TableHead>
            ))}
          </TableRow>
        );
      }
      
      // Render two rows: group headers and column headers
      const groupHeaderRow: JSX.Element[] = [];
      const columnHeaderRow: JSX.Element[] = [];
      
      let currentIndex = 0;
      while (currentIndex < enabledColumns.length) {
        const col = enabledColumns[currentIndex];
        
        if (col.groupId) {
          const group = columnGroups.find(g => g.id === col.groupId);
          if (group) {
            // Count how many consecutive columns belong to this group
            let groupSpan = 1;
            while (
              currentIndex + groupSpan < enabledColumns.length &&
              enabledColumns[currentIndex + groupSpan].groupId === col.groupId
            ) {
              groupSpan++;
            }
            
            // Add group header spanning multiple columns
            groupHeaderRow.push(
              <TableHead 
                key={`group-${col.groupId}-${currentIndex}`}
                colSpan={groupSpan}
                className="table-group-header"
              >
                {group.label}
              </TableHead>
            );
            
            // Add individual column headers
            for (let i = 0; i < groupSpan; i++) {
              const groupCol = enabledColumns[currentIndex + i];
              columnHeaderRow.push(
                <TableHead key={groupCol.id}>{groupCol.label}</TableHead>
              );
            }
            
            currentIndex += groupSpan;
          } else {
            // Group not found, treat as ungrouped
            groupHeaderRow.push(<TableHead key={`empty-${currentIndex}`}></TableHead>);
            columnHeaderRow.push(<TableHead key={col.id}>{col.label}</TableHead>);
            currentIndex++;
          }
        } else {
          // Ungrouped column - spans both rows
          groupHeaderRow.push(<TableHead key={`empty-${currentIndex}`}></TableHead>);
          columnHeaderRow.push(<TableHead key={col.id}>{col.label}</TableHead>);
          currentIndex++;
        }
      }
      
      return (
        <>
          <TableRow>{groupHeaderRow}</TableRow>
          <TableRow>{columnHeaderRow}</TableRow>
        </>
      );
    };

    return (
      <>
        {groupedData.map((group: GroupedData) => {
          const isExpanded = expandedGroups.has(group.groupKey);
          const showGroupHeader = displayConfig.grouping.enabled && displayConfig.grouping.groupBy !== 'none';

          return (
            <section key={group.groupKey} className="report-group">
              {showGroupHeader && (
                <button onClick={() => toggleGroup(group.groupKey)} className="report-group-header">
                  <div className="report-group-title">
                    {isExpanded ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                    <span>{group.groupName}</span>
                  </div>
                  <div className="report-group-badges">
                    {group.summary?.avgPerformance && (
                      <Badge variant="outline">
                        Avg: {group.summary.avgPerformance.toFixed(1)}%
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {group.summary?.count} items
                    </Badge>
                  </div>
                </button>
              )}
              {isExpanded && (
                <Table>
                  <TableHeader>
                    {renderTableHeaders()}
                  </TableHeader>
                  <TableBody>
                    {group.items.map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        {enabledColumns.map(col => (
                          <TableCell key={col.id}>
                            {renderCellValue(item, col.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>
          );
        })}
      </>
    );
  };

  return (
    <>
      {/* Summary Metrics */}
      <section className="report-section">
        <h2 className="heading-section">Summary</h2>
        <div className="report-metrics">
          {summary.metrics.map((metric, index) => (
            <div key={index} className="report-metric">
              <span className="report-metric-label">{metric.label}</span>
              <div className="report-metric-row">
                <span className="report-metric-value">{metric.value}</span>
                {metric.trend && metric.trendValue && (
                  <div className="report-metric-trend">
                    {renderTrendIcon(metric.trend)}
                    <span className="text-detail">{metric.trendValue}</span>
                  </div>
                )}
              </div>
              {metric.performanceLevel && (
                <Badge variant="outline" className={`performance-badge-${metric.performanceLevel}`}>
                  {metric.performanceLevel}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Detailed Data */}
      <section className="report-section">
        {metadata.type === 'daily-performance' && (
          <>
            <h2 className="heading-section">Site Performance Breakdown</h2>
            {details.siteBreakdowns.map((site: any) => (
              <section key={site.siteId} className="report-site">
                <div className="report-site-header">
                  <h3>{site.siteName}</h3>
                  <Badge variant="outline" className={`performance-badge-${site.performanceLevel}`}>
                    {site.avgPerformance.toFixed(1)}%
                  </Badge>
                </div>
                <div className="report-site-stats">
                  <div>
                    <span className="text-muted">Volume</span>
                    <span>{site.totalVolume.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted">Hours</span>
                    <span>{site.totalHours.toFixed(1)}</span>
                  </div>
                </div>
                {site.jobFunctionBreakdown.length > 0 && (
                  <>
                    <h4 className="report-subsection-title">Job Functions</h4>
                    {displayConfig ? (
                      renderGroupedTable(site.jobFunctionBreakdown, 'daily')
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Function</TableHead>
                            <TableHead>Avg Performance</TableHead>
                            <TableHead>Budgeted</TableHead>
                            <TableHead>Forecasted</TableHead>
                            <TableHead>Actual</TableHead>
                            <TableHead>Total Hours</TableHead>
                            <TableHead>Avg Units/Hour</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {site.jobFunctionBreakdown.map((jf: any, idx: number) => {
                            const unitsPerHour = jf.totalHours > 0 ? jf.totalVolume / jf.totalHours : 0;
                            return (
                              <TableRow key={idx}>
                                <TableCell>{jf.jobFunctionType}</TableCell>
                                <TableCell>{jf.avgPerformance.toFixed(1)}%</TableCell>
                                <TableCell>{jf.budgetedVolume.toLocaleString()}</TableCell>
                                <TableCell>{jf.forecastedVolume.toLocaleString()}</TableCell>
                                <TableCell>{jf.totalVolume.toLocaleString()}</TableCell>
                                <TableCell>{jf.totalHours.toFixed(1)}</TableCell>
                                <TableCell>{unitsPerHour.toFixed(1)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </section>
            ))}
          </>
        )}

        {metadata.type === 'weekly-trend' && (
          <>
            <h2 className="heading-section">7-Day Performance Trend</h2>
            {displayConfig ? (
              renderGroupedTable(details.dailyData, 'weekly')
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Budgeted</TableHead>
                    <TableHead>Forecasted</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Units/Hour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.dailyData.map((day: any, idx: number) => {
                    const unitsPerHour = day.hours > 0 ? day.volume / day.hours : 0;
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', month: 'short', day: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>{day.performance.toFixed(1)}%</TableCell>
                        <TableCell>{day.budgetedVolume?.toLocaleString() || '0'}</TableCell>
                        <TableCell>{day.forecastedVolume?.toLocaleString() || '0'}</TableCell>
                        <TableCell>{day.volume.toLocaleString()}</TableCell>
                        <TableCell>{day.hours.toFixed(1)}</TableCell>
                        <TableCell>{unitsPerHour.toFixed(1)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            <section className="report-subsection">
              <h3 className="heading-section">Site Trends</h3>
              {details.siteTrends.map((site: any) => (
                <section key={site.siteId} className="report-site">
                  <div className="report-site-header">
                    <h4>{site.siteName}</h4>
                    <Badge variant="outline" className={`performance-badge-${site.performanceLevel}`}>
                      Avg: {site.avgPerformance.toFixed(1)}%
                    </Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Budgeted</TableHead>
                        <TableHead>Forecasted</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Units/Hour</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {site.dailyData.map((day: any, idx: number) => {
                        const unitsPerHour = day.hours > 0 ? day.volume / day.hours : 0;
                        return (
                          <TableRow key={idx}>
                            <TableCell>
                              {new Date(day.date).toLocaleDateString('en-US', { 
                                weekday: 'short', month: 'short', day: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell>{day.performance.toFixed(1)}%</TableCell>
                            <TableCell>{day.budgetedVolume?.toLocaleString() || '0'}</TableCell>
                            <TableCell>{day.forecastedVolume?.toLocaleString() || '0'}</TableCell>
                            <TableCell>{day.volume.toLocaleString()}</TableCell>
                            <TableCell>{day.hours.toFixed(1)}</TableCell>
                            <TableCell>{unitsPerHour.toFixed(1)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </section>
              ))}
            </section>
          </>
        )}

        {metadata.type === 'exception' && (
          <>
            <header className="report-exception-header">
              <h2 className="heading-section">Exception Details</h2>
              <div className="report-exception-summary">
                <AlertTriangle className="icon-sm icon-destructive" />
                <span className="text-muted">
                  {details.exceptions.length} instances below {metadata.filters?.threshold}% threshold
                </span>
              </div>
            </header>

            {details.siteExceptionCounts.length > 0 && (
              <section className="report-subsection">
                <h3 className="heading-section">Exceptions by Site</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Exception Count</TableHead>
                      <TableHead>Avg Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.siteExceptionCounts.map((site: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{site.siteName}</TableCell>
                        <TableCell>{site.exceptionCount}</TableCell>
                        <TableCell>{site.avgPerformance.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            )}

            <section className="report-subsection">
              <h2 className="heading-section">All Exceptions</h2>
              {displayConfig ? (
                renderGroupedTable(details.exceptions, 'exception')
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Job Function</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Budgeted</TableHead>
                      <TableHead>Forecasted</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.exceptions.map((exception: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {new Date(exception.date).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>{exception.site}</TableCell>
                        <TableCell>{exception.jobFunction}</TableCell>
                        <TableCell>{exception.task}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={exception.performance < 60 
                              ? 'performance-badge-critical'
                              : 'performance-badge-warning'
                            }
                          >
                            {exception.performance.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>{exception.budgetedVolume.toLocaleString()}</TableCell>
                        <TableCell>{exception.forecastedVolume.toLocaleString()}</TableCell>
                        <TableCell>{exception.actualVolume.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={exception.variance < 0 ? 'text-destructive' : 'text-success'}>
                            {exception.variance > 0 ? '+' : ''}{exception.variance.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="report-footer">
        <Separator />
        <div className="report-footer-content">
          <span className="text-detail">Supply Chain Performance Management System</span>
          <span className="text-detail">Page 1 of 1</span>
        </div>
      </footer>
    </>
  );
}