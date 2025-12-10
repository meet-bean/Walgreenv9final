// Mock data structure for the Supply Chain Performance Management System
export interface Site {
  id: string;
  name: string;
  location: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface JobFunction {
  id: string;
  siteId: string;
  name: string;
  supervisorName: string;
  type: string; // 'receiving', 'breakdown', 'putaway', 'picking', 'staging', 'loading'
}

export interface Task {
  id: string;
  jobFunctionType: string; // References JobFunction.type
  name: string;
}

export interface DailyMetrics {
  id: string;
  date: string;
  siteId: string;
  jobFunctionId: string;
  taskId: string;
  // From budgeted data
  budgetedVolume: number;
  budgetedRate: number; // Units per hour (UPH)
  budgetedHours: number; // Calculated: budgetedVolume / budgetedRate
  // Forecasted data
  forecastedVolume: number;
  expectedHours: number; // Calculated: forecastedVolume / budgetedRate
  // Actual data (manual input)
  actualVolume: number | null;
  actualHours: number | null; // Calculated: actualVolume / budgetedRate
  // Performance metrics
  budgetedOT: number;
  totalHours: number; // expectedHours + budgetedOT
  performance: number | null; // Calculated: (expectedHours / actualHours) * 100
}

// Sites/Distribution Centers
export const sites: Site[] = [
  { id: 'DC-001', name: 'Philadelphia DC', location: 'Philadelphia, PA', region: 'Northeast', latitude: 39.9526, longitude: -75.1652 },
  { id: 'DC-002', name: 'Boston DC', location: 'Boston, MA', region: 'Northeast', latitude: 42.3601, longitude: -71.0589 },
  { id: 'DC-003', name: 'Atlanta DC', location: 'Atlanta, GA', region: 'Southeast', latitude: 33.7490, longitude: -84.3880 },
  { id: 'DC-004', name: 'Charlotte DC', location: 'Charlotte, NC', region: 'Southeast', latitude: 35.2271, longitude: -80.8431 },
  { id: 'DC-005', name: 'Miami DC', location: 'Miami, FL', region: 'Southeast', latitude: 25.7617, longitude: -80.1918 },
];

// Job Functions (Orange rows in spreadsheet)
export const jobFunctions: JobFunction[] = [
  // DC-001 - Philadelphia DC
  { id: 'receiving', siteId: 'DC-001', name: 'Receiving', supervisorName: 'Mike Rodriguez', type: 'receiving' },
  { id: 'breakdown', siteId: 'DC-001', name: 'Breakdown', supervisorName: 'Lisa Johnson', type: 'breakdown' },
  { id: 'putaway', siteId: 'DC-001', name: 'Put Away', supervisorName: 'David Kim', type: 'putaway' },
  { id: 'picking', siteId: 'DC-001', name: 'Picking', supervisorName: 'Amanda White', type: 'picking' },
  { id: 'staging', siteId: 'DC-001', name: 'Staging', supervisorName: 'Carlos Martinez', type: 'staging' },
  { id: 'loading', siteId: 'DC-001', name: 'Loading', supervisorName: 'Jennifer Brown', type: 'loading' },
  
  // DC-002 - Boston DC
  { id: 'receiving-dc2', siteId: 'DC-002', name: 'Receiving', supervisorName: 'Patrick O\'Brien', type: 'receiving' },
  { id: 'breakdown-dc2', siteId: 'DC-002', name: 'Breakdown', supervisorName: 'Sarah Mitchell', type: 'breakdown' },
  { id: 'putaway-dc2', siteId: 'DC-002', name: 'Put Away', supervisorName: 'James Sullivan', type: 'putaway' },
  { id: 'picking-dc2', siteId: 'DC-002', name: 'Picking', supervisorName: 'Emily Chen', type: 'picking' },
  { id: 'staging-dc2', siteId: 'DC-002', name: 'Staging', supervisorName: 'Michael Barnes', type: 'staging' },
  { id: 'loading-dc2', siteId: 'DC-002', name: 'Loading', supervisorName: 'Rebecca Davis', type: 'loading' },
  
  // DC-003 - Atlanta DC
  { id: 'receiving-dc3', siteId: 'DC-003', name: 'Receiving', supervisorName: 'Marcus Williams', type: 'receiving' },
  { id: 'breakdown-dc3', siteId: 'DC-003', name: 'Breakdown', supervisorName: 'Jasmine Taylor', type: 'breakdown' },
  { id: 'putaway-dc3', siteId: 'DC-003', name: 'Put Away', supervisorName: 'Robert Jackson', type: 'putaway' },
  { id: 'picking-dc3', siteId: 'DC-003', name: 'Picking', supervisorName: 'Nicole Anderson', type: 'picking' },
  { id: 'staging-dc3', siteId: 'DC-003', name: 'Staging', supervisorName: 'Anthony Moore', type: 'staging' },
  { id: 'loading-dc3', siteId: 'DC-003', name: 'Loading', supervisorName: 'Michelle Harris', type: 'loading' },
  
  // DC-004 - Charlotte DC
  { id: 'receiving-dc4', siteId: 'DC-004', name: 'Receiving', supervisorName: 'Daniel Thompson', type: 'receiving' },
  { id: 'breakdown-dc4', siteId: 'DC-004', name: 'Breakdown', supervisorName: 'Laura Garcia', type: 'breakdown' },
  { id: 'putaway-dc4', siteId: 'DC-004', name: 'Put Away', supervisorName: 'Christopher Lee', type: 'putaway' },
  { id: 'picking-dc4', siteId: 'DC-004', name: 'Picking', supervisorName: 'Stephanie Wilson', type: 'picking' },
  { id: 'staging-dc4', siteId: 'DC-004', name: 'Staging', supervisorName: 'Brian Martinez', type: 'staging' },
  { id: 'loading-dc4', siteId: 'DC-004', name: 'Loading', supervisorName: 'Angela Robinson', type: 'loading' },
  
  // DC-005 - Miami DC
  { id: 'receiving-dc5', siteId: 'DC-005', name: 'Receiving', supervisorName: 'Ricardo Fernandez', type: 'receiving' },
  { id: 'breakdown-dc5', siteId: 'DC-005', name: 'Breakdown', supervisorName: 'Maria Gonzalez', type: 'breakdown' },
  { id: 'putaway-dc5', siteId: 'DC-005', name: 'Put Away', supervisorName: 'Victor Santos', type: 'putaway' },
  { id: 'picking-dc5', siteId: 'DC-005', name: 'Picking', supervisorName: 'Carmen Rivera', type: 'picking' },
  { id: 'staging-dc5', siteId: 'DC-005', name: 'Staging', supervisorName: 'Luis Diaz', type: 'staging' },
  { id: 'loading-dc5', siteId: 'DC-005', name: 'Loading', supervisorName: 'Ana Torres', type: 'loading' },
];

// Tasks (White rows in spreadsheet)
export const tasks: Task[] = [
  // Receiving Tasks (8 tasks)
  { id: 'recv-unload', jobFunctionType: 'receiving', name: 'Unload Trucks' },
  { id: 'recv-inspect', jobFunctionType: 'receiving', name: 'Inspect Shipments' },
  { id: 'recv-scan', jobFunctionType: 'receiving', name: 'Scan & Process' },
  { id: 'recv-damage', jobFunctionType: 'receiving', name: 'Damage Assessment' },
  { id: 'recv-count', jobFunctionType: 'receiving', name: 'Physical Count Verification' },
  { id: 'recv-transfer', jobFunctionType: 'receiving', name: 'Transfer to Staging' },
  { id: 'recv-temperature', jobFunctionType: 'receiving', name: 'Temperature Check (Pharma)' },
  { id: 'recv-paperwork', jobFunctionType: 'receiving', name: 'Process Documentation' },
  
  // Breakdown Tasks (7 tasks)
  { id: 'break-pallets', jobFunctionType: 'breakdown', name: 'Break Down Pallets' },
  { id: 'break-sort', jobFunctionType: 'breakdown', name: 'Sort Products' },
  { id: 'break-repack', jobFunctionType: 'breakdown', name: 'Repackage Items' },
  { id: 'break-label', jobFunctionType: 'breakdown', name: 'Apply Labels' },
  { id: 'break-quality', jobFunctionType: 'breakdown', name: 'Quality Check' },
  { id: 'break-consolidate', jobFunctionType: 'breakdown', name: 'Consolidate Items' },
  { id: 'break-prep', jobFunctionType: 'breakdown', name: 'Prepare for Put Away' },
  
  // Put Away Tasks (9 tasks)
  { id: 'put-transport', jobFunctionType: 'putaway', name: 'Transport to Shelves' },
  { id: 'put-stock', jobFunctionType: 'putaway', name: 'Stock Shelves' },
  { id: 'put-high-bay', jobFunctionType: 'putaway', name: 'High Bay Storage' },
  { id: 'put-floor', jobFunctionType: 'putaway', name: 'Floor Storage' },
  { id: 'put-bulk', jobFunctionType: 'putaway', name: 'Bulk Storage' },
  { id: 'put-fast-move', jobFunctionType: 'putaway', name: 'Fast-Moving Items' },
  { id: 'put-slow-move', jobFunctionType: 'putaway', name: 'Slow-Moving Items' },
  { id: 'put-scan-verify', jobFunctionType: 'putaway', name: 'Scan & Verify Location' },
  { id: 'put-refrigerated', jobFunctionType: 'putaway', name: 'Refrigerated Storage' },
  
  // Picking Tasks (12 tasks)
  { id: 'pick-orders', jobFunctionType: 'picking', name: 'Pick Orders' },
  { id: 'pick-verify', jobFunctionType: 'picking', name: 'Verify Picks' },
  { id: 'pick-batch', jobFunctionType: 'picking', name: 'Batch Picking' },
  { id: 'pick-zone', jobFunctionType: 'picking', name: 'Zone Picking' },
  { id: 'pick-wave', jobFunctionType: 'picking', name: 'Wave Picking' },
  { id: 'pick-priority', jobFunctionType: 'picking', name: 'Priority Orders' },
  { id: 'pick-bulk', jobFunctionType: 'picking', name: 'Bulk Picking' },
  { id: 'pick-piece', jobFunctionType: 'picking', name: 'Piece Picking' },
  { id: 'pick-case', jobFunctionType: 'picking', name: 'Case Picking' },
  { id: 'pick-pallet', jobFunctionType: 'picking', name: 'Pallet Picking' },
  { id: 'pick-replenish', jobFunctionType: 'picking', name: 'Replenishment Picks' },
  { id: 'pick-quality', jobFunctionType: 'picking', name: 'Quality Audit Picks' },
  
  // Staging Tasks (8 tasks)
  { id: 'stage-organize', jobFunctionType: 'staging', name: 'Organize Shipments' },
  { id: 'stage-label', jobFunctionType: 'staging', name: 'Label Shipments' },
  { id: 'stage-consolidate', jobFunctionType: 'staging', name: 'Consolidate Orders' },
  { id: 'stage-sort', jobFunctionType: 'staging', name: 'Sort by Route' },
  { id: 'stage-wrap', jobFunctionType: 'staging', name: 'Wrap & Secure' },
  { id: 'stage-verify', jobFunctionType: 'staging', name: 'Verify Completeness' },
  { id: 'stage-weigh', jobFunctionType: 'staging', name: 'Weigh Shipments' },
  { id: 'stage-manifest', jobFunctionType: 'staging', name: 'Generate Manifests' },
  
  // Loading Tasks (7 tasks)
  { id: 'load-prep', jobFunctionType: 'loading', name: 'Prepare Dock' },
  { id: 'load-trucks', jobFunctionType: 'loading', name: 'Load Trucks' },
  { id: 'load-sequence', jobFunctionType: 'loading', name: 'Sequence by Delivery' },
  { id: 'load-secure', jobFunctionType: 'loading', name: 'Secure Cargo' },
  { id: 'load-inspect', jobFunctionType: 'loading', name: 'Final Inspection' },
  { id: 'load-document', jobFunctionType: 'loading', name: 'Complete Documentation' },
  { id: 'load-seal', jobFunctionType: 'loading', name: 'Seal & Verify Truck' },
];

// Generate daily metrics for the last 180 days (6 months)
const generateDailyMetrics = (): DailyMetrics[] => {
  const metrics: DailyMetrics[] = [];
  const today = new Date();
  
  // Generate 180 days of historical data for trend analysis
  for (let dayOffset = 0; dayOffset < 180; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    
    // Determine day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Only populate actual data for past days (not today)
    const isToday = dayOffset === 0;
    const isPastDay = dayOffset > 0;
    
    sites.forEach(site => {
      const siteFunctions = jobFunctions.filter(jf => jf.siteId === site.id);
      
      siteFunctions.forEach(jobFunc => {
        const jobTasks = tasks.filter(t => t.jobFunctionType === jobFunc.type);
        
        jobTasks.forEach(task => {
          // Base volumes with realistic variation
          const baseVolume = Math.floor(Math.random() * 5000) + 2000;
          
          // Weekend volumes are typically 40-60% of weekday volumes
          const weekendMultiplier = isWeekend ? (0.4 + Math.random() * 0.2) : 1.0;
          
          // Seasonal variation: Add slight trend over time (simulate growth/decline)
          // More recent data has slight uptick (1-10% over 6 months)
          const seasonalMultiplier = 1.0 + (dayOffset / 180) * 0.05;
          
          const budgetedVolume = Math.floor(baseVolume * weekendMultiplier * seasonalMultiplier);
          const budgetedRate = Math.floor(Math.random() * 100) + 150; // 150-250 UPH
          const budgetedHours = budgetedVolume / budgetedRate;
          
          // Forecasted volume with realistic variance
          const forecastedVolume = Math.floor(budgetedVolume * (0.85 + Math.random() * 0.3));
          const expectedHours = forecastedVolume / budgetedRate;
          
          let actualVolume: number | null = null;
          let actualHours: number | null = null;
          let performance: number | null = null;
          
          if (isPastDay) {
            // Create realistic variance with both over and under budget scenarios
            // Use task and site to create consistent patterns
            const taskIndex = tasks.indexOf(task);
            const siteIndex = sites.indexOf(site);
            const jobFuncIndex = jobFunctions.indexOf(jobFunc);
            
            // Different patterns for different combinations
            const seed = (taskIndex + siteIndex * 3 + jobFuncIndex * 7) % 10;
            
            // Some sites/tasks consistently over budget, some under budget
            let hoursMultiplier: number;
            if (seed < 3) {
              // Under budget - efficient operations (70-95% of expected hours)
              hoursMultiplier = 0.70 + Math.random() * 0.25;
            } else if (seed < 7) {
              // Near budget - normal operations (90-110% of expected hours)
              hoursMultiplier = 0.90 + Math.random() * 0.20;
            } else {
              // Over budget - inefficient operations (105-140% of expected hours)
              hoursMultiplier = 1.05 + Math.random() * 0.35;
            }
            
            // Weekends tend to be less efficient
            if (isWeekend) {
              hoursMultiplier *= 1.1;
            }
            
            // Calculate actual based on expected with variance
            actualVolume = forecastedVolume; // Volume stays as forecasted
            actualHours = expectedHours * hoursMultiplier; // Hours vary
            
            // Avoid division by zero
            if (actualHours > 0) {
              performance = (expectedHours / actualHours) * 100;
            } else {
              performance = 100;
            }
          }
          
          const budgetedOT = budgetedHours * 0.05; // 5% OT budget
          const totalHours = expectedHours + budgetedOT;
          
          metrics.push({
            id: `${site.id}-${jobFunc.id}-${task.id}-${dateStr}`,
            date: dateStr,
            siteId: site.id,
            jobFunctionId: jobFunc.id,
            taskId: task.id,
            budgetedVolume,
            budgetedRate,
            budgetedHours,
            forecastedVolume,
            expectedHours,
            actualVolume,
            actualHours,
            budgetedOT,
            totalHours,
            performance,
          });
        });
      });
    });
  }
  
  return metrics;
};

export const dailyMetrics = generateDailyMetrics();

// Helper functions
export const getSiteById = (id: string): Site | undefined => {
  return sites.find(s => s.id === id);
};

export const getJobFunctionsBySite = (siteId: string): JobFunction[] => {
  return jobFunctions.filter(jf => jf.siteId === siteId);
};

export const getTasksByJobFunction = (jobFunctionId: string): Task[] => {
  const jobFunc = jobFunctions.find(jf => jf.id === jobFunctionId);
  if (!jobFunc) return [];
  return tasks.filter(t => t.jobFunctionType === jobFunc.type);
};

export const getMetricsByDate = (date: string): DailyMetrics[] => {
  return dailyMetrics.filter(m => m.date === date);
};

export const getMetricsBySiteAndDate = (siteId: string, date: string): DailyMetrics[] => {
  return dailyMetrics.filter(m => m.siteId === siteId && m.date === date);
};

export const getMetricsByJobFunctionAndDate = (jobFunctionId: string, date: string): DailyMetrics[] => {
  return dailyMetrics.filter(m => m.jobFunctionId === jobFunctionId && m.date === date);
};

export const updateActualVolume = (metricId: string, actualVolume: number): void => {
  const metric = dailyMetrics.find(m => m.id === metricId);
  if (metric) {
    metric.actualVolume = actualVolume;
    metric.actualHours = actualVolume / metric.budgetedRate;
    metric.performance = (metric.expectedHours / metric.actualHours) * 100;
  }
};

// Aggregate metrics for executive dashboard
export const getAggregateMetricsByDate = (date: string) => {
  const metricsForDate = getMetricsByDate(date);
  
  const totalBudgetedHours = metricsForDate.reduce((sum, m) => sum + m.budgetedHours, 0);
  const totalExpectedHours = metricsForDate.reduce((sum, m) => sum + m.expectedHours, 0);
  const totalActualHours = metricsForDate.reduce((sum, m) => sum + (m.actualHours || 0), 0);
  const totalBudgetedVolume = metricsForDate.reduce((sum, m) => sum + m.budgetedVolume, 0);
  const totalActualVolume = metricsForDate.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
  
  const metricsWithActuals = metricsForDate.filter(m => m.performance !== null);
  const avgPerformance = metricsWithActuals.length > 0
    ? metricsWithActuals.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithActuals.length
    : null;
  
  return {
    totalBudgetedHours,
    totalExpectedHours,
    totalActualHours,
    totalBudgetedVolume,
    totalActualVolume,
    avgPerformance,
    siteCount: sites.length,
    completionRate: metricsWithActuals.length / metricsForDate.length * 100,
  };
};

export const getSitePerformanceSummary = (date: string) => {
  return sites.map(site => {
    const siteMetrics = getMetricsBySiteAndDate(site.id, date);
    const metricsWithActuals = siteMetrics.filter(m => m.performance !== null);
    
    const totalExpectedHours = siteMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
    const totalActualHours = siteMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    const avgPerformance = metricsWithActuals.length > 0
      ? metricsWithActuals.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithActuals.length
      : null;
    
    return {
      site,
      totalExpectedHours,
      totalActualHours,
      avgPerformance,
      completionRate: metricsWithActuals.length / siteMetrics.length * 100,
    };
  });
};

// Date range queries for historical analysis
export const getMetricsByDateRange = (startDate: string, endDate: string): DailyMetrics[] => {
  return dailyMetrics.filter(m => m.date >= startDate && m.date <= endDate);
};

export const getMetricsBySiteAndDateRange = (siteId: string, startDate: string, endDate: string): DailyMetrics[] => {
  return dailyMetrics.filter(m => m.siteId === siteId && m.date >= startDate && m.date <= endDate);
};

export const getMetricsByJobFunctionAndDateRange = (jobFunctionId: string, startDate: string, endDate: string): DailyMetrics[] => {
  return dailyMetrics.filter(m => m.jobFunctionId === jobFunctionId && m.date >= startDate && m.date <= endDate);
};

// Weekly aggregations for trend analysis
export const getWeeklyAggregateMetrics = (startDate: string, endDate: string) => {
  const metrics = getMetricsByDateRange(startDate, endDate);
  const weeklyData: { [week: string]: DailyMetrics[] } = {};
  
  metrics.forEach(metric => {
    const date = new Date(metric.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Go to Sunday
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = [];
    }
    weeklyData[weekKey].push(metric);
  });
  
  return Object.entries(weeklyData).map(([week, weekMetrics]) => {
    const metricsWithActuals = weekMetrics.filter(m => m.performance !== null);
    const totalExpectedHours = weekMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
    const totalActualHours = weekMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    const avgPerformance = metricsWithActuals.length > 0
      ? metricsWithActuals.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithActuals.length
      : null;
    
    return {
      week,
      totalExpectedHours,
      totalActualHours,
      avgPerformance,
      completionRate: metricsWithActuals.length / weekMetrics.length * 100,
      recordCount: weekMetrics.length,
    };
  }).sort((a, b) => a.week.localeCompare(b.week));
};

// Monthly aggregations for executive reporting
export const getMonthlyAggregateMetrics = (startDate: string, endDate: string) => {
  const metrics = getMetricsByDateRange(startDate, endDate);
  const monthlyData: { [month: string]: DailyMetrics[] } = {};
  
  metrics.forEach(metric => {
    const monthKey = metric.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = [];
    }
    monthlyData[monthKey].push(metric);
  });
  
