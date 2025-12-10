/**
 * Report Grouping Utilities
 * Handles grouping and sorting of report data
 */

import { GroupingConfig } from '../components/ReportColumnConfig';
import { getPerformanceLevel } from './performanceUtils';

export interface GroupedData {
  groupName: string;
  groupKey: string;
  items: any[];
  summary?: {
    avgPerformance?: number;
    totalVolume?: number;
    totalHours?: number;
    count: number;
  };
}

/**
 * Group report data based on configuration
 */
export function groupReportData(
  data: any[],
  grouping: GroupingConfig,
  dataType: 'exception' | 'daily' | 'weekly'
): GroupedData[] {
  if (!grouping.enabled || grouping.groupBy === 'none') {
    return [{
      groupName: 'All Data',
      groupKey: 'all',
      items: data,
      summary: calculateSummary(data),
    }];
  }

  const groups = new Map<string, any[]>();

  data.forEach(item => {
    let groupKey = '';
    let groupName = '';

    switch (grouping.groupBy) {
      case 'site':
        groupKey = item.site || item.siteName || 'Unknown';
        groupName = groupKey;
        break;

      case 'jobFunction':
        groupKey = item.jobFunction || 'Unknown';
        groupName = groupKey;
        break;

      case 'performanceLevel':
        const level = getPerformanceLevel(item.performance || item.avgPerformance || 0);
        groupKey = level;
        groupName = level.charAt(0).toUpperCase() + level.slice(1);
        break;

      case 'date':
        // Group by week for weekly data
        if (dataType === 'weekly') {
          const date = new Date(item.date);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          groupKey = weekStart.toISOString().split('T')[0];
          groupName = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        } else {
          groupKey = item.date || 'Unknown';
          groupName = new Date(groupKey).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          });
        }
        break;

      default:
        groupKey = 'all';
        groupName = 'All Data';
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  });

  // Convert to array and add summaries
  const grouped: GroupedData[] = Array.from(groups.entries()).map(([key, items]) => ({
    groupKey: key,
    groupName: key,
    items,
    summary: calculateSummary(items),
  }));

  // Sort groups
  return sortGroups(grouped, grouping);
}

/**
 * Calculate summary statistics for a group
 */
function calculateSummary(items: any[]): GroupedData['summary'] {
  if (items.length === 0) {
    return { count: 0 };
  }

  const performances = items
    .map(item => item.performance || item.avgPerformance)
    .filter(p => p != null && !isNaN(p));

  const volumes = items
    .map(item => item.actualVolume || item.volume || item.totalVolume)
    .filter(v => v != null && !isNaN(v));

  const hours = items
    .map(item => item.actualHours || item.hours || item.totalHours)
    .filter(h => h != null && !isNaN(h));

  return {
    avgPerformance: performances.length > 0
      ? performances.reduce((sum, p) => sum + p, 0) / performances.length
      : undefined,
    totalVolume: volumes.length > 0
      ? volumes.reduce((sum, v) => sum + v, 0)
      : undefined,
    totalHours: hours.length > 0
      ? hours.reduce((sum, h) => sum + h, 0)
      : undefined,
    count: items.length,
  };
}

/**
 * Sort groups based on configuration
 */
function sortGroups(groups: GroupedData[], grouping: GroupingConfig): GroupedData[] {
  const sorted = [...groups].sort((a, b) => {
    let comparison = 0;

    switch (grouping.sortBy) {
      case 'name':
        comparison = a.groupName.localeCompare(b.groupName);
        break;

      case 'performance':
        const perfA = a.summary?.avgPerformance || 0;
        const perfB = b.summary?.avgPerformance || 0;
        comparison = perfA - perfB;
        break;

      case 'volume':
        const volA = a.summary?.totalVolume || 0;
        const volB = b.summary?.totalVolume || 0;
        comparison = volA - volB;
        break;
    }

    return grouping.sortDirection === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Calculate additional columns for display
 */
export function calculateAdditionalColumns(item: any): any {
  const budgeted = item.budgetedVolume || 0;
  const forecasted = item.forecastedVolume || 0;
  const actual = item.actualVolume || item.volume || item.totalVolume || 0;
  const hours = item.actualHours || item.hours || item.totalHours || 0;

  return {
    ...item,
    variance: budgeted > 0 ? ((actual - budgeted) / budgeted * 100) : 0,
    varianceFromForecast: forecasted > 0 ? ((actual - forecasted) / forecasted * 100) : 0,
    unitsPerHour: hours > 0 ? actual / hours : 0,
    efficiency: item.budgetedRate && hours > 0 
      ? (actual / hours / item.budgetedRate * 100) 
      : undefined,
    dayOfWeek: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' }) : undefined,
  };
}

/**
 * Filter columns based on configuration
 */
export function filterColumns(columns: any[], enabledColumns: string[]): any[] {
  return columns.filter(col => {
    const colId = col.id || col.key || '';
    return enabledColumns.includes(colId);
  });
}

/**
 * Reorder columns based on configuration
 */
export function reorderColumns(columns: any[], columnOrder: { id: string; order: number }[]): any[] {
  const orderMap = new Map(columnOrder.map(c => [c.id, c.order]));
  
  return [...columns].sort((a, b) => {
    const aOrder = orderMap.get(a.id || a.key || '') ?? 999;
    const bOrder = orderMap.get(b.id || b.key || '') ?? 999;
    return aOrder - bOrder;
  });
}
