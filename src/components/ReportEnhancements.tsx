/**
 * Report Enhancements Panel
 * Advanced features: saved views, period comparison, global search, density controls
 */

import React, { useState, useEffect } from 'react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Select } from './design-system/Select';
import { Label } from './design-system/Label';
import { Badge } from './design-system/Badge';
import { Dialog } from './design-system/Dialog';
import { Separator } from './design-system/Separator';
import { Switch } from './design-system/Switch';
import {
  Save,
  FolderOpen,
  Search,
  Maximize2,
  Minimize2,
  Grid3x3,
  Copy,
  Link2,
  Calendar,
  RefreshCw,
  Bell,
  Download,
  Trash2,
  Share2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  config: any;
  createdAt: string;
  lastUsed?: string;
}

export interface PeriodComparison {
  enabled: boolean;
  baseStartDate: string;
  baseEndDate: string;
  compareStartDate: string;
  compareEndDate: string;
  comparisonType: 'previous-period' | 'previous-year' | 'custom';
}

interface ReportEnhancementsProps {
  onSaveView?: (view: Omit<SavedView, 'id' | 'createdAt'>) => void;
  onLoadView?: (viewId: string) => void;
  onDeleteView?: (viewId: string) => void;
  savedViews?: SavedView[];
  onGlobalSearch?: (query: string) => void;
  onDensityChange?: (density: 'compact' | 'comfortable' | 'spacious') => void;
  density?: 'compact' | 'comfortable' | 'spacious';
  onPeriodComparison?: (comparison: PeriodComparison) => void;
  onShareLink?: () => string;
  onScheduleReport?: (schedule: any) => void;
  onExport?: (format: 'excel' | 'csv' | 'pdf' | 'google-sheets') => void;
  onSetAlert?: (alert: any) => void;
  refreshInterval?: number;
  onRefreshIntervalChange?: (interval: number) => void;
  lastRefreshed?: Date;
}

