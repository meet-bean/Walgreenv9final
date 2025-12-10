import React from 'react';

export interface OverviewTileCardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
}

export function OverviewTileCard({
  children,
  className = '',
  style,
  onMouseEnter,
  onMouseLeave,
}: OverviewTileCardProps) {
  // Normalize style to avoid mixing shorthand border with borderColor
  const normalizedStyle = style ? { ...style } : {};
  
  // If borderColor is set but border is not, we need to set border properties explicitly
  if (normalizedStyle.borderColor && !normalizedStyle.border) {
    normalizedStyle.borderWidth = normalizedStyle.borderWidth || '1px';
    normalizedStyle.borderStyle = normalizedStyle.borderStyle || 'solid';
  }
  
  return (
    <article 
      className={`card ${className}`} 
      style={normalizedStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </article>
  );
}