  return Object.entries(monthlyData).map(([month, monthMetrics]) => {
    const metricsWithActuals = monthMetrics.filter(m => m.performance !== null);
    const totalExpectedHours = monthMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
    const totalActualHours = monthMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    const totalBudgetedVolume = monthMetrics.reduce((sum, m) => sum + m.budgetedVolume, 0);
    const totalActualVolume = monthMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
    const avgPerformance = metricsWithActuals.length > 0
      ? metricsWithActuals.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithActuals.length
      : null;
    
    return {
      month,
      totalExpectedHours,
      totalActualHours,
      totalBudgetedVolume,
      totalActualVolume,
      avgPerformance,
      completionRate: metricsWithActuals.length / monthMetrics.length * 100,
      recordCount: monthMetrics.length,
    };
  }).sort((a, b) => a.month.localeCompare(b.month));
};

// Performance trend analysis
export const getPerformanceTrend = (siteId?: string, jobFunctionId?: string, days: number = 30) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = today.toISOString().split('T')[0];
  
  let metrics: DailyMetrics[];
  if (jobFunctionId) {
    metrics = getMetricsByJobFunctionAndDateRange(jobFunctionId, startDateStr, endDateStr);
  } else if (siteId) {
    metrics = getMetricsBySiteAndDateRange(siteId, startDateStr, endDateStr);
  } else {
    metrics = getMetricsByDateRange(startDateStr, endDateStr);
  }
  
  // Group by date
  const dailyData: { [date: string]: DailyMetrics[] } = {};
  metrics.forEach(metric => {
    if (!dailyData[metric.date]) {
      dailyData[metric.date] = [];
    }
    dailyData[metric.date].push(metric);
  });
  
  return Object.entries(dailyData).map(([date, dayMetrics]) => {
    const metricsWithActuals = dayMetrics.filter(m => m.performance !== null);
    const avgPerformance = metricsWithActuals.length > 0
      ? metricsWithActuals.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithActuals.length
      : null;
    
    return {
      date,
      avgPerformance,
      dataPoints: metricsWithActuals.length,
    };
  }).sort((a, b) => a.date.localeCompare(b.date));
};

