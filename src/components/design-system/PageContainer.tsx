import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function PageContainer({ children, style }: PageContainerProps) {
  return (
    <div className="ds-flex-col ds-gap-6 ds-p-6" style={style}>
      {children}
    </div>
  );
}