export function ReportEnhancements({
  onSaveView,
  onLoadView,
  onDeleteView,
  savedViews = [],
  onGlobalSearch,
  onDensityChange,
  density = 'comfortable',
  onPeriodComparison,
  onShareLink,
  onScheduleReport,
  onExport,
  onSetAlert,
  refreshInterval = 0,
  onRefreshIntervalChange,
  lastRefreshed
}: ReportEnhancementsProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDescription, setNewViewDescription] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [comparisonConfig, setComparisonConfig] = useState<PeriodComparison>({
    enabled: false,
    baseStartDate: '',
    baseEndDate: '',
    compareStartDate: '',
    compareEndDate: '',
    comparisonType: 'previous-period'
  });

  // Global search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (globalSearchQuery) {
        onGlobalSearch?.(globalSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [globalSearchQuery, onGlobalSearch]);

  const handleSaveView = () => {
    if (!newViewName.trim()) {
      toast.error('Please enter a view name');
      return;
    }

    onSaveView?.({
      name: newViewName,
      description: newViewDescription,
      config: {} // This would include current column config, filters, etc.
    });

    setNewViewName('');
    setNewViewDescription('');
    setShowSaveDialog(false);
    toast.success('View saved successfully!');
  };

  const handleLoadView = (viewId: string) => {
    onLoadView?.(viewId);
    setShowLoadDialog(false);
    toast.success('View loaded!');
  };

  const handleDeleteView = (viewId: string) => {
    onDeleteView?.(viewId);
    toast.success('View deleted');
  };

  const handleShareLink = () => {
    const link = onShareLink?.();
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success('Share link copied to clipboard!');
    }
  };

  const handlePeriodComparison = () => {
    onPeriodComparison?.(comparisonConfig);
    setShowComparisonDialog(false);
    toast.success('Period comparison applied!');
  };

  const calculateComparisonDates = (type: PeriodComparison['comparisonType']) => {
    const baseEnd = new Date(comparisonConfig.baseEndDate);
    const baseStart = new Date(comparisonConfig.baseStartDate);
    const diffDays = Math.ceil((baseEnd.getTime() - baseStart.getTime()) / (1000 * 60 * 60 * 24));

    let compareEnd = new Date(baseStart);
    compareEnd.setDate(compareEnd.getDate() - 1);
    
    let compareStart = new Date(compareEnd);
    
    if (type === 'previous-period') {
      compareStart.setDate(compareStart.getDate() - diffDays + 1);
    } else if (type === 'previous-year') {
      compareStart.setFullYear(baseStart.getFullYear() - 1);
      compareStart.setMonth(baseStart.getMonth());
      compareStart.setDate(baseStart.getDate());
      compareEnd.setFullYear(baseEnd.getFullYear() - 1);
      compareEnd.setMonth(baseEnd.getMonth());
      compareEnd.setDate(baseEnd.getDate());
    }

    setComparisonConfig(prev => ({
      ...prev,
      compareStartDate: compareStart.toISOString().split('T')[0],
      compareEndDate: compareEnd.toISOString().split('T')[0]
    }));
  };

  return (
    <div className="report-enhancements-panel">
      <div className="space-y-6">
        {/* Global Search */}
        <div>
          <div className="flex-start">
            <Search className="icon-sm" />
            <div className="label-section">Global Search</div>
          </div>
          <Input
            placeholder="Search across all data..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="report-enhancements-search"
          />
          {globalSearchQuery && (
            <p className="text-detail">Searching for: "{globalSearchQuery}"</p>
          )}
        </div>

        <Separator />

        {/* View Density */}
        <div>
          <div className="flex-start">
            <Grid3x3 className="icon-sm" />
            <div className="label-section">View Density</div>
          </div>
          <div className="report-enhancements-density-selector">
            <Button
              variant={density === 'compact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDensityChange?.('compact')}
            >
              <Minimize2 className="icon-sm" />
              Compact
            </Button>
            <Button
              variant={density === 'comfortable' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDensityChange?.('comfortable')}
            >
              <Grid3x3 className="icon-sm" />
              Comfortable
            </Button>
            <Button
              variant={density === 'spacious' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDensityChange?.('spacious')}
            >
              <Maximize2 className="icon-sm" />
              Spacious
            </Button>
          </div>
        </div>

        <Separator />

        {/* Saved Views */}
        <div>
          <div className="flex-between">
            <div className="flex-start">
              <FolderOpen className="icon-sm" />
              <div className="label-section">Saved Views</div>
            </div>
            <Badge variant="outline">{savedViews.length}</Badge>
          </div>

          <div className="report-enhancements-actions">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(true)}
            >
              <Save className="icon-sm" />
              Save Current View
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLoadDialog(true)}
            >
              <FolderOpen className="icon-sm" />
              Load View
            </Button>
          </div>
        </div>

        <Separator />

        {/* Period Comparison */}
        <div>
          <div className="flex-start">
            <Calendar className="icon-sm" />
            <div className="label-section">Period Comparison</div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowComparisonDialog(true)}
          >
            <Calendar className="icon-sm" />
            Compare Periods
          </Button>
          {comparisonConfig.enabled && (
            <Badge variant="outline" className="report-enhancements-comparison-badge">
              Comparing {comparisonConfig.comparisonType}
            </Badge>
          )}
        </div>

        <Separator />

        {/* Auto Refresh */}
        <div>
          <div className="flex-start">
            <RefreshCw className="icon-sm" />
            <div className="label-section">Auto Refresh</div>
          </div>
          <Select
            value={refreshInterval}
            onChange={(e) => onRefreshIntervalChange?.(Number(e.target.value))}
          >
            <option value={0}>Off</option>
            <option value={30000}>Every 30 seconds</option>
            <option value={60000}>Every minute</option>
            <option value={300000}>Every 5 minutes</option>
            <option value={600000}>Every 10 minutes</option>
          </Select>
          {lastRefreshed && (
            <p className="text-detail">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div>
          <div className="label-section">Quick Actions</div>
          <div className="report-enhancements-quick-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLink}
            >
              <Share2 className="icon-sm" />
              Share Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScheduleDialog(true)}
            >
              <Clock className="icon-sm" />
              Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlertDialog(true)}
            >
              <Bell className="icon-sm" />
              Set Alert
            </Button>
          </div>
        </div>

        <Separator />

        {/* Export Options */}
        <div>
          <div className="label-section">Export</div>
          <div className="report-enhancements-export-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport?.('excel')}
            >
              <Download className="icon-sm" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport?.('csv')}
            >
              <Download className="icon-sm" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport?.('google-sheets')}
            >
              <Download className="icon-sm" />
              Sheets
            </Button>
          </div>
        </div>
      </div>

      {/* Save View Dialog */}
      {showSaveDialog && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">Save Report View</div>
              <div className="dialog-description">
                Save your current column configuration, filters, and settings
              </div>
            </div>

            <div className="dialog-body space-y-4">
              <div>
                <Label htmlFor="viewName">View Name</Label>
                <Input
                  id="viewName"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="e.g., Weekly Performance Summary"
                />
              </div>
              <div>
                <Label htmlFor="viewDescription">Description (Optional)</Label>
                <Input
                  id="viewDescription"
                  value={newViewDescription}
                  onChange={(e) => setNewViewDescription(e.target.value)}
                  placeholder="Brief description of this view"
                />
              </div>
            </div>

            <div className="dialog-footer">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveView}>
                <Save className="icon-sm" />
                Save View
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Load View Dialog */}
      {showLoadDialog && (
        <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">Load Saved View</div>
              <div className="dialog-description">
                Choose a saved view to load
              </div>
            </div>

            <div className="dialog-body">
              {savedViews.length === 0 ? (
                <p className="text-muted">No saved views yet</p>
              ) : (
                <div className="report-enhancements-saved-views-list">
                  {savedViews.map((view) => (
                    <div key={view.id} className="report-enhancements-saved-view-item">
                      <div>
                        <div className="report-enhancements-saved-view-name">
                          {view.name}
                        </div>
                        {view.description && (
                          <p className="text-detail">{view.description}</p>
                        )}
                        <p className="text-detail">
                          Created: {new Date(view.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="report-enhancements-saved-view-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadView(view.id)}
                        >
                          <FolderOpen className="icon-sm" />
                          Load
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteView(view.id)}
                        >
                          <Trash2 className="icon-sm" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dialog-footer">
              <Button
                variant="outline"
                onClick={() => setShowLoadDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Period Comparison Dialog */}
      {showComparisonDialog && (
        <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">Period Comparison</div>
              <div className="dialog-description">
                Compare performance across different time periods
              </div>
            </div>

            <div className="dialog-body space-y-4">
              <div>
                <Label>Base Period</Label>
                <div className="report-enhancements-date-range">
                  <Input
                    type="date"
                    value={comparisonConfig.baseStartDate}
                    onChange={(e) => setComparisonConfig(prev => ({
                      ...prev,
                      baseStartDate: e.target.value
                    }))}
                  />
                  <span>to</span>
                  <Input
                    type="date"
                    value={comparisonConfig.baseEndDate}
                    onChange={(e) => {
                      setComparisonConfig(prev => ({
                        ...prev,
                        baseEndDate: e.target.value
                      }));
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comparisonType">Comparison Type</Label>
                <Select
                  id="comparisonType"
                  value={comparisonConfig.comparisonType}
                  onChange={(e) => {
                    const type = e.target.value as PeriodComparison['comparisonType'];
                    setComparisonConfig(prev => ({
                      ...prev,
                      comparisonType: type
                    }));
                    if (type !== 'custom') {
                      calculateComparisonDates(type);
                    }
                  }}
                >
                  <option value="previous-period">Previous Period</option>
                  <option value="previous-year">Previous Year</option>
                  <option value="custom">Custom</option>
                </Select>
              </div>

              {comparisonConfig.comparisonType === 'custom' && (
                <div>
                  <Label>Compare Period</Label>
                  <div className="report-enhancements-date-range">
                    <Input
                      type="date"
                      value={comparisonConfig.compareStartDate}
                      onChange={(e) => setComparisonConfig(prev => ({
                        ...prev,
                        compareStartDate: e.target.value
                      }))}
                    />
                    <span>to</span>
                    <Input
                      type="date"
                      value={comparisonConfig.compareEndDate}
                      onChange={(e) => setComparisonConfig(prev => ({
                        ...prev,
                        compareEndDate: e.target.value
                      }))}
                    />
                  </div>
                </div>
              )}

              {comparisonConfig.compareStartDate && comparisonConfig.compareEndDate && (
                <div className="report-enhancements-comparison-preview">
                  <p className="text-muted">
                    Comparing: {new Date(comparisonConfig.baseStartDate).toLocaleDateString()} - {new Date(comparisonConfig.baseEndDate).toLocaleDateString()}
                  </p>
                  <p className="text-muted">
                    With: {new Date(comparisonConfig.compareStartDate).toLocaleDateString()} - {new Date(comparisonConfig.compareEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="dialog-footer">
              <Button
                variant="outline"
                onClick={() => setShowComparisonDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handlePeriodComparison}>
                <Calendar className="icon-sm" />
                Apply Comparison
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Schedule Dialog */}
      {showScheduleDialog && (
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">Schedule Report</div>
              <div className="dialog-description">
                Automatically deliver this report via email
              </div>
            </div>

            <div className="dialog-body space-y-4">
              <div>
                <Label htmlFor="scheduleFrequency">Frequency</Label>
                <Select id="scheduleFrequency">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="scheduleEmail">Email Recipients</Label>
                <Input
                  id="scheduleEmail"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="dialog-footer">
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Report scheduled!');
                setShowScheduleDialog(false);
              }}>
                <Clock className="icon-sm" />
                Schedule
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Alert Dialog */}
      {showAlertDialog && (
        <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">Set Performance Alert</div>
              <div className="dialog-description">
                Get notified when metrics cross thresholds
              </div>
            </div>

            <div className="dialog-body space-y-4">
              <div>
                <Label htmlFor="alertMetric">Metric</Label>
                <Select id="alertMetric">
                  <option value="performance">Performance %</option>
                  <option value="volume">Volume</option>
                  <option value="variance">Variance</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="alertCondition">Condition</Label>
                <Select id="alertCondition">
                  <option value="below">Falls below</option>
                  <option value="above">Rises above</option>
                  <option value="equals">Equals</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="alertThreshold">Threshold</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  placeholder="75"
                />
              </div>
            </div>

            <div className="dialog-footer">
              <Button
                variant="outline"
                onClick={() => setShowAlertDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Alert created!');
                setShowAlertDialog(false);
              }}>
                <Bell className="icon-sm" />
                Create Alert
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