// Get available date range for the dataset
export const getAvailableDateRange = () => {
  const dates = dailyMetrics.map(m => m.date).sort();
  return {
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    totalDays: new Set(dates).size,
    totalRecords: dailyMetrics.length,
  };
};

// ============================================
// DASHBOARD MANAGEMENT SYSTEM
// ============================================

export type DashboardSectionType = 
  | 'kpi-cards'
  | 'hours-chart'
  | 'top-tasks'
  | 'trend-chart'
  | 'rankings'
  | 'budget-tracking'
  | 'hierarchical-performance'
  | 'site-map'
  | 'line-chart'
  | 'bar-chart'
  | 'area-chart'
  | 'pie-chart'
  | 'combo-chart'
  | 'custom';

export interface DashboardSection {
  id: string;
  type: DashboardSectionType;
  title: string;
  description?: string;
  config?: any; // Section-specific configuration
  kpis?: string[]; // For KPI sections - list of KPIs to display
  order: number;
  enabled?: boolean; // Whether the section is visible
  columnSpan?: number; // Grid column span (3, 4, 6, 9, or 12)
  heightPx?: number; // Custom height in pixels
  kpiCards?: any[]; // KPI card configurations for kpi-cards type
  stackGroup?: string; // Optional: sections with the same stackGroup ID will be stacked vertically
  visibleToRoles?: UserRole[]; // Which roles can see this section (if undefined, uses dashboard default)
  useDefaultVisibility?: boolean; // If true, use dashboard's visibleToRoles instead of section's
}

