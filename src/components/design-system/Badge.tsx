import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ 
  variant = 'default', 
  className = '', 
  children
}: BadgeProps) {
  return (
    <div className={`ds-badge ds-badge-${variant} ${className}`}>
      {children}
    </div>
  );
}
