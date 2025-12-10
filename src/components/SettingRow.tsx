import React from 'react';
import { Label } from './design-system/Label';

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="setting-row">
      <div>
        <Label>{label}</Label>
        {description && (
          <p className="setting-description">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
