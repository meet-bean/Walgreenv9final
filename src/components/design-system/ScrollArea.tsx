import React from 'react';

export interface ScrollAreaProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function ScrollArea({ className = '', children, style }: ScrollAreaProps) {
  return (
    <div className={`ds-scroll-area ${className}`} style={style}>
      {children}
    </div>
  );
}
