/**
 * Report Enhancements Service
 * Handles saved views, period comparisons, shareable links, alerts
 */

import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';
import { SavedView, PeriodComparison } from '../components/ReportEnhancements';

const SAVED_VIEWS_KEY = 'report_saved_views';
const ALERTS_KEY = 'report_alerts';
const SCHEDULES_KEY = 'report_schedules';

export interface ReportAlert {
  id: string;
  reportType: string;
  metric: 'performance' | 'volume' | 'variance';
  condition: 'below' | 'above' | 'equals';
  threshold: number;
  enabled: boolean;
  createdAt: string;
}

export interface ReportSchedule {
  id: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  config: any;
  enabled: boolean;
  createdAt: string;
  lastSent?: string;
}

// ===== Saved Views =====

export function getSavedViews(): SavedView[] {
  const views = safeGetItem(SAVED_VIEWS_KEY, []);
  return views;
}

export function saveView(view: Omit<SavedView, 'id' | 'createdAt'>): SavedView {
  const views = getSavedViews();
  const newView: SavedView = {
    ...view,
    id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  
  views.push(newView);
  safeSetItem(SAVED_VIEWS_KEY, views);
  
  return newView;
}

export function loadView(viewId: string): SavedView | null {
  const views = getSavedViews();
  const view = views.find(v => v.id === viewId);
  
  if (view) {
    // Update last used timestamp
    const updatedViews = views.map(v => 
      v.id === viewId ? { ...v, lastUsed: new Date().toISOString() } : v
    );
    safeSetItem(SAVED_VIEWS_KEY, updatedViews);
  }
  
  return view || null;
}

export function deleteView(viewId: string): void {
  const views = getSavedViews();
  const filtered = views.filter(v => v.id !== viewId);
  safeSetItem(SAVED_VIEWS_KEY, filtered);
}

export function updateView(viewId: string, updates: Partial<SavedView>): void {
  const views = getSavedViews();
  const updated = views.map(v => 
    v.id === viewId ? { ...v, ...updates } : v
  );
  safeSetItem(SAVED_VIEWS_KEY, updated);
}

// ===== Shareable Links =====

export function generateShareableLink(config: any): string {
  // Encode the current report configuration into a base64 string
  const configStr = JSON.stringify(config);
  const encoded = btoa(configStr);
  
  // In a real app, this would create a short link via an API
  // For now, we'll create a URL with the config in the hash
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#report=${encoded}`;
}

export function parseShareableLink(url: string): any | null {
  try {
    const hash = url.split('#report=')[1];
    if (!hash) return null;
    
    const decoded = atob(hash);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse shareable link:', error);
    return null;
  }
}

// ===== Period Comparison =====

export function calculateComparisonPeriod(
  baseStart: Date,
  baseEnd: Date,
  type: PeriodComparison['comparisonType']
): { compareStart: Date; compareEnd: Date } {
  const diffMs = baseEnd.getTime() - baseStart.getTime();
  
  if (type === 'previous-period') {
    const compareEnd = new Date(baseStart.getTime() - 86400000); // 1 day before base start
    const compareStart = new Date(compareEnd.getTime() - diffMs);
    return { compareStart, compareEnd };
  } else if (type === 'previous-year') {
    const compareStart = new Date(baseStart);
    compareStart.setFullYear(compareStart.getFullYear() - 1);
    const compareEnd = new Date(baseEnd);
    compareEnd.setFullYear(compareEnd.getFullYear() - 1);
    return { compareStart, compareEnd };
  }
  
  // For custom, return the same dates (caller will override)
  return { compareStart: baseStart, compareEnd: baseEnd };
}

export function compareMetrics(baseValue: number, compareValue: number): {
  absolute: number;
  percentage: number;
  trend: 'up' | 'down' | 'flat';
} {
  const absolute = baseValue - compareValue;
  const percentage = compareValue !== 0 ? (absolute / compareValue) * 100 : 0;
  
  let trend: 'up' | 'down' | 'flat' = 'flat';
  if (Math.abs(percentage) > 1) {
    trend = percentage > 0 ? 'up' : 'down';
  }
  
  return { absolute, percentage, trend };
}

// ===== Alerts =====

export function getAlerts(): ReportAlert[] {
  return safeGetItem(ALERTS_KEY, []);
}

export function createAlert(alert: Omit<ReportAlert, 'id' | 'createdAt'>): ReportAlert {
  const alerts = getAlerts();
  const newAlert: ReportAlert = {
    ...alert,
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    enabled: true
  };
  
  alerts.push(newAlert);
  safeSetItem(ALERTS_KEY, alerts);
  
  return newAlert;
}

export function updateAlert(alertId: string, updates: Partial<ReportAlert>): void {
  const alerts = getAlerts();
  const updated = alerts.map(a => 
    a.id === alertId ? { ...a, ...updates } : a
  );
  safeSetItem(ALERTS_KEY, updated);
}

export function deleteAlert(alertId: string): void {
  const alerts = getAlerts();
  const filtered = alerts.filter(a => a.id !== alertId);
  safeSetItem(ALERTS_KEY, filtered);
}

export function checkAlerts(data: any[], alerts: ReportAlert[]): ReportAlert[] {
  const triggered: ReportAlert[] = [];
  
  alerts.forEach(alert => {
    if (!alert.enabled) return;
    
    data.forEach(row => {
      const value = row[alert.metric];
      if (value === undefined) return;
      
      let shouldTrigger = false;
      
      if (alert.condition === 'below' && value < alert.threshold) {
        shouldTrigger = true;
      } else if (alert.condition === 'above' && value > alert.threshold) {
        shouldTrigger = true;
      } else if (alert.condition === 'equals' && value === alert.threshold) {
        shouldTrigger = true;
      }
      
      if (shouldTrigger) {
        triggered.push(alert);
      }
    });
  });
  
  return triggered;
}

// ===== Schedules =====

export function getSchedules(): ReportSchedule[] {
  return safeGetItem(SCHEDULES_KEY, []);
}

export function createSchedule(schedule: Omit<ReportSchedule, 'id' | 'createdAt'>): ReportSchedule {
  const schedules = getSchedules();
  const newSchedule: ReportSchedule = {
    ...schedule,
    id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    enabled: true
  };
  
  schedules.push(newSchedule);
  safeSetItem(SCHEDULES_KEY, schedules);
  
  return newSchedule;
}

export function updateSchedule(scheduleId: string, updates: Partial<ReportSchedule>): void {
  const schedules = getSchedules();
  const updated = schedules.map(s => 
    s.id === scheduleId ? { ...s, ...updates } : s
  );
  safeSetItem(SCHEDULES_KEY, updated);
}

export function deleteSchedule(scheduleId: string): void {
  const schedules = getSchedules();
  const filtered = schedules.filter(s => s.id !== scheduleId);
  safeSetItem(SCHEDULES_KEY, filtered);
}

// ===== Export Enhancements =====

export function exportToExcelWithFormatting(reportData: any): void {
  // Enhanced Excel export with conditional formatting, formulas, etc.
  // In a real implementation, this would use a library like ExcelJS
  console.log('Exporting to Excel with formatting:', reportData);
  alert('Enhanced Excel export would be generated here with conditional formatting, charts, and formulas.');
}

export function exportToGoogleSheets(reportData: any): void {
  // Direct export to Google Sheets
  // Would use Google Sheets API in production
  console.log('Exporting to Google Sheets:', reportData);
  alert('Google Sheets export would open in a new tab with formatted data.');
}

// ===== Global Search =====

export function globalSearch(query: string, data: any[]): any[] {
  if (!query.trim()) return data;
  
  const lowerQuery = query.toLowerCase();
  
  return data.filter(row => {
    // Search across all string and number fields
    return Object.values(row).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

// ===== Outlier Detection =====

export function detectOutliers(
  data: any[],
  metric: string,
  threshold: number = 2 // Standard deviations
): any[] {
  const values = data.map(row => row[metric]).filter(v => typeof v === 'number');
  
  if (values.length === 0) return [];
  
  // Calculate mean
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  
  // Calculate standard deviation
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  // Find outliers
  return data.filter(row => {
    const value = row[metric];
    if (typeof value !== 'number') return false;
    
    const zScore = Math.abs((value - mean) / stdDev);
    return zScore > threshold;
  });
}

// ===== Running Totals & Calculated Columns =====

export function addRunningTotal(data: any[], column: string): any[] {
  let runningTotal = 0;
  
  return data.map(row => {
    runningTotal += row[column] || 0;
    return {
      ...row,
      [`${column}_running_total`]: runningTotal
    };
  });
}

export function addMovingAverage(
  data: any[],
  column: string,
  window: number = 7
): any[] {
  return data.map((row, index) => {
    const startIndex = Math.max(0, index - window + 1);
    const windowData = data.slice(startIndex, index + 1);
    const sum = windowData.reduce((acc, r) => acc + (r[column] || 0), 0);
    const average = sum / windowData.length;
    
    return {
      ...row,
      [`${column}_ma${window}`]: average
    };
  });
}

export function addCustomCalculation(
  data: any[],
  name: string,
  formula: (row: any) => number
): any[] {
  return data.map(row => ({
    ...row,
    [name]: formula(row)
  }));
}