export interface DashboardDefinition {
  id: string;
  name: string;
  description: string;
  createdBy: string; // User ID/name
  createdAt: string;
  updatedAt: string;
  version: number;
  isSystemDashboard: boolean; // True for the 3 core dashboards managed by VP
  sections: DashboardSection[];
  targetRole?: UserRole; // Which role this dashboard is designed for (legacy - use targetRoles)
  targetRoles?: UserRole[]; // Which roles this dashboard is designed for (supports multiple)
  visibleToRoles?: UserRole[]; // Dashboard-level visibility: which roles can see this dashboard (default for all sections)
  filters?: {
    allowDateRange?: boolean;
    allowSiteFilter?: boolean;
    allowAggregation?: boolean;
    showUnderperformingOnly?: boolean;
  };
}

export type UserRole = 'executive' | 'site-manager' | 'supervisor';

export interface PublishedDashboard {
  id: string;
  dashboardId: string;
  publishedBy: string;
  publishedAt: string;
  roles: UserRole[]; // Which roles can see this
  siteIds: string[]; // Empty array = all sites, otherwise specific sites only
  isActive: boolean;
  order: number; // Tab order for users
}

export interface DashboardChange {
  id: string;
  dashboardId: string;
  version: number;
  changedBy: string;
  changedAt: string;
  changeDescription: string;
  sectionsAdded: string[];
  sectionsRemoved: string[];
  sectionsModified: string[];
}

