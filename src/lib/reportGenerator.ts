/**
 * Report Generator
 * Generates structured report data from various data sources
 */

import { 
  dailyMetrics, 
  sites, 
  jobFunctions, 
  tasks, 
  DailyMetrics, 
  Site, 
  JobFunction 
} from './mockData';
import { getPerformanceLevel } from './performanceUtils';

// ===== Report Types =====

export type ReportType = 
  | 'daily-performance' 
  | 'weekly-trend' 
  | 'exception';

export interface ReportMetadata {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  generatedAt: string;
  dateRange: {
    start: string;
    end: string;
  };
  filters?: {
    siteId?: string;
    jobFunctionType?: string;
    threshold?: number;
  };
}

export interface PerformanceMetric {
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  performanceLevel?: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface SitePerformanceSummary {
  siteId: string;
  siteName: string;
  avgPerformance: number;
  totalVolume: number;
  totalHours: number;
  performanceLevel: 'excellent' | 'good' | 'warning' | 'critical';
  jobFunctionBreakdown: {
    jobFunctionType: string;
    avgPerformance: number;
    totalVolume: number;
  }[];
}

export interface ExceptionItem {
  date: string;
  site: string;
  jobFunction: string;
  task: string;
  performance: number;
  budgetedVolume: number;
  actualVolume: number;
  variance: number;
}

export interface TrendDataPoint {
  date: string;
  performance: number;
  budgetedVolume?: number;
  forecastedVolume?: number;
  volume: number;
  hours: number;
}

export interface ReportData {
  metadata: ReportMetadata;
  summary: {
    metrics: PerformanceMetric[];
  };
  details: any; // Flexible structure for different report types
}

// ===== Helper Functions =====

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateTrend(current: number, previous: number): { trend: 'up' | 'down' | 'flat'; value: string } {
  if (previous === 0) return { trend: 'flat', value: '0%' };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.5) return { trend: 'flat', value: '0%' };
  return {
    trend: change > 0 ? 'up' : 'down',
    value: `${Math.abs(change).toFixed(1)}%`
  };
}

function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}

function filterMetricsByDateRange(startDate: string, endDate: string): DailyMetrics[] {
  return dailyMetrics.filter(m => m.date >= startDate && m.date <= endDate);
}

// ===== Report Generators =====

/**
 * Generate Daily Performance Report
 * Shows yesterday's performance across all sites and job functions
 */
