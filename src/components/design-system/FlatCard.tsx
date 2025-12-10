import React from 'react';

export interface FlatCardProps {
  className?: string;
  children?: React.ReactNode;
  noPadding?: boolean;
}

export function FlatCard({
  children,
  className = '',
  noPadding = false,
}: FlatCardProps) {
  return (
    <article className={`flat-card ${noPadding ? 'flat-card-no-padding' : ''} ${className}`}>
      {children}
    </article>
  );
}