// Version History - Complete snapshot of each dashboard version
export interface DashboardVersion {
  id: string;
  dashboardId: string;
  version: number;
  snapshot: DashboardDefinition; // Complete dashboard state at this version
  changedBy: string;
  changedAt: string;
  changeType: 'created' | 'updated' | 'settings_changed' | 'sections_modified' | 'published';
  changeSummary: string; // User-friendly description of changes
  changes: {
    name?: { from: string; to: string };
    description?: { from: string; to: string };
    targetRole?: { from: UserRole; to: UserRole };
    sections?: {
      added: Array<{ id: string; title: string; type: string }>;
      removed: Array<{ id: string; title: string; type: string }>;
      reordered: boolean;
    };
    filters?: {
      changed: Array<{ field: string; from: any; to: any }>;
    };
  };
}

// Mock version history data
export const mockDashboardVersions: DashboardVersion[] = [];

// Helper function to generate version history for a dashboard
export function generateVersionHistory(dashboard: DashboardDefinition): DashboardVersion[] {
  const versions: DashboardVersion[] = [];
  
  // Version 1 - Initial creation
  const v1Snapshot = { ...dashboard, version: 1 };
  versions.push({
    id: `version-${dashboard.id}-1`,
    dashboardId: dashboard.id,
    version: 1,
    snapshot: v1Snapshot,
    changedBy: dashboard.createdBy,
    changedAt: dashboard.createdAt,
    changeType: 'created',
    changeSummary: 'Dashboard created',
    changes: {},
  });

  // Version 2 - Some modifications (if dashboard has more than 1 section)
  if (dashboard.sections.length > 1) {
    const v2Date = new Date(new Date(dashboard.createdAt).getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    const v2Snapshot = {
      ...dashboard,
      version: 2,
      sections: dashboard.sections.slice(0, -1), // Removed last section
      updatedAt: v2Date.toISOString(),
    };
    
    versions.push({
      id: `version-${dashboard.id}-2`,
      dashboardId: dashboard.id,
      version: 2,
      snapshot: v2Snapshot,
      changedBy: dashboard.createdBy,
      changedAt: v2Date.toISOString(),
      changeType: 'sections_modified',
      changeSummary: 'Added new sections',
      changes: {
        sections: {
          added: [{ 
            id: dashboard.sections[dashboard.sections.length - 1].id,
            title: dashboard.sections[dashboard.sections.length - 1].title,
            type: dashboard.sections[dashboard.sections.length - 1].type,
          }],
          removed: [],
          reordered: false,
        },
      },
    });
  }

  // Version 3 - Settings change
  if (dashboard.filters) {
    const v3Date = new Date(new Date(dashboard.createdAt).getTime() + 24 * 60 * 60 * 1000); // 1 day later
    versions.push({
      id: `version-${dashboard.id}-3`,
      dashboardId: dashboard.id,
      version: 3,
      snapshot: dashboard,
      changedBy: dashboard.createdBy,
      changedAt: v3Date.toISOString(),
      changeType: 'settings_changed',
      changeSummary: 'Updated filter settings',
      changes: {
        filters: {
          changed: [
            { field: 'allowDateRange', from: false, to: true },
          ],
        },
      },
    });
  }

  return versions;
}

// User notifications for dashboard changes
export interface DashboardNotification {
  id: string;
  userId: string;
  dashboardId: string;
  changeId: string;
  isRead: boolean;
  createdAt: string;
}

// ==== EXPORT & REPORTING ====
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'png';
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeRawData: boolean;
  recipients?: string[];
  schedule?: 'once' | 'daily' | 'weekly' | 'monthly';
  scheduledTime?: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  dashboardId: string;
  exportOptions: ExportOptions;
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  nextRun: string;
  isActive: boolean;
}

// ==== COMMENTS & ANNOTATIONS ====
export interface Comment {
  id: string;
  metricId: string; // Links to task/job function/site
  metricType: 'task' | 'job-function' | 'site';
  userId: string;
  userName: string;
  timestamp: string;
  text: string;
  type: 'note' | 'issue' | 'success';
  attachments?: string[];
  tags?: string[];
}

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    metricId: 'DC-001-receiving-unload',
    metricType: 'task',
    userId: 'user-sm-001',
    userName: 'Sarah Kim',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    text: 'Forklift broke down at 10 AM, causing delays in unloading. Maintenance team responded quickly.',
    type: 'issue',
    tags: ['equipment', 'maintenance'],
  },
  {
    id: 'comment-2',
    metricId: 'DC-001-receiving-unload',
    metricType: 'task',
    userId: 'user-sup-001',
    userName: 'Mike Johnson',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    text: 'Back on track now, expect recovery to normal performance by end of shift.',
    type: 'note',
  },
];

// ==== GOAL SETTING & TRACKING ====
export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  completedAt?: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  target: number;
  currentValue: number;
  metric: 'performance' | 'volume' | 'hours';
  scope: 'task' | 'job-function' | 'site' | 'enterprise';
  scopeId: string;
  deadline: string;
  owner: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
}