export function generateDailyPerformanceReport(date?: string): ReportData {
  const reportDate = date || new Date(Date.now() - 86400000).toISOString().split('T')[0]; // Yesterday
  const metrics = dailyMetrics.filter(m => m.date === reportDate);
  
  // Calculate overall metrics
  const validPerformances = metrics
    .filter(m => m.performance !== null)
    .map(m => m.performance as number);
  const avgPerformance = calculateAverage(validPerformances);
  
  const totalVolume = metrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
  const totalHours = metrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
  const budgetedVolume = metrics.reduce((sum, m) => sum + m.budgetedVolume, 0);
  
  // Calculate previous day for trend
  const prevDate = new Date(reportDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevMetrics = dailyMetrics.filter(m => m.date === prevDate.toISOString().split('T')[0]);
  const prevPerformances = prevMetrics
    .filter(m => m.performance !== null)
    .map(m => m.performance as number);
  const prevAvgPerformance = calculateAverage(prevPerformances);
  
  const performanceTrend = calculateTrend(avgPerformance, prevAvgPerformance);
  
  // Site breakdowns
  const siteBreakdowns: SitePerformanceSummary[] = sites.map(site => {
    const siteMetrics = metrics.filter(m => m.siteId === site.id);
    const sitePerformances = siteMetrics
      .filter(m => m.performance !== null)
      .map(m => m.performance as number);
    const siteAvgPerformance = calculateAverage(sitePerformances);
    
    // Job function breakdown
    const siteFunctions = jobFunctions.filter(jf => jf.siteId === site.id);
    const jobFunctionBreakdown = siteFunctions.map(jf => {
      const jfMetrics = siteMetrics.filter(m => m.jobFunctionId === jf.id);
      const jfPerformances = jfMetrics
        .filter(m => m.performance !== null)
        .map(m => m.performance as number);
      return {
        jobFunctionType: jf.name,
        avgPerformance: calculateAverage(jfPerformances),
        budgetedVolume: jfMetrics.reduce((sum, m) => sum + m.budgetedVolume, 0),
        forecastedVolume: jfMetrics.reduce((sum, m) => sum + m.forecastedVolume, 0),
        totalVolume: jfMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0),
        totalHours: jfMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0)
      };
    });
    
    return {
      siteId: site.id,
      siteName: site.name,
      avgPerformance: siteAvgPerformance,
      totalVolume: siteMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0),
      totalHours: siteMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0),
      performanceLevel: getPerformanceLevel(siteAvgPerformance),
      jobFunctionBreakdown
    };
  });
  
  return {
    metadata: {
      id: `daily-${reportDate}`,
      type: 'daily-performance',
      title: 'Daily Performance Report',
      description: `Performance summary for ${new Date(reportDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: reportDate,
        end: reportDate
      }
    },
    summary: {
      metrics: [
        {
          label: 'Average Performance',
          value: `${avgPerformance.toFixed(1)}%`,
          trend: performanceTrend.trend,
          trendValue: performanceTrend.value,
          performanceLevel: getPerformanceLevel(avgPerformance)
        },
        {
          label: 'Total Volume',
          value: totalVolume.toLocaleString(),
          performanceLevel: getPerformanceLevel((totalVolume / budgetedVolume) * 100)
        },
        {
          label: 'Total Hours',
          value: totalHours.toFixed(1),
        },
        {
          label: 'Sites Reporting',
          value: `${sites.length}`,
        }
      ]
    },
    details: {
      siteBreakdowns
    }
  };
}

/**
 * Generate Weekly Trend Report
 * Shows 7-day performance trends with comparisons
 */
export function generateWeeklyTrendReport(endDate?: string): ReportData {
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const startStr = start.toISOString().split('T')[0];
  
  const metrics = filterMetricsByDateRange(startStr, end);
  
  // Calculate daily aggregates for trend
  const dailyData: TrendDataPoint[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayMetrics = metrics.filter(m => m.date === dateStr);
    
    const dayPerformances = dayMetrics
      .filter(m => m.performance !== null)
      .map(m => m.performance as number);
    
    dailyData.push({
      date: dateStr,
      performance: calculateAverage(dayPerformances),
      budgetedVolume: dayMetrics.reduce((sum, m) => sum + m.budgetedVolume, 0),
      forecastedVolume: dayMetrics.reduce((sum, m) => sum + m.forecastedVolume, 0),
      volume: dayMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0),
      hours: dayMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0)
    });
  }
  
  // Calculate week-over-week comparison
  const thisWeekAvg = calculateAverage(dailyData.map(d => d.performance));
  
  const prevWeekStart = new Date(start);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(start);
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
  const prevWeekMetrics = filterMetricsByDateRange(
    prevWeekStart.toISOString().split('T')[0],
    prevWeekEnd.toISOString().split('T')[0]
  );
  const prevWeekPerformances = prevWeekMetrics
    .filter(m => m.performance !== null)
    .map(m => m.performance as number);
  const prevWeekAvg = calculateAverage(prevWeekPerformances);
  
  const weekTrend = calculateTrend(thisWeekAvg, prevWeekAvg);
  
  // Site trends
  const siteTrends = sites.map(site => {
    const siteMetrics = metrics.filter(m => m.siteId === site.id);
    const sitePerformances = siteMetrics
      .filter(m => m.performance !== null)
      .map(m => m.performance as number);
    const siteAvgPerformance = calculateAverage(sitePerformances);
    
    const siteDailyData = dailyData.map(day => {
      const dayMetrics = siteMetrics.filter(m => m.date === day.date);
      const dayPerformances = dayMetrics
        .filter(m => m.performance !== null)
        .map(m => m.performance as number);
      return {
        date: day.date,
        performance: calculateAverage(dayPerformances),
        budgetedVolume: dayMetrics.reduce((sum, m) => sum + m.budgetedVolume, 0),
        forecastedVolume: dayMetrics.reduce((sum, m) => sum + m.forecastedVolume, 0),
        volume: dayMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0),
        hours: dayMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0)
      };
    });
    
    return {
      siteId: site.id,
      siteName: site.name,
      avgPerformance: siteAvgPerformance,
      performanceLevel: getPerformanceLevel(siteAvgPerformance),
      dailyData: siteDailyData
    };
  });
  
  const totalVolume = dailyData.reduce((sum, d) => sum + d.volume, 0);
  const totalHours = dailyData.reduce((sum, d) => sum + d.hours, 0);
  
  return {
    metadata: {
      id: `weekly-${startStr}-${end}`,
      type: 'weekly-trend',
      title: 'Weekly Trend Analysis',
      description: `7-day performance trends from ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to ${new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: startStr,
        end: end
      }
    },
    summary: {
      metrics: [
        {
          label: 'Week Average Performance',
          value: `${thisWeekAvg.toFixed(1)}%`,
          trend: weekTrend.trend,
          trendValue: weekTrend.value,
          performanceLevel: getPerformanceLevel(thisWeekAvg)
        },
        {
          label: 'Total Weekly Volume',
          value: totalVolume.toLocaleString(),
        },
        {
          label: 'Total Weekly Hours',
          value: totalHours.toFixed(1),
        },
        {
          label: 'Days Analyzed',
          value: '7',
        }
      ]
    },
    details: {
      dailyData,
      siteTrends
    }
  };
}

