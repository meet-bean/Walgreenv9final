/**
 * Reports Hub
 * Main interface for viewing and generating reports
 */

import React, { useState } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Separator } from './design-system/Separator';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { SlideOut } from './design-system/SlideOut';
import { PageContainer } from './design-system/PageContainer';
import { PageHeader } from './design-system/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  FileSpreadsheet, 
  Printer,
  ArrowLeft,
  RefreshCw,
  Settings,
  Bell,
  BellOff,
  Trash2,
  Clock,
  Plus
} from 'lucide-react';
import { ReportRenderer } from './ReportRenderer';
import { 
  ReportType, 
  ReportData,
  generateDailyPerformanceReport,
  generateWeeklyTrendReport,
  generateExceptionReport,
  getAvailableReports
} from '../lib/reportGenerator';
import { exportToPDF, exportToCSV } from '../lib/exportService';
import { 
  ReportColumnConfig, 
  ReportDisplayConfig, 
  DEFAULT_COLUMNS, 
  DEFAULT_GROUPING,
  DEFAULT_COLUMN_GROUPS
} from './ReportColumnConfig';
import { CustomReportBuilder } from './CustomReportBuilder';
import { toast } from './design-system/Toast';

type ViewMode = 'list' | 'view';

type SubscriptionFrequency = 'daily' | 'weekly' | 'monthly';

interface ReportSubscription {
  id: string;
  reportType: ReportType;
  reportName: string;
  frequency: SubscriptionFrequency;
  deliveryTime: string; // HH:MM format
  isActive: boolean;
  createdAt: Date;
  lastSent?: Date;
  recipientEmail: string;
}

interface ReportsHubProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  refreshTrigger: number;
  setRefreshTrigger: (trigger: number | ((prev: number) => number)) => void;
}

