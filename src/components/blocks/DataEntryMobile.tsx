import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '../design-system/Card';
import { Button } from '../design-system/Button';
import { Input } from '../design-system/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../design-system/Select';
import { CheckCircle2, AlertCircle, Monitor, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '../design-system/Alert';
import { updateActualVolume, tasks, DailyMetrics, JobFunction } from '../../lib/mockData';

interface DataEntryMobileProps {
  metrics: DailyMetrics[];
  jobFunction: JobFunction | undefined;
  supervisorName: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onBack: () => void;
  availableJobFunctions?: JobFunction[];
  onJobFunctionChange?: (jf: JobFunction) => void;
  onSwitchToDesktop?: () => void;
}

type ScreenMode = 'entry' | 'confirmation' | 'success';

export function DataEntryMobile({
  metrics,
  jobFunction,
  supervisorName,
  selectedDate,
  onDateChange,
  onBack,
  availableJobFunctions = [],
  onJobFunctionChange,
  onSwitchToDesktop,
}: DataEntryMobileProps) {
  const [screenMode, setScreenMode] = useState<ScreenMode>('entry');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (metricId: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [metricId]: value,
    }));
    // Clear error when user starts typing
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
        newErrors[metric.id] = 'Invalid number';
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
    // Save all values
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

  // Entry Screen
  if (screenMode === 'entry') {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Mobile Header */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex-1">
            <h2 className="text-gray-900">Mobile Entry</h2>
            <p className="text-sm text-gray-600">{jobFunction?.name}</p>
          </div>
          {onSwitchToDesktop && (
            <Button variant="outline" size="sm" onClick={onSwitchToDesktop}>
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
          )}
        </div>

        {/* Date and Job Function Selectors */}
        <Card>
          <div className="pt-4 space-y-3" style={{ padding: 'var(--spacing-4)' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            {availableJobFunctions.length > 1 && onJobFunctionChange && (
              <Select 
                value={jobFunction?.id} 
                onValueChange={(value) => {
                  const jf = availableJobFunctions.find(j => j.id === value);
                  if (jf) onJobFunctionChange(jf);
                }}
              >
                <SelectTrigger className="w-full">
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
            )}
          </div>
        </Card>

        {/* Entry Form - Mobile Optimized */}
        <div className="space-y-3">
          {metrics.map((metric) => {
            const task = tasks.find(t => t.id === metric.taskId);
            const currentValue = inputValues[metric.id] || (metric.actualVolume?.toString() || '');
            const hasError = errors[metric.id];
            const isCompleted = metric.actualVolume !== null && !inputValues[metric.id];

            return (
              <Card key={metric.id} className={isCompleted ? 'bg-green-50 border-green-200' : ''}>
                <div className="pt-4" style={{ padding: 'var(--spacing-4)' }}>
                  <div className="space-y-3">
                    {/* Task Name */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="ds-heading-welcome" style={{ marginBottom: 'var(--spacing-1)' }}>{task?.name}</h4>
                        {isCompleted && (
                          <div className="flex items-center gap-1 text-sm text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Columns A, B, D (Mobile View) */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budgeted Volume:</span>
                        <span className="text-gray-900">{formatNumber(metric.budgetedVolume)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budgeted Hours:</span>
                        <span className="text-gray-900">{metric.budgetedHours.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Column F - Actual Volume Input */}
                    <div className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Actual Volume (required) *"
                        value={currentValue}
                        onChange={(e) => handleInputChange(metric.id, e.target.value)}
                        disabled={isCompleted}
                        className={hasError ? 'border-red-500' : ''}
                      />
                      {hasError && (
                        <p className="text-xs text-red-600">{hasError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <Card className="sticky bottom-4 shadow-lg">
          <div className="pt-4" style={{ padding: 'var(--spacing-4)' }}>
            <Button className="w-full" size="lg" onClick={handleContinue}>
              Continue to Review
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Confirmation Screen
  if (screenMode === 'confirmation') {
    const completedEntries = metrics.filter(m => inputValues[m.id] || m.actualVolume !== null);
    
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3 pb-4">
          <Button variant="ghost" size="icon" onClick={handleBackToEntry}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-gray-900">Review & Confirm</h2>
            <p className="text-sm text-gray-600">Please review your entries</p>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You're about to submit {completedEntries.length} task entries for {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </AlertDescription>
        </Alert>

        {/* Summary */}
        <Card>
          <div style={{ padding: 'var(--spacing-6)' }}>
            <CardTitle style={{ marginBottom: 'var(--spacing-1)' }}>Entry Summary</CardTitle>
            <CardDescription>{jobFunction?.name} • {supervisorName}</CardDescription>
          </div>
          <div className="space-y-3" style={{ padding: 'var(--spacing-6)', paddingTop: 0 }}>
            {metrics.map((metric) => {
              const task = tasks.find(t => t.id === metric.taskId);
              const actualVolume = inputValues[metric.id] ? Number(inputValues[metric.id]) : metric.actualVolume;
              if (!actualVolume) return null;

              return (
                <div key={metric.id} className="p-3 border rounded-lg">
                  <h4 className="text-gray-900 mb-2">{task?.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budgeted Volume:</span>
                      <span className="text-gray-900">{formatNumber(metric.budgetedVolume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actual Volume:</span>
                      <span className="text-gray-900">{formatNumber(actualVolume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budgeted Hours:</span>
                      <span className="text-gray-900">{metric.budgetedHours.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full" size="lg" onClick={handleSubmit}>
            Submit All Entries
          </Button>
          <Button variant="outline" className="w-full" onClick={handleBackToEntry}>
            Back to Edit
          </Button>
        </div>
      </div>
    );
  }

  // Success Screen
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <div className="pt-12 pb-12" style={{ padding: 'var(--spacing-12) var(--spacing-6)' }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Entries Submitted Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Your data has been saved for {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-green-900 mb-2">What happens next:</p>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Data is now visible to your Site Manager</li>
              <li>✓ Performance calculations are updated automatically</li>
              <li>✓ Executive dashboard reflects your contributions</li>
            </ul>
          </div>

          <Button className="w-full" size="lg" onClick={handleComplete}>
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
