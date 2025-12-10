import React, { useState } from 'react';
import { SlideOut } from './design-system/SlideOut';
import { Button } from './design-system/Button';
import { Label } from './design-system/Label';
import { Input } from './design-system/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { RadioGroup, RadioGroupItem } from './design-system/RadioGroup';
import { Badge } from './design-system/Badge';
import { Alert, AlertDescription } from './design-system/Alert';
import { Database, Upload, Settings, Info, Check } from 'lucide-react';

export interface DataSourceConfig {
  type: 'none' | 'system' | 'custom' | 'both';
  systemMetric?: string;
  aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
  customSource?: string;
  customLabel?: string;
  dataPriority?: 'system' | 'custom';
}

interface DataSourceConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: DataSourceConfig) => void;
  sectionTitle: string;
  initialConfig?: DataSourceConfig;
}

const SYSTEM_METRICS = [
  { value: 'avg-performance', label: 'Average Performance %' },
  { value: 'total-hours', label: 'Total Hours Worked' },
  { value: 'completion-rate', label: 'Task Completion Rate' },
  { value: 'efficiency-rate', label: 'Efficiency Rate' },
  { value: 'quality-score', label: 'Quality Score' },
  { value: 'cost-savings', label: 'Cost Savings' },
  { value: 'employee-count', label: 'Employee Count' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'customer-satisfaction', label: 'Customer Satisfaction' },
];