export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    name: 'Improve Boston Receiving to 98%',
    description: 'Increase receiving performance from current 94% to target of 98%',
    target: 98,
    currentValue: 94.2,
    metric: 'performance',
    scope: 'job-function',
    scopeId: 'DC-002-receiving',
    deadline: '2025-12-31',
    owner: 'Sarah Kim',
    ownerId: 'user-sm-002',
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    milestones: [
      {
        id: 'milestone-1',
        name: 'Identify bottlenecks',
        dueDate: '2025-11-07',
        status: 'completed',
        completedAt: '2025-11-05T00:00:00Z',
      },
      {
        id: 'milestone-2',
        name: 'Reorganize layout',
        dueDate: '2025-11-14',
        status: 'completed',
        completedAt: '2025-11-12T00:00:00Z',
      },
      {
        id: 'milestone-3',
        name: 'Train 3 new staff',
        dueDate: '2025-11-21',
        status: 'in-progress',
      },
      {
        id: 'milestone-4',
        name: 'Achieve 96%',
        dueDate: '2025-11-28',
        status: 'pending',
      },
      {
        id: 'milestone-5',
        name: 'Achieve 98%',
        dueDate: '2025-12-05',
        status: 'pending',
      },
    ],
    status: 'on-track',
  },
];

// ==== AUDIT LOGS ====
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'view' | 'edit' | 'create' | 'delete' | 'export' | 'grant' | 'revoke' | 'publish';
  resource: 'dashboard' | 'data' | 'permission' | 'report' | 'goal' | 'user';
  resourceId: string;
  resourceName: string;
  details: any;
  ipAddress: string;
}

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    userId: 'user-vp-001',
    userName: 'Michael Chen',
    action: 'publish',
    resource: 'dashboard',
    resourceId: 'custom-123',
    resourceName: 'Receiving Deep Dive',
    details: { roles: ['site-manager'], sites: ['all'] },
    ipAddress: '192.168.1.100',
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    userId: 'user-sm-001',
    userName: 'Sarah Kim',
    action: 'edit',
    resource: 'data',
    resourceId: 'metrics-2025-11-02',
    resourceName: 'Daily Metrics Entry',
    details: { taskId: 'receiving-unload', value: 1250 },
    ipAddress: '192.168.1.105',
  },
];