/**
 * Generate Exception Report
 * Shows all instances where performance fell below threshold
 */
export function generateExceptionReport(
  threshold: number = 75, 
  days: number = 7
): ReportData {
  const dateRange = getDateRange(days);
  const metrics = filterMetricsByDateRange(dateRange.start, dateRange.end);
  
  // Find all exceptions
  const exceptions: ExceptionItem[] = [];
  
  metrics.forEach(metric => {
    if (metric.performance !== null && metric.performance < threshold) {
      const site = sites.find(s => s.id === metric.siteId);
      const jobFunction = jobFunctions.find(jf => jf.id === metric.jobFunctionId);
      const task = tasks.find(t => t.id === metric.taskId);
      
      if (site && jobFunction && task) {
        exceptions.push({
          date: metric.date,
          site: site.name,
          jobFunction: jobFunction.name,
          task: task.name,
          performance: metric.performance,
          budgetedVolume: metric.budgetedVolume,
          forecastedVolume: metric.forecastedVolume,
          actualVolume: metric.actualVolume || 0,
          variance: ((metric.actualVolume || 0) - metric.budgetedVolume) / metric.budgetedVolume * 100
        });
      }
    }
  });
  
  // Sort by performance (worst first)
  exceptions.sort((a, b) => a.performance - b.performance);
  
  // Calculate summary statistics
  const avgExceptionPerformance = calculateAverage(exceptions.map(e => e.performance));
  const criticalExceptions = exceptions.filter(e => e.performance < 60).length;
  const warningExceptions = exceptions.filter(e => e.performance >= 60 && e.performance < threshold).length;
  
  // Site exception breakdown
  const siteExceptionCounts = sites.map(site => {
    const siteExceptions = exceptions.filter(e => e.site === site.name);
    return {
      siteName: site.name,
      exceptionCount: siteExceptions.length,
      avgPerformance: calculateAverage(siteExceptions.map(e => e.performance))
    };
  }).filter(s => s.exceptionCount > 0);
  
  return {
    metadata: {
      id: `exception-${dateRange.start}-${dateRange.end}`,
      type: 'exception',
      title: 'Exception Report',
      description: `Performance below ${threshold}% threshold - Last ${days} days`,
      generatedAt: new Date().toISOString(),
      dateRange,
      filters: {
        threshold
      }
    },
    summary: {
      metrics: [
        {
          label: 'Total Exceptions',
          value: exceptions.length.toString(),
          performanceLevel: exceptions.length > 50 ? 'critical' : exceptions.length > 20 ? 'warning' : 'good'
        },
        {
          label: 'Critical (<60%)',
          value: criticalExceptions.toString(),
          performanceLevel: 'critical'
        },
        {
          label: `Warning (${threshold}%-60%)`,
          value: warningExceptions.toString(),
          performanceLevel: 'warning'
        },
        {
          label: 'Avg Exception Performance',
          value: `${avgExceptionPerformance.toFixed(1)}%`,
          performanceLevel: getPerformanceLevel(avgExceptionPerformance)
        }
      ]
    },
    details: {
      exceptions,
      siteExceptionCounts
    }
  };
}

/**
 * Get available report types
 */
export function getAvailableReports() {
  return [
    {
      type: 'daily-performance' as ReportType,
      name: 'Daily Performance Report',
      description: 'Yesterday\'s performance across all sites and job functions',
      icon: 'calendar',
      estimatedRows: 50
    },
    {
      type: 'weekly-trend' as ReportType,
      name: 'Weekly Trend Analysis',
      description: '7-day performance trends with week-over-week comparison',
      icon: 'trending-up',
      estimatedRows: 40
    },
    {
      type: 'exception' as ReportType,
      name: 'Exception Report',
      description: 'All instances where performance fell below threshold',
      icon: 'alert-triangle',
      estimatedRows: 'Variable'
    }
  ];
}