export function DataSourceConfigDialog({
  open,
  onClose,
  onSave,
  sectionTitle,
  initialConfig,
}: DataSourceConfigDialogProps) {
  const [config, setConfig] = useState<DataSourceConfig>(
    initialConfig || {
      type: 'none',
      aggregation: 'avg',
      dataPriority: 'system',
    }
  );

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleTypeChange = (type: DataSourceConfig['type']) => {
    setConfig({
      ...config,
      type,
      // Reset priority when switching away from 'both'
      ...(type !== 'both' && { dataPriority: 'system' }),
    });
  };

  return (
    <SlideOut
      open={open}
      onClose={onClose}
      title="Configure Data Source"
      description={
        <>
          Configure where <strong style={{ color: 'var(--color-foreground)' }}>{sectionTitle}</strong> will pull its data from
        </>
      }
      icon={<Settings size={18} />}
      resizable
      defaultWidth={580}
      minWidth={480}
      maxWidth={800}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
            Save Configuration
          </Button>
        </>
      }
    >
          {/* Data Source Type Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Label className="label-medium">
              Data Source Type
            </Label>
            <RadioGroup value={config.type} onValueChange={handleTypeChange}>
              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 'var(--spacing-4)',
                  border: '1px solid',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: config.type === 'none' ? 'var(--color-chart-1)' : 'var(--color-border)',
                  backgroundColor: config.type === 'none' ? 'var(--color-info-light)' : 'transparent',
                  gap: 'var(--spacing-3)'
                }}
                onClick={() => handleTypeChange('none')}
              >
                <RadioGroupItem value="none" id="type-none" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <Settings style={{ height: '16px', width: '16px', color: 'var(--color-muted-foreground)' }} />
                    <Label htmlFor="type-none" className="label-clickable">
                      No Data Source
                    </Label>
                  </div>
                  <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-muted-foreground)' }}>
                    Use default mock data for preview only
                  </p>
                </div>
              </div>

              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 'var(--spacing-4)',
                  border: '1px solid',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: config.type === 'system' ? 'var(--color-chart-1)' : 'var(--color-border)',
                  backgroundColor: config.type === 'system' ? 'var(--color-info-light)' : 'transparent',
                  gap: 'var(--spacing-3)'
                }}
                onClick={() => handleTypeChange('system')}
              >
                <RadioGroupItem value="system" id="type-system" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <Database style={{ height: '16px', width: '16px', color: 'var(--color-chart-1)' }} />
                    <Label htmlFor="type-system" className="label-clickable">
                      System Metrics
                    </Label>
                    <Badge variant="outline" className="badge-success">
                      Recommended
                    </Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-muted-foreground)' }}>
                    Pull data from your organization's system metrics
                  </p>
                </div>
              </div>

              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 'var(--spacing-4)',
                  border: '1px solid',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: config.type === 'custom' ? 'var(--color-chart-1)' : 'var(--color-border)',
                  backgroundColor: config.type === 'custom' ? 'var(--color-info-light)' : 'transparent',
                  gap: 'var(--spacing-3)'
                }}
                onClick={() => handleTypeChange('custom')}
              >
                <RadioGroupItem value="custom" id="type-custom" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <Upload style={{ height: '16px', width: '16px', color: 'var(--color-chart-2)' }} />
                    <Label htmlFor="type-custom" className="label-clickable">
                      Custom Data
                    </Label>
                  </div>
                  <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-muted-foreground)' }}>
                    Upload or connect to external data sources
                  </p>
                </div>
              </div>

              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: 'var(--spacing-4)',
                  border: '1px solid',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: config.type === 'both' ? 'var(--color-chart-1)' : 'var(--color-border)',
                  backgroundColor: config.type === 'both' ? 'var(--color-info-light)' : 'transparent',
                  gap: 'var(--spacing-3)'
                }}
                onClick={() => handleTypeChange('both')}
              >
                <RadioGroupItem value="both" id="type-both" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <Database style={{ height: '16px', width: '16px', color: 'var(--color-chart-5)' }} />
                    <Label htmlFor="type-both" className="label-clickable">
                      Both (Hybrid)
                    </Label>
                    <Badge variant="outline" className="badge-chart-5">
                      Advanced
                    </Badge>
                  </div>
                  <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-muted-foreground)' }}>
                    Combine system metrics with custom data
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* System Metrics Configuration */}
          {(config.type === 'system' || config.type === 'both') && (
            <div style={{ 
              padding: 'var(--spacing-4)', 
              backgroundColor: 'var(--color-info-light)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid',
              borderColor: 'var(--color-chart-1)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Database style={{ height: '16px', width: '16px', color: 'var(--color-chart-1)' }} />
                  <h4 style={{ 
                    fontFamily: 'var(--font-family-inter)', 
                    fontSize: 'var(--text-label)', 
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-foreground)'
                  }}>
                    System Metrics Configuration
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="system-metric">
                    Select Metric
                  </Label>
                  <Select 
                    value={config.systemMetric} 
                    onValueChange={(value) => setConfig({ ...config, systemMetric: value })}
                  >
                    <SelectTrigger id="system-metric">
                      <SelectValue placeholder="Choose a system metric..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SYSTEM_METRICS.map((metric) => (
                        <SelectItem key={metric.value} value={metric.value}>
                          {metric.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="aggregation">
                    Aggregation Method
                  </Label>
                  <Select 
                    value={config.aggregation} 
                    onValueChange={(value: any) => setConfig({ ...config, aggregation: value })}
                  >
                    <SelectTrigger id="aggregation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avg">Average</SelectItem>
                      <SelectItem value="sum">Sum</SelectItem>
                      <SelectItem value="min">Minimum</SelectItem>
                      <SelectItem value="max">Maximum</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Custom Data Configuration */}
          {(config.type === 'custom' || config.type === 'both') && (
            <div style={{ 
              padding: 'var(--spacing-4)', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid',
              borderColor: 'var(--color-chart-2)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Upload style={{ height: '16px', width: '16px', color: 'var(--color-chart-2)' }} />
                  <h4 style={{ 
                    fontFamily: 'var(--font-family-inter)', 
                    fontSize: 'var(--text-label)', 
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-foreground)'
                  }}>
                    Custom Data Configuration
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="custom-source">
                    Data Source Name
                  </Label>
                  <Input
                    id="custom-source"
                    placeholder="e.g., CSV Import, External API, Spreadsheet..."
                    value={config.customSource || ''}
                    onChange={(e) => setConfig({ ...config, customSource: e.target.value })}
                    style={{ fontFamily: 'var(--font-family-inter)', fontSize: 'var(--text-base)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Label htmlFor="custom-label">
                    Display Label
                  </Label>
                  <Input
                    id="custom-label"
                    placeholder="e.g., Q4 Sales Data, Field Survey Results..."
                    value={config.customLabel || ''}
                    onChange={(e) => setConfig({ ...config, customLabel: e.target.value })}
                    style={{ fontFamily: 'var(--font-family-inter)', fontSize: 'var(--text-base)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Data Priority for Hybrid Mode */}
          {config.type === 'both' && (
            <div style={{ 
              padding: 'var(--spacing-4)', 
              backgroundColor: 'rgba(168, 85, 247, 0.1)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid',
              borderColor: 'var(--color-chart-5)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                  <h4 style={{ 
                    fontFamily: 'var(--font-family-inter)', 
                    fontSize: 'var(--text-label)', 
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-foreground)',
                    marginBottom: 'var(--spacing-1)'
                  }}>
                    Data Priority
                  </h4>
                  <p style={{ fontSize: 'var(--text-detail)', color: 'var(--color-muted-foreground)' }}>
                    When both sources are available, which should take priority?
                  </p>
                </div>

                <RadioGroup 
                  value={config.dataPriority} 
                  onValueChange={(value: any) => setConfig({ ...config, dataPriority: value })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <RadioGroupItem value="system" id="priority-system" />
                    <Label htmlFor="priority-system" className="label-clickable">
                      System Metrics (fallback to custom if unavailable)
                    </Label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <RadioGroupItem value="custom" id="priority-custom" />
                    <Label htmlFor="priority-custom" className="label-clickable">
                      Custom Data (fallback to system if unavailable)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <Alert variant="default">
            <Info style={{ height: '16px', width: '16px', color: 'var(--color-info)' }} />
            <AlertDescription>
              {config.type === 'none' && 'This section will display mock data for preview purposes only.'}
              {config.type === 'system' && 'This section will pull real-time data from your organization\'s system metrics.'}
              {config.type === 'custom' && 'You\'ll be able to upload or connect custom data sources after saving.'}
              {config.type === 'both' && 'This section will combine both system metrics and custom data based on your priority settings.'}
            </AlertDescription>
          </Alert>
    </SlideOut>
  );
}
