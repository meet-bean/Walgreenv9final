import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: React.ReactNode;
  leadingActions?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  metadata,
  actions,
  leadingActions,
  children,
}: PageHeaderProps) {
  return (
    <div className="ds-flex ds-items-start ds-justify-between ds-gap-4">
      {leadingActions && (
        <div className="ds-flex ds-gap-2 ds-items-start">
          {leadingActions}
        </div>
      )}
      <div className="ds-flex-1">
        <h2 className="heading-page">{title}</h2>
        {subtitle && (
          <h5 className="heading-subtitle text-muted" style={{ marginTop: 'var(--spacing-2)' }}>
            {subtitle}
          </h5>
        )}
        {description && (
          <h5 className="heading-subtitle text-muted" style={{ marginTop: 'var(--spacing-2)' }}>
            {description}
          </h5>
        )}
        {metadata && (
          <div style={{ marginTop: 'var(--spacing-2)' }}>
            {metadata}
          </div>
        )}
      </div>
      {(actions || children) && (
        <div className="ds-flex ds-gap-2">
          {actions || children}
        </div>
      )}
    </div>
  );
}