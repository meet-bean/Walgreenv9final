import React from 'react';
import { Card } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { LineChart, BarChart3, AreaChart, PieChart, TrendingUp } from 'lucide-react';

interface ChartType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface ChartTypePickerProps {
  onSelect?: (chartTypeId: string) => void;
  onSelectChartType?: (chartTypeId: string) => void;
  onClose?: () => void;
}

const CHART_TYPES: ChartType[] = [
  {
    id: 'line-chart',
    label: 'Line Chart',
    icon: <LineChart style={{ height: '48px', width: '48px' }} />,
    description: 'Visualize trends over time',
  },
  {
    id: 'bar-chart',
    label: 'Bar Chart',
    icon: <BarChart3 style={{ height: '48px', width: '48px' }} />,
    description: 'Compare values across categories',
  },
  {
    id: 'area-chart',
    label: 'Area Chart',
    icon: <AreaChart style={{ height: '48px', width: '48px' }} />,
    description: 'Show cumulative values',
  },
  {
    id: 'pie-chart',
    label: 'Pie Chart',
    icon: <PieChart style={{ height: '48px', width: '48px' }} />,
    description: 'Display proportions',
  },
  {
    id: 'combo-chart',
    label: 'Combo Chart',
    icon: <TrendingUp style={{ height: '48px', width: '48px' }} />,
    description: 'Mix line and bar charts',
  },
];

export function ChartTypePicker({ onSelect, onSelectChartType, onClose }: ChartTypePickerProps) {
  const handleSelect = (chartTypeId: string) => {
    // Support both prop names for backward compatibility
    if (onSelect) {
      onSelect(chartTypeId);
    }
    if (onSelectChartType) {
      onSelectChartType(chartTypeId);
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <h3 className="chart-picker-title">
          Select Chart Type
        </h3>
        <p className="chart-picker-description">
          Choose a visualization type for your chart
        </p>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4)' 
      }}>
        {CHART_TYPES.map((chartType) => (
          <Card
            key={chartType.id}
            className="card-content-centered"
            style={{ 
              borderColor: 'var(--border)', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => handleSelect(chartType.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: 'var(--spacing-3)', 
              color: 'var(--primary)' 
            }}>
              {chartType.icon}
            </div>
            <h4 className="chart-type-option-title">
              {chartType.label}
            </h4>
            <p className="chart-type-option-description">
              {chartType.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