export function ReportsHub({ viewMode, setViewMode, refreshTrigger, setRefreshTrigger }: ReportsHubProps) {
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  
  // Custom reports state
  const [customReports, setCustomReports] = useState<Array<{
    id: string;
    name: string;
    config: ReportDisplayConfig;
    createdAt: Date;
  }>>([]);
  
  // Subscription state
  const [subscriptions, setSubscriptions] = useState<ReportSubscription[]>([]);
  const [isSubscriptionSidebarOpen, setIsSubscriptionSidebarOpen] = useState(false);
  const [subscriptionFormData, setSubscriptionFormData] = useState<{
    reportType: ReportType | null;
    reportName: string;
    frequency: SubscriptionFrequency;
    deliveryTime: string;
    recipientEmail: string;
  }>({
    reportType: null,
    reportName: '',
    frequency: 'daily',
    deliveryTime: '08:00',
    recipientEmail: 'user@example.com'
  });
  
  // Filter/config state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() - 86400000).toISOString().split('T')[0]
  );
  const [exceptionThreshold, setExceptionThreshold] = useState<number>(75);
  const [exceptionDays, setExceptionDays] = useState<number>(7);

  // Column configuration state
  const [displayConfigs, setDisplayConfigs] = useState<Record<ReportType, ReportDisplayConfig>>({
    'daily-performance': {
      columns: DEFAULT_COLUMNS['daily-performance'],
      grouping: DEFAULT_GROUPING,
      columnGroups: DEFAULT_COLUMN_GROUPS,
    },
    'weekly-trend': {
      columns: DEFAULT_COLUMNS['weekly-trend'],
      grouping: DEFAULT_GROUPING,
      columnGroups: DEFAULT_COLUMN_GROUPS,
    },
    'exception': {
      columns: DEFAULT_COLUMNS['exception'],
      grouping: DEFAULT_GROUPING,
      columnGroups: DEFAULT_COLUMN_GROUPS,
    },
  });

  const availableReports = getAvailableReports();

  const getReportIcon = (type: string) => {
    const iconStyle = { width: '24px', height: '24px' };
    switch (type) {
      case 'calendar': return <Calendar style={iconStyle} />;
      case 'trending-up': return <TrendingUp style={iconStyle} />;
      case 'alert-triangle': return <AlertTriangle style={iconStyle} />;
      default: return <FileText style={iconStyle} />;
    }
  };

  const handleGenerateReport = async (reportType: ReportType) => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let reportData: ReportData;
      
      switch (reportType) {
        case 'daily-performance':
          reportData = generateDailyPerformanceReport(selectedDate);
          break;
        case 'weekly-trend':
          reportData = generateWeeklyTrendReport(selectedDate);
          break;
        case 'exception':
          reportData = generateExceptionReport(exceptionThreshold, exceptionDays);
          break;
        default:
          throw new Error('Unknown report type');
      }
      
      setCurrentReport(reportData);
      setViewMode('view');
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!currentReport) return;
    try {
      exportToPDF(currentReport);
      toast.success('Opening print dialog...');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportCSV = () => {
    if (!currentReport) return;
    try {
      exportToCSV(currentReport);
      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setCurrentReport(null);
  };

  // Subscription handlers
  const handleOpenSubscription = (reportType: ReportType, reportName: string) => {
    console.log('handleOpenSubscription called', reportType, reportName);
    setSubscriptionFormData({
      reportType,
      reportName,
      frequency: 'daily',
      deliveryTime: '08:00',
      recipientEmail: 'user@example.com'
    });
    console.log('Opening sidebar...');
    setIsSubscriptionSidebarOpen(true);
    console.log('Sidebar state set to true');
  };

  const handleCreateSubscription = () => {
    if (!subscriptionFormData.reportType) return;

    const newSubscription: ReportSubscription = {
      id: `sub-${Date.now()}`,
      reportType: subscriptionFormData.reportType,
      reportName: subscriptionFormData.reportName,
      frequency: subscriptionFormData.frequency,
      deliveryTime: subscriptionFormData.deliveryTime,
      recipientEmail: subscriptionFormData.recipientEmail,
      isActive: true,
      createdAt: new Date(),
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    setIsSubscriptionSidebarOpen(false);
    toast.success(`Subscribed to ${subscriptionFormData.reportName}!`);
  };

  const handleToggleSubscription = (id: string) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
    toast.success('Subscription updated!');
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    toast.success('Subscription deleted!');
  };

  const getActiveSubscription = (reportType: ReportType) => {
    return subscriptions.find(sub => sub.reportType === reportType && sub.isActive);
  };

  const formatFrequency = (freq: SubscriptionFrequency) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  const handleGenerateCustomReport = async (reportName: string, config: ReportDisplayConfig) => {
    setIsGenerating(true);
    setIsCustomBuilderOpen(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate report using daily-performance as base structure but with custom config
      const reportData = generateDailyPerformanceReport(selectedDate);
      
      // Override title with custom name
      reportData.metadata.title = reportName;
      reportData.metadata.subtitle = 'Custom Report';
      
      // Store the custom config for this report
      setDisplayConfigs(prev => ({
        ...prev,
        [reportData.metadata.type]: config,
      }));
      
      // Add to custom reports list
      setCustomReports(prev => [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          name: reportName,
          config,
          createdAt: new Date(),
        }
      ]);
      
      setCurrentReport(reportData);
      setViewMode('view');
      toast.success('Custom report generated successfully!');
    } catch (error) {
      console.error('Error generating custom report:', error);
      toast.error('Failed to generate custom report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCustomReport = (reportName: string, config: ReportDisplayConfig) => {
    const newReport = {
      id: `custom-${Date.now()}`,
      name: reportName,
      config,
      createdAt: new Date(),
    };
    
    setCustomReports(prev => [...prev, newReport]);
    setIsCustomBuilderOpen(false);
    toast.success(`Custom report "${reportName}" saved!`);
  };

  const handleDeleteCustomReport = (id: string) => {
    setCustomReports(prev => prev.filter(report => report.id !== id));
    toast.success('Custom report deleted!');
  };

  const handleGenerateSavedCustomReport = async (customReport: typeof customReports[0]) => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const reportData = generateDailyPerformanceReport(selectedDate);
      reportData.metadata.title = customReport.name;
      reportData.metadata.subtitle = 'Custom Report';
      
      setDisplayConfigs(prev => ({
        ...prev,
        [reportData.metadata.type]: customReport.config,
      }));
      
      setCurrentReport(reportData);
      setViewMode('view');
      toast.success('Custom report generated successfully!');
    } catch (error) {
      console.error('Error generating custom report:', error);
      toast.error('Failed to generate custom report');
    } finally {
      setIsGenerating(false);
    }
  };

  // List View
  if (viewMode === 'list') {
    return (
      <PageContainer>
        {/* Header */}
        <PageHeader
          title="Reports"
          description="Generate performance reports with export capabilities"
          actions={
            <Button onClick={() => setIsCustomBuilderOpen(true)}>
              <Plus style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
              Create Custom Report
            </Button>
          }
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--spacing-6)',
          marginTop: 'var(--spacing-6)'
        }}>
          {/* System Reports */}
          {availableReports.map((report) => (
            <article 
              key={report.type} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-4)',
                padding: 'var(--spacing-6)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--card)',
                transition: 'border-color var(--transition-default)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--muted)',
                  color: 'var(--primary)'
                }}>
                  {getReportIcon(report.icon)}
                </div>
                <Badge variant="outline">~{report.estimatedRows} rows</Badge>
              </div>
              
              <h2 className="heading-section">{report.name}</h2>
              <p style={{ color: 'var(--muted-foreground)' }}>{report.description}</p>
              
              {/* Report Configuration */}
              {report.type === 'daily-performance' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Label htmlFor="daily-date">Report Date</Label>
                  <Input
                    id="daily-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              {report.type === 'weekly-trend' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Label htmlFor="weekly-end-date">End Date</Label>
                  <Input
                    id="weekly-end-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>Shows 7 days ending on selected date</p>
                </div>
              )}

              {report.type === 'exception' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-3)'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)'
                    }}>
                      <Label htmlFor="exception-threshold">Threshold (%)</Label>
                      <Input
                        id="exception-threshold"
                        type="number"
                        min="0"
                        max="100"
                        value={exceptionThreshold}
                        onChange={(e) => setExceptionThreshold(Number(e.target.value))}
                      />
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-2)'
                    }}>
                      <Label htmlFor="exception-days">Days</Label>
                      <Input
                        id="exception-days"
                        type="number"
                        min="1"
                        max="30"
                        value={exceptionDays}
                        onChange={(e) => setExceptionDays(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleGenerateReport(report.type)}
                disabled={isGenerating}
                style={{ width: '100%', marginTop: 'auto' }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
                    Generate Report
                  </>
                )}
              </Button>
            </article>
          ))}
        </div>

        {/* Custom Reports Section */}
        {customReports.length > 0 && (
          <div style={{
            marginTop: 'var(--spacing-8)'
          }}>
            <h3 style={{
              marginBottom: 'var(--spacing-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)'
            }}>
              Custom Reports
              <Badge variant="outline">{customReports.length}</Badge>
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              {customReports.map((customReport) => (
                <div
                  key={customReport.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-4)',
                    padding: 'var(--spacing-4)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--card)',
                    transition: 'border-color var(--transition-default)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <FileText style={{ width: '20px', height: '20px', color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <span style={{ fontWeight: 500 }}>{customReport.name}</span>
                      <Badge variant="default" style={{ fontSize: 'var(--text-xs)' }}>Custom</Badge>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginTop: 'var(--spacing-1)' }}>
                      {customReport.config.columns.filter(c => c.enabled).length} columns • Created {customReport.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-2)',
                    flexShrink: 0
                  }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCustomReport(customReport.id)}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGenerateSavedCustomReport(customReport)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <RefreshCw style={{ width: '16px', height: '16px' }} className="animate-spin" />
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide-out Sidebar for Custom Report Builder */}
        <SlideOut
          open={isCustomBuilderOpen}
          onClose={() => setIsCustomBuilderOpen(false)}
          title="Create Custom Report"
          description="Build a custom report with your own column selection and grouping"
          icon={<Plus size={18} />}
          resizable
          defaultWidth={520}
          minWidth={400}
          maxWidth={900}
        >
          <CustomReportBuilder
            onGenerate={handleGenerateCustomReport}
            onSave={handleSaveCustomReport}
            onCancel={() => setIsCustomBuilderOpen(false)}
          />
        </SlideOut>
      </PageContainer>
    );
  }

  // Report View with Sidebar
  return (
    <>
      <PageContainer>
        <PageHeader
          title={currentReport?.metadata.title || 'Report'}
          subtitle={currentReport?.metadata.subtitle}
          actions={
            <>
              <Button variant="outline" onClick={() => setIsControlsOpen(true)}>
                <Settings style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
                Report Controls
              </Button>
              <Button 
                variant="outline" 
                onClick={() => currentReport && handleOpenSubscription(currentReport.metadata.type, currentReport.metadata.title)}
              >
                <Bell style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
                {currentReport && getActiveSubscription(currentReport.metadata.type) 
                  ? `Subscribed • ${formatFrequency(getActiveSubscription(currentReport.metadata.type)!.frequency)}`
                  : 'Subscribe'
                }
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <FileSpreadsheet style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
                CSV
              </Button>
              <Button onClick={handleExportPDF}>
                <Printer style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
                Print
              </Button>
            </>
          }
        />

        {/* Report Content */}
        {currentReport && (
          <ReportRenderer 
            reportData={currentReport} 
            displayConfig={displayConfigs[currentReport.metadata.type]}
          />
        )}
      </PageContainer>

      {/* Slide-out Sidebar for Report Controls */}
      {currentReport && (
        <SlideOut
          open={isControlsOpen}
          onClose={() => setIsControlsOpen(false)}
          title="Report Controls"
          description="Customize report columns and grouping"
          icon={<Settings size={18} />}
          resizable
          defaultWidth={520}
          minWidth={400}
          maxWidth={900}
        >
          <ReportColumnConfig
            reportType={currentReport.metadata.type}
            currentConfig={displayConfigs[currentReport.metadata.type]}
            onSave={(config) => {
              setDisplayConfigs(prev => ({
                ...prev,
                [currentReport.metadata.type]: config,
              }));
              toast.success('View settings updated!');
            }}
          />
        </SlideOut>
      )}
      
      {/* Slide-out Sidebar for Subscription Management */}
      <SlideOut
        open={isSubscriptionSidebarOpen}
        onClose={() => setIsSubscriptionSidebarOpen(false)}
        title="Report Subscription"
        description="Configure automatic report delivery"
        icon={<Bell size={18} />}
        defaultWidth={480}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-6)'
        }}>
          {/* Subscription Form */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)'
          }}>
            <div style={{
              padding: 'var(--spacing-4)',
              backgroundColor: 'var(--muted)',
              borderRadius: 'var(--radius-md)'
            }}>
              <h3 style={{ marginBottom: 'var(--spacing-2)' }}>{subscriptionFormData.reportName}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                Configure how and when you want to receive this report
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              <Label htmlFor="sub-frequency">Delivery Frequency</Label>
              <select
                id="sub-frequency"
                value={subscriptionFormData.frequency}
                onChange={(e) => setSubscriptionFormData(prev => ({ ...prev, frequency: e.target.value as SubscriptionFrequency }))}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer'
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              <Label htmlFor="sub-time">Delivery Time</Label>
              <Input
                id="sub-time"
                type="time"
                value={subscriptionFormData.deliveryTime}
                onChange={(e) => setSubscriptionFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
              />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
                {subscriptionFormData.frequency === 'daily' && 'Report will be delivered every day at this time'}
                {subscriptionFormData.frequency === 'weekly' && 'Report will be delivered every Monday at this time'}
                {subscriptionFormData.frequency === 'monthly' && 'Report will be delivered on the 1st of each month at this time'}
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              <Label htmlFor="sub-email">Recipient Email</Label>
              <Input
                id="sub-email"
                type="email"
                value={subscriptionFormData.recipientEmail}
                onChange={(e) => setSubscriptionFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                placeholder="your.email@example.com"
              />
            </div>

            <Button
              onClick={handleCreateSubscription}
              style={{ width: '100%' }}
            >
              <Bell style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
              {getActiveSubscription(subscriptionFormData.reportType!) ? 'Update Subscription' : 'Create Subscription'}
            </Button>
          </div>

          <Separator />

          {/* Active Subscriptions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)'
            }}>
              <h3>Your Subscriptions</h3>
              <Badge variant="outline">{subscriptions.length}</Badge>
            </div>

            {subscriptions.length === 0 ? (
              <div style={{
                padding: 'var(--spacing-6)',
                textAlign: 'center',
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius-md)'
              }}>
                <BellOff style={{
                  width: '32px',
                  height: '32px',
                  margin: '0 auto var(--spacing-3)',
                  color: 'var(--muted-foreground)'
                }} />
                <p style={{ color: 'var(--muted-foreground)' }}>
                  No active subscriptions yet
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)'
              }}>
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      padding: 'var(--spacing-4)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-3)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-2)'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: 'var(--spacing-1)' }}>{sub.reportName}</h4>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--spacing-1)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--muted-foreground)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <Clock size={14} />
                            {formatFrequency(sub.frequency)} at {sub.deliveryTime}
                          </div>
                          <div>
                            To: {sub.recipientEmail}
                          </div>
                        </div>
                      </div>
                      <Badge variant={sub.isActive ? 'default' : 'outline'}>
                        {sub.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: 'var(--spacing-2)'
                    }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSubscription(sub.id)}
                        style={{ flex: 1 }}
                      >
                        {sub.isActive ? (
                          <>
                            <BellOff size={14} style={{ marginRight: 'var(--spacing-2)' }} />
                            Pause
                          </>
                        ) : (
                          <>
                            <Bell size={14} style={{ marginRight: 'var(--spacing-2)' }} />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubscription(sub.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SlideOut>
    </>
  );
}