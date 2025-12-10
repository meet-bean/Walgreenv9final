import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
  children?: React.ReactNode;
}

export function Alert({ 
  variant = 'default', 
  className = '', 
  children
}: AlertProps) {
  return (
    <div className={`ds-alert ds-alert-${variant} ${className}`}>
      {children}
    </div>
  );
}

export interface AlertTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertTitle({ className = '', children }: AlertTitleProps) {
  return (
    <h5 className={`ds-alert-title ${className}`}>
      {children}
    </h5>
  );
}

export interface AlertDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertDescription({ className = '', children }: AlertDescriptionProps) {
  return (
    <div className={`ds-alert-description ${className}`}>
      {children}
    </div>
  );
}
