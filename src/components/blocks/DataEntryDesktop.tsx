import { useState } from 'react';
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from '../design-system/Card';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../design-system/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../design-system/Select';
import { CheckCircle2, AlertCircle, Smartphone, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '../design-system/Alert';
import { Badge } from '../design-system/Badge';
import { updateActualVolume, tasks, DailyMetrics, JobFunction } from '../../lib/mockData';

interface DataEntryDesktopProps {
  metrics: DailyMetrics[];
  jobFunction: JobFunction | undefined;
  supervisorName: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onBack: () => void;
  availableJobFunctions?: JobFunction[];
  onJobFunctionChange?: (jf: JobFunction) => void;
  onSwitchToMobile?: () => void;
}

type ScreenMode = 'entry' | 'confirmation' | 'success';

export function DataEntryDesktop({
  metrics,
  jobFunction,
  supervisorName,
  selectedDate,
  onDateChange,
  onBack,
  availableJobFunctions = [],
  onJobFunctionChange,
  onSwitchToMobile,
}: DataEntryDesktopProps) {
  const [screenMode, setScreenMode] = useState<ScreenMode>('entry');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (metricId: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [metricId]: value,
    }));
    if (errors[metricId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[metricId];
        return newErrors;
      });
    }
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    metrics.forEach(metric => {
      const value = inputValues[metric.id];
      if (metric.actualVolume === null && (!value || value.trim() === '')) {
        newErrors[metric.id] = 'Required';
        hasErrors = true;
      } else if (value && isNaN(Number(value))) {
        newErrors[metric.id] = 'Invalid';
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleContinue = () => {
    if (validateInputs()) {
      setScreenMode('confirmation');
    }
  };

  const handleSubmit = () => {
    Object.entries(inputValues).forEach(([metricId, value]) => {
      if (value && !isNaN(Number(value))) {
        updateActualVolume(metricId, Number(value));
      }
    });

    setScreenMode('success');
  };

  const handleBackToEntry = () => {
    setScreenMode('entry');
  };

  const handleComplete = () => {
    setInputValues({});
    setErrors({});
    setScreenMode('entry');
    onBack();
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const getPerformanceBadge = (performance: number | null) => {
    if (performance === null) return <Badge variant="outline">Pending</Badge>;
    if (performance >= 100) return <Badge style={{ backgroundColor: 'var(--color-success-muted)', color: 'var(--color-success)', border: 'none' }}>Over</Badge>;
    if (performance >= 95) return <Badge style={{ backgroundColor: 'var(--color-accent-muted)', color: 'var(--color-accent)', border: 'none' }}>On Target</Badge>;
    return <Badge style={{ backgroundColor: 'var(--color-warning-muted)', color: 'var(--color-warning)', border: 'none' }}>Below</Badge>;
  };

  // Entry Screen
  if (screenMode === 'entry') {
    const completedCount = metrics.filter(m => m.actualVolume !== null).length;
    const totalCount = metrics.length;
    const completionPercentage = (completedCount / totalCount) * 100;

    return (
      <div>
        {/* Controls Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 'var(--spacing-4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
              <div>
                {availableJobFunctions.length > 1 && onJobFunctionChange ? (
                  <Select 
                    value={jobFunction?.id} 
                    onValueChange={(value) => {
                      const jf = availableJobFunctions.find(j => j.id === value);
                      if (jf) onJobFunctionChange(jf);
                    }}
                  >
                    <SelectTrigger style={{ width: '200px' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableJobFunctions.map(jf => (
                        <SelectItem key={jf.id} value={jf.id}>
                          {jf.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p style={{ 
                    fontSize: 'var(--text-body)', 
                    color: 'var(--color-foreground)',
                    fontFamily: 'var(--font-family-inter)',
                  }}>{jobFunction?.name}</p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-body)',
                    backgroundColor: 'var(--color-background)',
                    color: 'var(--color-foreground)',
                    fontFamily: 'var(--font-family-inter)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <div style={{ 
                  width: '128px', 
                  height: '8px', 
                  backgroundColor: 'var(--color-muted)', 
                  borderRadius: 'var(--radius-full)', 
                  overflow: 'hidden' 
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      backgroundColor: 'var(--color-success)', 
                      transition: 'width 0.3s',
                      width: `${completionPercentage}%` 
                    }}
                  />
                </div>
                <span style={{ 
                  fontSize: 'var(--text-body)', 
                  color: 'var(--color-foreground)',
                  fontFamily: 'var(--font-family-inter)',
                }}>{completedCount}/{totalCount}</span>
                <span style={{ 
                  fontSize: 'var(--text-label)', 
                  color: 'var(--color-muted-foreground)',
                  fontFamily: 'var(--font-family-inter)',
                }}>Progress</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              {onSwitchToMobile && (
                <Button variant="outline" size="sm" onClick={onSwitchToMobile}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Switch to Mobile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div 
          style={{ 
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-6)',
            backgroundColor: 'transparent',
          }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h4 style={{ marginBottom: 'var(--spacing-2)' }}>{jobFunction?.name} • {supervisorName}</h4>
              <p style={{ 
                fontSize: 'var(--text-body)', 
                color: 'var(--color-muted-foreground)',
                fontFamily: 'var(--font-family-inter)',
              }}>Enter actual volumes for all tasks. All fields marked with * are required.</p>
            </div>
            
            <div style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden'
            }}>
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: 'var(--color-muted)' }}>
                    <TableHead style={{ height: '48px' }}>A - Task</TableHead>
                    <TableHead style={{ textAlign: 'right', height: '48px' }}>B - Budgeted Volume</TableHead>
                    <TableHead style={{ textAlign: 'right', height: '48px' }}>C - Rate (UPH)</TableHead>
                    <TableHead style={{ textAlign: 'right', height: '48px' }}>D - Budgeted Hours</TableHead>
                    <TableHead style={{ textAlign: 'right', height: '48px' }}>E - Forecasted Volume</TableHead>
                    <TableHead style={{ textAlign: 'right', height: '48px' }}>F - Actual Volume *</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => {
                    const task = tasks.find(t => t.id === metric.taskId);
                    const currentValue = inputValues[metric.id] || (metric.actualVolume?.toString() || '');
                    const hasError = errors[metric.id];
                    const isCompleted = metric.actualVolume !== null && !inputValues[metric.id];

                    return (
                      <TableRow 
                        key={metric.id} 
                        style={{
                          height: '64px',
                          backgroundColor: isCompleted ? 'var(--color-success-muted)' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            {isCompleted && (
                              <CheckCircle2 
                                className="h-4 w-4 flex-shrink-0" 
                                style={{ color: 'var(--color-success)' }}
                              />
                            )}
                            <span style={{ 
                              fontSize: 'var(--text-body)',
                              fontFamily: 'var(--font-family-inter)',
                            }}>{task?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell style={{ 
                          textAlign: 'right', 
                          fontSize: 'var(--text-body)',
                          fontFamily: 'var(--font-family-inter)',
                        }}>{formatNumber(metric.budgetedVolume)}</TableCell>
                        <TableCell style={{ 
                          textAlign: 'right', 
                          fontSize: 'var(--text-body)',
                          fontFamily: 'var(--font-family-inter)',
                        }}>{formatNumber(metric.budgetedRate)}</TableCell>
                        <TableCell style={{ 
                          textAlign: 'right', 
                          fontSize: 'var(--text-body)',
                          fontFamily: 'var(--font-family-inter)',
                        }}>{metric.budgetedHours.toFixed(1)}</TableCell>
                        <TableCell style={{ 
                          textAlign: 'right', 
                          fontSize: 'var(--text-body)',
                          fontFamily: 'var(--font-family-inter)',
                        }}>{formatNumber(metric.forecastedVolume)}</TableCell>
                        <TableCell style={{ width: '200px' }}>
                          <Input
                            type="number"
                            placeholder="Enter..."
                            value={currentValue}
                            onChange={(e) => handleInputChange(metric.id, e.target.value)}
                            disabled={isCompleted}
                            style={{
                              textAlign: 'right',
                              border: hasError 
                                ? '2px solid var(--color-destructive)' 
                                : isCompleted 
                                ? '2px solid var(--color-success)'
                                : '2px solid var(--color-border)',
                              backgroundColor: hasError 
                                ? 'var(--color-destructive-muted)'
                                : isCompleted
                                ? 'var(--color-success-muted)'
                                : 'var(--color-background)',
                              padding: 'var(--spacing-2)',
                              borderRadius: 'var(--radius)',
                              fontFamily: 'var(--font-family-inter)',
                            }}
                          />
                          {hasError && (
                            <p style={{ 
                              fontSize: 'var(--text-label)', 
                              color: 'var(--color-destructive)', 
                              marginTop: 'var(--spacing-1)',
                              fontFamily: 'var(--font-family-inter)',
                            }}>{hasError}</p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            </div>
            
            <div style={{ 
              marginTop: 'var(--spacing-6)', 
              fontSize: 'var(--text-label)', 
              color: 'var(--color-muted-foreground)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-4)',
              fontFamily: 'var(--font-family-inter)',
            }}>
              <span>💡 Tip: Use Tab to navigate between fields, Enter to move to next row</span>
            </div>

            {/* Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-6)' }}>
              <Button size="lg" onClick={handleContinue} style={{ minWidth: '200px' }}>
                Continue to Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Screen - Shows ALL columns
  if (screenMode === 'confirmation') {
    return (
      <div 
        style={{ 
          flex: 1,
          overflow: 'auto',
          padding: 'var(--spacing-6)',
          backgroundColor: 'var(--color-muted)',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Button variant="ghost" size="icon" onClick={handleBackToEntry}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div style={{ flex: 1 }}>
            <h2>Review & Confirm</h2>
            <p style={{ 
              color: 'var(--color-muted-foreground)',
              fontFamily: 'var(--font-family-inter)',
            }}>Please review all entries before submitting</p>
          </div>
        </div>

        <Alert style={{ 
          borderColor: 'var(--color-accent)', 
          backgroundColor: 'var(--color-accent-muted)' 
        }}>
          <AlertCircle className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
          <AlertDescription style={{ 
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-family-inter)',
          }}>
            You're about to submit data for {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' })}. 
            Performance calculations will be updated automatically.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Complete Data Summary</CardTitle>
            <CardDescription>{jobFunction?.name} • {supervisorName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Budgeted Vol.</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Rate (UPH)</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Budgeted Hrs</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Forecasted Vol.</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actual Vol.</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Expected Hrs</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Actual Hrs</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => {
                    const task = tasks.find(t => t.id === metric.taskId);
                    const actualVolume = inputValues[metric.id] ? Number(inputValues[metric.id]) : metric.actualVolume;
                    if (!actualVolume) return null;

                    const actualHours = actualVolume / metric.budgetedRate;
                    const performance = (metric.expectedHours / actualHours) * 100;

                    return (
                      <TableRow key={metric.id}>
                        <TableCell>{task?.name}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{formatNumber(metric.budgetedVolume)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{formatNumber(metric.budgetedRate)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{metric.budgetedHours.toFixed(1)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{formatNumber(metric.forecastedVolume)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{formatNumber(actualVolume)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{metric.expectedHours.toFixed(1)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{actualHours.toFixed(1)}</TableCell>
                        <TableCell style={{ textAlign: 'right' }}>{getPerformanceBadge(performance)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

            <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={handleBackToEntry}>
                Back to Edit
              </Button>
              <Button size="lg" onClick={handleSubmit}>
                Submit All Entries
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  return (
    <div 
      style={{ 
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-6)',
        backgroundColor: 'var(--color-muted)',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <Card style={{ textAlign: 'center' }}>
        <CardContent style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'var(--color-success-muted)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto var(--spacing-6)' 
          }}>
            <CheckCircle2 className="h-10 w-10" style={{ color: 'var(--color-success)' }} />
          </div>
          <h2 style={{ marginBottom: 'var(--spacing-2)' }}>All Entries Submitted Successfully!</h2>
          <p style={{ 
            color: 'var(--color-muted-foreground)', 
            marginBottom: 'var(--spacing-8)',
            fontFamily: 'var(--font-family-inter)',
          }}>
            Your data for {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' })} has been saved and processed.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'var(--spacing-4)', 
            marginBottom: 'var(--spacing-8)',
            maxWidth: '100%',
            width: '100%'
          }}>
            <div style={{ 
              backgroundColor: 'var(--color-success-muted)', 
              border: '1px solid var(--color-success)', 
              borderRadius: 'var(--radius)', 
              padding: 'var(--spacing-4)' 
            }}>
              <p style={{ 
                fontSize: 'var(--text-2xl)', 
                color: 'var(--color-success)', 
                marginBottom: 'var(--spacing-1)',
                fontFamily: 'var(--font-family-inter)',
              }}>{metrics.length}</p>
              <p style={{ 
                fontSize: 'var(--text-body)', 
                color: 'var(--color-success)',
                fontFamily: 'var(--font-family-inter)',
              }}>Tasks Completed</p>
            </div>
            <div style={{ 
              backgroundColor: 'var(--color-success-muted)', 
              border: '1px solid var(--color-success)', 
              borderRadius: 'var(--radius)', 
              padding: 'var(--spacing-4)' 
            }}>
              <p style={{ 
                fontSize: 'var(--text-2xl)', 
                color: 'var(--color-success)', 
                marginBottom: 'var(--spacing-1)',
                fontFamily: 'var(--font-family-inter)',
              }}>
                {metrics.reduce((sum, m) => sum + (inputValues[m.id] ? Number(inputValues[m.id]) : m.actualVolume || 0), 0).toLocaleString()}
              </p>
              <p style={{ 
                fontSize: 'var(--text-body)', 
                color: 'var(--color-success)',
                fontFamily: 'var(--font-family-inter)',
              }}>Total Units Processed</p>
            </div>
            <div style={{ 
              backgroundColor: 'var(--color-success-muted)', 
              border: '1px solid var(--color-success)', 
              borderRadius: 'var(--radius)', 
              padding: 'var(--spacing-4)' 
            }}>
              <p style={{ 
                fontSize: 'var(--text-2xl)', 
                color: 'var(--color-success)', 
                marginBottom: 'var(--spacing-1)',
                fontFamily: 'var(--font-family-inter)',
              }}>
                {(metrics.reduce((sum, m) => {
                  const vol = inputValues[m.id] ? Number(inputValues[m.id]) : m.actualVolume || 0;
                  return sum + (vol / m.budgetedRate);
                }, 0)).toFixed(1)}
              </p>
              <p style={{ 
                fontSize: 'var(--text-body)', 
                color: 'var(--color-success)',
                fontFamily: 'var(--font-family-inter)',
              }}>Actual Hours</p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'var(--color-success-muted)', 
            border: '1px solid var(--color-success)', 
            borderRadius: 'var(--radius)', 
            padding: 'var(--spacing-4)', 
            marginBottom: 'var(--spacing-8)', 
            textAlign: 'left', 
            maxWidth: '100%',
            width: '100%',
            margin: '0 auto var(--spacing-8)' 
          }}>
            <p style={{ 
              fontSize: 'var(--text-body)', 
              color: 'var(--color-success)', 
              marginBottom: 'var(--spacing-2)',
              fontFamily: 'var(--font-family-inter)',
            }}>Next Steps:</p>
            <ul style={{ 
              fontSize: 'var(--text-body)', 
              color: 'var(--color-success)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--spacing-1)',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'var(--font-family-inter)',
            }}>
              <li>✓ Your Site Manager can now view this data</li>
              <li>✓ Performance metrics updated across all dashboards</li>
              <li>✓ Executive reports reflect your team's work</li>
              <li>✓ Data is saved for historical analysis</li>
            </ul>
          </div>

            <Button style={{ width: '100%' }} size="lg" onClick={handleComplete}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}