import React from 'react';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ 
  orientation = 'horizontal', 
  className = ''
}: SeparatorProps) {
  return (
    <div className={`ds-separator ds-separator-${orientation} ${className}`} />
  );
}
