import React from 'react';

export interface SkeletonProps {
  className?: string;
  /**
   * Inline styles for dimension control (height, width, borderRadius, margin)
   * Only use for skeleton-specific dimensions that vary per instance
   */
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={`ds-skeleton ${className}`} style={style} />
  );
}
