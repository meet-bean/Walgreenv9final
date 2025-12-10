import React from 'react';

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export function Progress({ 
  value = 0, 
  max = 100, 
  className = ''
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`ds-progress ${className}`}>
      <div className="ds-progress-indicator" style={{ width: `${percentage}%` }} />
    </div>
  );
}
