import React from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SettingsSection({ title, description, children, className = '', style }: SettingsSectionProps) {
  return (
    <div className={`settings-section ${className}`} style={style}>
      <h3 className="section-title">{title}</h3>
      {description && (
        <p className="section-description">{description}</p>
      )}
      {children}
    </div>
  );
}