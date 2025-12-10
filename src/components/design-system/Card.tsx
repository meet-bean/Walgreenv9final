import React from 'react';
import { SettingsSection } from '../SettingsSection';

export interface CardProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  noPadding?: boolean;
}

export function Card({
  children,
  className = '',
  noPadding = false,
}: CardProps) {
  return (
    <article className={`card ${noPadding ? 'card-no-padding' : ''} ${className}`}>
      {children}
    </article>
  );
}

export interface CardTitleProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardTitle({ className = '', children, style }: CardTitleProps) {
  return (
    <h3 className={`ds-card-title ${className}`} style={style}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardDescription({ className = '', children, style }: CardDescriptionProps) {
  return (
    <p className={`ds-card-description ${className}`} style={style}>
      {children}
    </p>
  );
}

export interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardFooter({ className = '', children, style }: CardFooterProps) {
  return (
    <div className={`ds-card-footer ${className}`} style={style}>
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardHeader({ className = '', children, style }: CardHeaderProps) {
  return (
    <div className={`ds-card-header ${className}`} style={style}>
      {children}
    </div>
  );
}

export interface CardContentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardContent({ className = '', children, style }: CardContentProps) {
  return (
    <>
      {children}
    </>
  );
}