import React from 'react';
import { Badge } from './design-system/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Button } from './design-system/Button';
import { ChevronRight } from 'lucide-react';

interface MetricOption {
  value: string;
  label: string;
}

interface ChartHeaderProps {
  title: string;
  description?: string;
  currentLevel?: string;
  drillDownHint?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  metricValue?: string;
  onMetricChange?: (value: string) => void;
  metricOptions?: MetricOption[];
}

export function ChartHeader({
  title,
  description,
  currentLevel,
  drillDownHint,
  showBackButton = false,
  onBack,
  metricValue,
  onMetricChange,
  metricOptions,
}: ChartHeaderProps) {
  return (
    <div style={{ paddingBottom: 'var(--spacing-4)' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="ds-card-title">{title}</h3>
          {description && <p className="ds-card-description">{description}</p>}
        </div>
        {/* Metric Selector */}
        {metricOptions && metricValue && onMetricChange && (
          <div className="min-w-[180px] ml-[var(--spacing-4)]">
            <Select value={metricValue} onValueChange={onMetricChange}>
              <SelectTrigger className="select-inter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content-inter">
                {metricOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      {drillDownHint && (
        <p className="text-[length:var(--text-label)] text-[var(--color-muted-foreground)] mt-[var(--spacing-2)] font-[family-name:var(--font-family-inter)] w-full">
          {drillDownHint}
        </p>
      )}
      {(showBackButton || currentLevel) && (
        <div className="flex items-center gap-[var(--spacing-2)] mt-[var(--spacing-3)]">
          {showBackButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
            >
              <ChevronRight size={16} className="rotate-180" />
              Back
            </Button>
          )}
          {currentLevel && (
            <Badge variant="outline" className="badge-info">
              {currentLevel}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}