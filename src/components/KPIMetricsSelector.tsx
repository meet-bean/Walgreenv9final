import React, { useState } from 'react';
import { Checkbox } from './design-system/Checkbox';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Plus } from 'lucide-react';
import { getAllFieldsWithCustom } from '../lib/unifiedFieldSchema';
import { CreateMetricSidebar } from './CreateMetricSidebar';

interface KPIMetricsSelectorProps {
  sectionId: string;
  currentMetrics: string[];
  onApply: (selectedMetrics: string[]) => void;
}

// Get available KPI metrics from the unified field schema
// Only show fields that are suitable for KPI display (performance metrics + key business metrics)
function getAvailableKPIMetrics() {
  const allFields = getAllFieldsWithCustom();
  
  // Filter for fields that make sense as KPIs
  // Include: budget, forecast, actual, performance, and custom categories
  // Exclude: identifiers and date/text formats
  const kpiFields = allFields.filter(field => {
    // Exclude identifier fields (date, siteId, jobFunctionId, taskId)
    if (field.category === 'identifiers') {
      return false;
    }
    
    // Exclude text fields
    if (field.format === 'text' || field.format === 'date') {
      return false;
    }
    
    // Include all numeric fields from these categories
    return (
      field.category === 'budget' ||
      field.category === 'forecast' ||
      field.category === 'actual' ||
      field.category === 'performance' ||
      field.category === 'custom'
    );
  });
  
  // Map to the format expected by the selector
  return kpiFields.map(field => ({
    id: field.field,
    label: field.displayName,
    isCustom: !field.isCore,
    format: field.format,
  }));
}

export function KPIMetricsSelector({ sectionId, currentMetrics, onApply }: KPIMetricsSelectorProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(currentMetrics);
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);
  
  // Get available metrics from settings
  const AVAILABLE_KPI_METRICS = getAvailableKPIMetrics();

  const toggleMetric = (metricId: string) => {
    let newMetrics: string[];
    if (selectedMetrics.includes(metricId)) {
      newMetrics = selectedMetrics.filter(m => m !== metricId);
    } else {
      newMetrics = [...selectedMetrics, metricId];
    }
    setSelectedMetrics(newMetrics);
    // Live feedback - apply immediately
    onApply(newMetrics);
  };

  const handleMetricCreated = (fieldId: string) => {
    // Auto-select the new metric
    const newMetrics = [...selectedMetrics, fieldId];
    setSelectedMetrics(newMetrics);
    onApply(newMetrics);
  };

  return (
    <>
      <div>
        {/* Header */}
        <div 
          style={{ 
            padding: 'var(--spacing-2)',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-muted)',
          }}
        >
          <h4 style={{ 
            fontFamily: 'var(--font-family-inter)',
            fontSize: 'var(--text-detail)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-foreground)',
            marginBottom: 'var(--spacing-0-5)',
          }}>
            Configure KPI Metrics
          </h4>
          <p style={{ 
            fontFamily: 'var(--font-family-inter)',
            fontSize: '10px',
            color: 'var(--color-muted-foreground)',
          }}>
            Select metrics to display or create new ones
          </p>
        </div>

        {/* Metrics List */}
        <div style={{ 
          padding: 'var(--spacing-2)', 
          maxHeight: '280px', 
          overflowY: 'auto' 
        }}>
          {AVAILABLE_KPI_METRICS.map((metric) => {
            const isSelected = selectedMetrics.includes(metric.id);
            return (
              <div
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-1-5)',
                  marginBottom: 'var(--spacing-0-5)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const newMetrics = [...selectedMetrics, metric.id];
                      setSelectedMetrics(newMetrics);
                      onApply(newMetrics);
                    } else {
                      const newMetrics = selectedMetrics.filter(m => m !== metric.id);
                      setSelectedMetrics(newMetrics);
                      onApply(newMetrics);
                    }
                  }}
                />
                <span style={{
                  fontFamily: 'var(--font-family-inter)',
                  fontSize: '11px',
                  color: 'var(--color-foreground)',
                  flex: 1,
                }}>
                  {metric.label}
                </span>
                {metric.isCustom && (
                  <Badge
                    variant="secondary"
                    style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                    }}
                  >
                    Custom
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div 
          style={{ 
            padding: 'var(--spacing-2)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => setIsCreateSidebarOpen(true)}
            variant="ghost"
            size="sm"
            style={{
              fontSize: '10px',
            }}
          >
            <Plus size={12} style={{ marginRight: 'var(--spacing-1)' }} />
            New Metric
          </Button>
          
          <span style={{
            fontFamily: 'var(--font-family-inter)',
            fontSize: '11px',
            color: 'var(--color-muted-foreground)',
            marginLeft: 'auto',
          }}>
            {selectedMetrics.length} selected
          </span>
        </div>
      </div>

      {/* Create Metric Sidebar */}
      <CreateMetricSidebar
        isOpen={isCreateSidebarOpen}
        onClose={() => setIsCreateSidebarOpen(false)}
        onMetricCreated={handleMetricCreated}
      />
    </>
  );
}