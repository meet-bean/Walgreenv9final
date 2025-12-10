import React from 'react';

export interface LabelProps {
  className?: string;
  children?: React.ReactNode;
  htmlFor?: string;
}

export function Label({ className = '', children, htmlFor }: LabelProps) {
  return (
    <label className={`ds-label ${className}`} htmlFor={htmlFor} style={{ marginBottom: 'var(--spacing-2)' }}>
      {children}
    </label>
  );
}