/**
 * Export Service
 * Handles exporting reports to various formats (PDF, CSV, Print)
 */

import { ReportData } from './reportGenerator';

/**
 * Export report as PDF
 * Uses browser's native print functionality with print-optimized styles
 */
export function exportToPDF(reportData: ReportData): void {
  // Trigger browser print dialog
  // The ReportRenderer component has print-optimized CSS
  window.print();
}

/**
 * Export report data to CSV
 */
export function exportToCSV(reportData: ReportData): void {
  let csvContent = '';
  
  // Add metadata header
  csvContent += `${reportData.metadata.title}\n`;
  csvContent += `Generated: ${new Date(reportData.metadata.generatedAt).toLocaleString()}\n`;
  csvContent += `Period: ${reportData.metadata.dateRange.start} to ${reportData.metadata.dateRange.end}\n`;
  csvContent += `\n`;
  
  // Add summary metrics
  csvContent += `Summary Metrics\n`;
  csvContent += `Metric,Value,Trend\n`;
  reportData.summary.metrics.forEach(metric => {
    const trend = metric.trend && metric.trendValue 
      ? `${metric.trend} ${metric.trendValue}` 
      : '';
    csvContent += `"${metric.label}","${metric.value}","${trend}"\n`;
  });
  csvContent += `\n`;
  
  // Add detailed data based on report type
  if (reportData.metadata.type === 'daily-performance') {
    csvContent += `Site Performance Breakdown\n`;
    csvContent += `Site,Avg Performance,Total Volume,Total Hours,Units/Hour\n`;
    reportData.details.siteBreakdowns.forEach((site: any) => {
      const unitsPerHour = site.totalHours > 0 ? site.totalVolume / site.totalHours : 0;
      csvContent += `"${site.siteName}",${site.avgPerformance.toFixed(1)}%,${site.totalVolume},${site.totalHours.toFixed(1)},${unitsPerHour.toFixed(1)}\n`;
    });
    
    // Add job function breakdown for each site
    csvContent += `\n`;
    csvContent += `Job Function Details\n`;
    csvContent += `Site,Job Function,Avg Performance,Budgeted Volume,Forecasted Volume,Actual Volume,Total Hours,Units/Hour\n`;
    reportData.details.siteBreakdowns.forEach((site: any) => {
      site.jobFunctionBreakdown.forEach((jf: any) => {
        const unitsPerHour = jf.totalHours > 0 ? jf.totalVolume / jf.totalHours : 0;
        csvContent += `"${site.siteName}","${jf.jobFunctionType}",${jf.avgPerformance.toFixed(1)}%,${jf.budgetedVolume},${jf.forecastedVolume},${jf.totalVolume},${jf.totalHours.toFixed(1)},${unitsPerHour.toFixed(1)}\n`;
      });
    });
  } else if (reportData.metadata.type === 'weekly-trend') {
    csvContent += `Daily Trend Data\n`;
    csvContent += `Date,Performance,Budgeted Volume,Forecasted Volume,Actual Volume,Hours,Units/Hour\n`;
    reportData.details.dailyData.forEach((day: any) => {
      const unitsPerHour = day.hours > 0 ? day.volume / day.hours : 0;
      csvContent += `${day.date},${day.performance.toFixed(1)}%,${day.budgetedVolume || 0},${day.forecastedVolume || 0},${day.volume},${day.hours.toFixed(1)},${unitsPerHour.toFixed(1)}\n`;
    });
    
    // Add site trends
    csvContent += `\n`;
    csvContent += `Site Daily Trends\n`;
    csvContent += `Site,Date,Performance,Budgeted Volume,Forecasted Volume,Actual Volume,Hours,Units/Hour\n`;
    reportData.details.siteTrends.forEach((site: any) => {
      site.dailyData.forEach((day: any) => {
        const unitsPerHour = day.hours > 0 ? day.volume / day.hours : 0;
        csvContent += `"${site.siteName}",${day.date},${day.performance.toFixed(1)}%,${day.budgetedVolume || 0},${day.forecastedVolume || 0},${day.volume},${day.hours.toFixed(1)},${unitsPerHour.toFixed(1)}\n`;
      });
    });
  } else if (reportData.metadata.type === 'exception') {
    csvContent += `Exception Details\n`;
    csvContent += `Date,Site,Job Function,Task,Performance,Budgeted Volume,Forecasted Volume,Actual Volume,Variance\n`;
    reportData.details.exceptions.forEach((exception: any) => {
      csvContent += `${exception.date},"${exception.site}","${exception.jobFunction}","${exception.task}",${exception.performance.toFixed(1)}%,${exception.budgetedVolume},${exception.forecastedVolume},${exception.actualVolume},${exception.variance.toFixed(1)}%\n`;
    });
  }
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${reportData.metadata.id}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy report summary to clipboard
 */
export async function copyToClipboard(reportData: ReportData): Promise<void> {
  let textContent = '';
  
  textContent += `${reportData.metadata.title}\n`;
  textContent += `${reportData.metadata.description}\n\n`;
  
  textContent += `Summary:\n`;
  reportData.summary.metrics.forEach(metric => {
    const trend = metric.trend && metric.trendValue 
      ? ` (${metric.trend} ${metric.trendValue})` 
      : '';
    textContent += `• ${metric.label}: ${metric.value}${trend}\n`;
  });
  
  try {
    await navigator.clipboard.writeText(textContent);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    throw err;
  }
}

/**
 * Generate shareable report URL
 * For future implementation with backend
 */
export function generateShareableLink(reportData: ReportData): string {
  // For now, return a placeholder
  // In production, this would save the report to backend and return a URL
  const params = new URLSearchParams({
    type: reportData.metadata.type,
    start: reportData.metadata.dateRange.start,
    end: reportData.metadata.dateRange.end
  });
  
  return `${window.location.origin}/reports/view?${params.toString()}`;
}
