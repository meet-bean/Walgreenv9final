import { OverviewTileCard } from './design-system/OverviewTileCard';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { getPerformanceColors, getPerformanceLevel, formatPerformance, getPerformanceStatus } from '../lib/performanceUtils';

interface TaskTileProps {
  taskName: string;
  jobFunctionName?: string; // Optional job function context
  actual: number;
  budget: number;
  rate: number;
  actualHours: number;
  budgetedHours: number;
  performance: number;
}

export function TaskTile({ 
  taskName,
  jobFunctionName,
  actual, 
  budget, 
  rate, 
  actualHours, 
  budgetedHours,
  performance 
}: TaskTileProps) {
  const colors = getPerformanceColors(performance);
  const level = getPerformanceLevel(performance);
  const status = getPerformanceStatus(performance);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const PerformanceIcon = () => {
    switch (level) {
      case 'excellent':
      case 'good':
        return <CheckCircle2 style={{ height: '16px', width: '16px' }} />;
      case 'warning':
        return <AlertTriangle style={{ height: '16px', width: '16px' }} />;
      case 'critical':
        return <XCircle style={{ height: '16px', width: '16px' }} />;
    }
  };

  return (
    <OverviewTileCard 
      className="card-content-task"
      style={{ 
        transition: 'all 0.2s', 
        borderLeft: `4px solid ${colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header with performance badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, paddingRight: 'var(--spacing-3)' }}>
          {jobFunctionName && (
            <p 
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-detail)',
                color: 'var(--muted-foreground)',
                marginBottom: 'var(--spacing-1)',
              }}
            >
              {jobFunctionName}
            </p>
          )}
          <h4 
            style={{
              fontFamily: 'var(--font-family-inter)',
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {taskName}
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-family-inter)',
              fontSize: 'var(--text-detail)',
              color: 'var(--muted-foreground)',
            }}
          >
            {status}
          </p>
        </div>
        <div style={{ 
          padding: 'var(--spacing-1-5) var(--spacing-3)', 
          borderRadius: 'var(--radius)', 
          border: '1px solid',
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-2)',
          ...colors.badge 
        }}>
          <span style={{ ...colors.icon }}>
            <PerformanceIcon />
          </span>
          <span style={{ fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-family-inter)' }}>
            {formatPerformance(performance)}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', padding: 'var(--spacing-3)', border: '1px solid var(--muted)' }}>
          <span style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'var(--muted-foreground)', 
            display: 'block', 
            marginBottom: 'var(--spacing-1)',
            fontFamily: 'var(--font-family-inter)'
          }}>
            Actual
          </span>
          <span style={{ 
            color: 'var(--foreground)', 
            fontWeight: 'var(--font-weight-semibold)',
            fontFamily: 'var(--font-family-inter)'
          }}>
            {formatNumber(actual)}
          </span>
        </div>
        <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--radius)', padding: 'var(--spacing-3)', border: '1px solid var(--muted)' }}>
          <span style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'var(--muted-foreground)', 
            display: 'block', 
            marginBottom: 'var(--spacing-1)',
            fontFamily: 'var(--font-family-inter)'
          }}>
            Budget
          </span>
          <span style={{ 
            color: 'var(--foreground)', 
            fontWeight: 'var(--font-weight-semibold)',
            fontFamily: 'var(--font-family-inter)'
          }}>
            {formatNumber(budget)}
          </span>
        </div>
      </div>

      {/* Additional Details */}
      <div style={{ 
        fontSize: 'var(--text-xs)', 
        color: 'var(--muted-foreground)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-1)', 
        paddingTop: 'var(--spacing-3)', 
        borderTop: '1px solid var(--muted)',
        fontFamily: 'var(--font-family-inter)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Rate:</span>
          <span style={{ color: 'var(--foreground)' }}>{rate.toFixed(5)} hrs/unit</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Hours:</span>
          <span style={{ color: 'var(--foreground)' }}>{actualHours.toFixed(1)} / {budgetedHours.toFixed(1)}</span>
        </div>
      </div>
    </OverviewTileCard>
  );
}