// ==== USER MANAGEMENT ====
export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  siteId?: string;
  siteName?: string;
  invitedBy: string;
  invitedByName: string;
  invitedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export const mockUserInvitations: UserInvitation[] = [
  {
    id: 'invite-1',
    email: 'sarah.jones@walgreens.com',
    role: 'site-manager',
    siteId: 'DC-002',
    siteName: 'Boston DC',
    invitedBy: 'user-sm-002',
    invitedByName: 'Current Boston SM',
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];

// ==== OFFLINE MODE ====
export interface OfflineQueue {
  id: string;
  action: 'update' | 'create';
  data: DailyMetrics;
  timestamp: string;
  synced: boolean;
  syncedAt?: string;
  error?: string;
}

export const mockOfflineQueue: OfflineQueue[] = [];

// ==== ANALYTICS & PREDICTIONS ====
export interface Prediction {
  id: string;
  type: 'trend' | 'anomaly' | 'threshold';
  severity: 'info' | 'warning' | 'critical';
  metric: string;
  metricId: string;
  currentValue: number;
  predictedValue: number;
  predictedDate: string;
  confidence: number; // 0-100
  message: string;
  recommendation?: string;
  createdAt: string;
}

// Generate ML-powered predictions dynamically
import { generateMLPredictions } from './mlEngine';

// Static predictions for backward compatibility
const staticPredictions: Prediction[] = [
  {
    id: 'pred-1',
    type: 'threshold',
    severity: 'warning',
    metric: 'Philadelphia Receiving Performance',
    metricId: 'DC-001-receiving',
    currentValue: 96.5,
    predictedValue: 94.2,
    predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    confidence: 78,
    message: 'Philadelphia Receiving likely to drop below 95% next week',
    recommendation: 'Recommend +2 staff or process review',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pred-2',
    type: 'trend',
    severity: 'info',
    metric: 'Boston Picking Performance',
    metricId: 'DC-002-picking',
    currentValue: 98.5,
    predictedValue: 102,
    predictedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    confidence: 85,
    message: 'Picking performance improving 0.5% per week for 8 weeks',
    recommendation: 'Current trajectory: 102% by month-end',
    createdAt: new Date().toISOString(),
  },
];

// Export ML-generated predictions (will use static if ML fails)
export const mockPredictions: Prediction[] = (() => {
  try {
    const mlPredictions = generateMLPredictions(dailyMetrics, sites);
    return mlPredictions.length > 0 ? mlPredictions : staticPredictions;
  } catch (error) {
    console.warn('ML prediction generation failed, using static predictions', error);
    return staticPredictions;
  }
})();

// System Dashboards - REMOVED (all dashboards are now user-created)
export const systemDashboards: DashboardDefinition[] = [];

// Published dashboards - links dashboards to roles
export const publishedDashboards: PublishedDashboard[] = [];

// Custom dashboards created by users
export const customDashboards: DashboardDefinition[] = [];

// Published custom dashboards
export const publishedCustomDashboards: PublishedDashboard[] = [];

// Dashboard changes log
export const dashboardChanges: DashboardChange[] = [];

// Dashboard notifications (example data)
export const dashboardNotifications: DashboardNotification[] = [];

// Helper functions for dashboard management

export const getDashboardById = (dashboardId: string): DashboardDefinition | undefined => {
  return customDashboards.find(d => d.id === dashboardId);
};

export const getPublishedDashboardsForUser = (
  userRole: UserRole,
  siteId: string
): PublishedDashboard[] => {
  const allPublished = [...publishedDashboards, ...publishedCustomDashboards];
  
  return allPublished.filter(pd => {
    if (!pd.isActive) return false;
    if (!pd.roles.includes(userRole)) return false;
    
    // If siteIds is empty, it's published to all sites
    if (pd.siteIds.length === 0) return true;
    
    // Otherwise check if user's site is in the list
    return pd.siteIds.includes(siteId);
  }).sort((a, b) => a.order - b.order);
};

export const getDashboardsCreatedBy = (creatorName: string): DashboardDefinition[] => {
  return customDashboards.filter(d => d.createdBy === creatorName);
};

export const getAllCustomDashboards = (): DashboardDefinition[] => {
  console.log('🔍 getAllCustomDashboards called');
  console.log('🔍 customDashboards array length:', customDashboards.length);
  console.log('🔍 customDashboards IDs:', customDashboards.map(d => d.id));
  
  // Load dashboards from localStorage and merge with in-memory dashboards
  const localDashboards = loadDashboardsFromLocalStorage();
  console.log('🔍 localStorage dashboards length:', localDashboards.length);
  console.log('🔍 localStorage dashboard IDs:', localDashboards.map(d => d.id));
  
  // Create a map to avoid duplicates (localStorage takes precedence)
  const dashboardMap = new Map<string, DashboardDefinition>();
  
  // Add mockData dashboards first
  customDashboards.forEach(d => {
    console.log('🔍 Adding from customDashboards:', d.id, d.name);
    dashboardMap.set(d.id, d);
  });
  
  // Override/add with localStorage dashboards
  localDashboards.forEach(d => {
    console.log('🔍 Adding from localStorage:', d.id, d.name);
    dashboardMap.set(d.id, d);
  });
  
  const allDashboards = Array.from(dashboardMap.values());
  console.log('🔍 Merged dashboard count:', allDashboards.length);
  console.log('📊 FINAL All dashboards:', allDashboards.map(d => ({ id: d.id, name: d.name })));
  
  return allDashboards;
};

export const getSystemDashboards = (): DashboardDefinition[] => {
  return []; // All system dashboards removed - users create their own
};

export const getUnreadNotificationsForUser = (userId: string): DashboardNotification[] => {
  return dashboardNotifications.filter(n => n.userId === userId && !n.isRead);
};

export const getDashboardChanges = (dashboardId: string): DashboardChange[] => {
  return dashboardChanges.filter(c => c.dashboardId === dashboardId).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Helper function to load dashboards from localStorage
const loadDashboardsFromLocalStorage = (): DashboardDefinition[] => {
  try {
    const stored = localStorage.getItem('customDashboards');
    if (stored) {
      const dashboards = JSON.parse(stored);
      console.log('📂 Loaded dashboards from localStorage:', dashboards.map((d: DashboardDefinition) => ({ id: d.id, name: d.name })));
      return dashboards;
    }
  } catch (error) {
    console.error('Failed to load dashboards from localStorage:', error);
  }
  
  // If nothing in localStorage, return empty array
  console.log('📂 No dashboards in localStorage, returning empty array');
  return [];
};

// Helper function to save dashboards to localStorage
const saveDashboardsToLocalStorage = (dashboards: DashboardDefinition[]): void => {
  try {
    localStorage.setItem('customDashboards', JSON.stringify(dashboards));
    console.log('✅ Dashboards saved to localStorage:', dashboards.map(d => ({ id: d.id, name: d.name })));
  } catch (error) {
    console.error('Failed to save dashboards to localStorage:', error);
  }
};

// Mock function to save/update dashboards (in real app, this would call an API)
export const saveDashboard = (dashboard: DashboardDefinition): void => {
  // Update in-memory array
  const index = customDashboards.findIndex(d => d.id === dashboard.id);
  if (index >= 0) {
    customDashboards[index] = dashboard;
  } else {
    customDashboards.push(dashboard);
  }
  
  // Also save to localStorage for persistence across code updates
  const allDashboards = getAllCustomDashboards();
  const localIndex = allDashboards.findIndex(d => d.id === dashboard.id);
  if (localIndex >= 0) {
    allDashboards[localIndex] = dashboard;
  } else {
    allDashboards.push(dashboard);
  }
  saveDashboardsToLocalStorage(allDashboards);
};

export const publishDashboard = (publication: PublishedDashboard): void => {
  publishedCustomDashboards.push(publication);
};

export const updatePublishedDashboard = (dashboardId: string, updates: Partial<PublishedDashboard>): boolean => {
  // Try to find in system dashboards first
  let index = publishedDashboards.findIndex(pd => pd.dashboardId === dashboardId);
  if (index >= 0) {
    publishedDashboards[index] = { ...publishedDashboards[index], ...updates };
    return true;
  }
  
  // Then try custom dashboards
  index = publishedCustomDashboards.findIndex(pd => pd.dashboardId === dashboardId);
  if (index >= 0) {
    publishedCustomDashboards[index] = { ...publishedCustomDashboards[index], ...updates };
    return true;
  }
  
  return false;
};

export const updateSystemDashboard = (dashboard: DashboardDefinition): void => {
  // System dashboards have been removed - treat as custom dashboard
  saveDashboard(dashboard);
};

// Delete a dashboard from both memory and localStorage
export const deleteDashboard = (dashboardId: string): boolean => {
  // Remove from in-memory array
  const memoryIndex = customDashboards.findIndex(d => d.id === dashboardId);
  if (memoryIndex >= 0) {
    customDashboards.splice(memoryIndex, 1);
  }
  
  // Remove from localStorage
  const allDashboards = loadDashboardsFromLocalStorage();
  const localIndex = allDashboards.findIndex(d => d.id === dashboardId);
  if (localIndex >= 0) {
    allDashboards.splice(localIndex, 1);
    saveDashboardsToLocalStorage(allDashboards);
    return true;
  }
  
  return memoryIndex >= 0;
};

// ============================================================================
// ROLES & PERMISSIONS SYSTEM
// ============================================================================

export type PermissionKey = 'dataInput' | 'editDashboards' | 'createDashboards' | 'deleteDashboards' | 'createAlerts';

export interface RolePermissions {
  dataInput: boolean;
  editDashboards: boolean;
  createDashboards: boolean;
  deleteDashboards: boolean;
  createAlerts: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: RolePermissions;
  isCustom: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// Default roles
const defaultRoles: Role[] = [
  {
    id: 'role-executive',
    name: 'Executive',
    description: 'Full system access with all permissions',
    permissions: {
      dataInput: true,
      editDashboards: true,
      createDashboards: true,
      deleteDashboards: true,
      createAlerts: true,
    },
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: 'System',
  },
  {
    id: 'role-vp',
    name: 'VP',
    description: 'Senior management with comprehensive permissions',
    permissions: {
      dataInput: true,
      editDashboards: true,
      createDashboards: true,
      deleteDashboards: true,
      createAlerts: true,
    },
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: 'System',
  },
  {
    id: 'role-site-manager',
    name: 'Site Manager',
    description: 'Site-level management permissions',
    permissions: {
      dataInput: true,
      editDashboards: true,
      createDashboards: false,
      deleteDashboards: false,
      createAlerts: true,
    },
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: 'System',
  },
  {
    id: 'role-supervisor',
    name: 'Supervisor',
    description: 'Team supervision with data input access',
    permissions: {
      dataInput: true,
      editDashboards: false,
      createDashboards: false,
      deleteDashboards: false,
      createAlerts: false,
    },
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: 'System',
  },
];

// Storage key
const ROLES_STORAGE_KEY = 'app-roles-data';

// Load roles from localStorage
const loadRolesFromStorage = (): Role[] => {
  try {
    const stored = localStorage.getItem(ROLES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading roles from localStorage:', error);
  }
  return [...defaultRoles];
};

// Save roles to localStorage
const saveRolesToStorage = (roles: Role[]): void => {
  try {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  } catch (error) {
    console.error('Error saving roles to localStorage:', error);
  }
};

// Initialize roles
let rolesData: Role[] = loadRolesFromStorage();

// Get all roles
export const getAllRoles = (): Role[] => {
  return [...rolesData];
};

// Get role by ID
export const getRoleById = (roleId: string): Role | undefined => {
  return rolesData.find(r => r.id === roleId);
};

// Create new role
export const createRole = (name: string, createdBy: string): boolean => {
  // Check if name already exists
  if (rolesData.some(r => r.name.toLowerCase() === name.toLowerCase())) {
    return false;
  }

  const newRole: Role = {
    id: `role-custom-${Date.now()}`,
    name,
    permissions: {
      dataInput: false,
      editDashboards: false,
      createDashboards: false,
      deleteDashboards: false,
      createAlerts: false,
    },
    isCustom: true,
    createdAt: new Date().toISOString(),
    createdBy,
    updatedAt: new Date().toISOString(),
    updatedBy: createdBy,
  };

  rolesData.push(newRole);
  saveRolesToStorage(rolesData);
  return true;
};

// Update role permission
export const updateRolePermission = (
  roleId: string,
  permission: PermissionKey,
  enabled: boolean,
  updatedBy: string
): boolean => {
  const role = rolesData.find(r => r.id === roleId);
  if (!role) return false;

  role.permissions[permission] = enabled;
  role.updatedAt = new Date().toISOString();
  role.updatedBy = updatedBy;

  saveRolesToStorage(rolesData);
  return true;
};

// Delete role (only custom roles)
export const deleteRole = (roleId: string): boolean => {
  const roleIndex = rolesData.findIndex(r => r.id === roleId);
  if (roleIndex === -1) return false;

  const role = rolesData[roleIndex];
  if (!role.isCustom) return false; // Cannot delete system roles

  rolesData.splice(roleIndex, 1);
  saveRolesToStorage(rolesData);
  return true;
};

// Reset to default roles
export const resetRolesToDefaults = (): void => {
  rolesData = [...defaultRoles];
  saveRolesToStorage(rolesData);
};

// Check if a role has a specific permission
export const hasRolePermission = (roleId: string, permission: PermissionKey): boolean => {
  const role = rolesData.find(r => r.id === roleId);
  return role ? role.permissions[permission] : false;
};

// ============================================================================
// ALERTS & NOTIFICATIONS SYSTEM
// ============================================================================

export type AlertCondition = 'below' | 'above' | 'equals';
export type AlertMetric = 'performance' | 'volume' | 'hours';
export type AlertScope = 'task' | 'job-function' | 'site' | 'enterprise';
export type NotificationMethod = 'in-app' | 'email' | 'sms';
export type NotificationFrequency = 'immediate' | 'daily-digest' | 'weekly';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertRule {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  
  // Condition
  condition: AlertCondition;
  threshold: number;
  metric: AlertMetric;
  scope: AlertScope;
  
  // Scope filters
  siteIds: string[]; // Empty = all sites
  jobFunctionTypes: string[]; // Empty = all job functions
  taskIds: string[]; // Empty = all tasks
  
  // Notification settings
  recipients: UserRole[];
  notificationMethod: NotificationMethod[];
  frequency: NotificationFrequency;
  severity: AlertSeverity;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TriggeredAlert {
  id: string;
  alertRuleId: string;
  alertRuleName: string;
  
  // What triggered it
  siteId: string;
  siteName: string;
  jobFunctionId?: string;
  jobFunctionName?: string;
  taskId?: string;
  taskName?: string;
  
  // Values
  currentValue: number;
  threshold: number;
  metric: AlertMetric;
  condition: AlertCondition;
  severity: AlertSeverity;
  
  // Timing
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

// Mock alert rules
export const alertRules: AlertRule[] = [
  {
    id: 'alert-1',
    name: 'Critical Performance Drop',
    description: 'Alert when any task performance drops below 90%',
    isActive: true,
    condition: 'below',
    threshold: 90,
    metric: 'performance',
    scope: 'task',
    siteIds: [],
    jobFunctionTypes: [],
    taskIds: [],
    recipients: ['executive', 'site-manager'],
    notificationMethod: ['in-app', 'email'],
    frequency: 'immediate',
    severity: 'critical',
    createdBy: 'Michael Chen',
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z',
  },
];

export const triggeredAlerts: TriggeredAlert[] = [];

// Helper functions for alerts
export const getActiveAlertRules = (): AlertRule[] => {
  return alertRules.filter(rule => rule.isActive);
};

export const getTriggeredAlertsForUser = (role: UserRole, siteId: string): TriggeredAlert[] => {
  const relevantRules = alertRules.filter(rule => 
    rule.isActive && 
    rule.recipients.includes(role) &&
    (rule.siteIds.length === 0 || rule.siteIds.includes(siteId))
  );
  
  const ruleIds = new Set(relevantRules.map(r => r.id));
  
  return triggeredAlerts.filter(alert => 
    ruleIds.has(alert.alertRuleId) &&
    !alert.resolvedAt &&
    (alert.siteId === 'all' || alert.siteId === siteId || role === 'executive')
  ).sort((a, b) => {
    // Sort by severity first
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    
    // Then by time (newest first)
    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
  });
};

export const acknowledgeAlert = (alertId: string, userName: string): void => {
  const alert = triggeredAlerts.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = userName;
  }
};

export const resolveAlert = (alertId: string, notes?: string): void => {
  const alert = triggeredAlerts.find(a => a.id === alertId);
  if (alert) {
    alert.resolvedAt = new Date().toISOString();
    if (notes) alert.notes = notes;
  }
};

export const createAlertRule = (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): void => {
  alertRules.push({
    ...rule,
    id: `alert-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const updateAlertRule = (ruleId: string, updates: Partial<AlertRule>): void => {
  const index = alertRules.findIndex(r => r.id === ruleId);
  if (index >= 0) {
    alertRules[index] = {
      ...alertRules[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const deleteAlertRule = (ruleId: string): void => {
  const index = alertRules.findIndex(r => r.id === ruleId);
  if (index >= 0) {
    alertRules.splice(index, 1);
  }
};
