import React from 'react';
import { Button } from './design-system/Button';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

export function SidebarHeader({ title, description, onClose }: SidebarHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-6)' }}>
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-1)' }}>{title}</h3>
        {description && (
          <p className="section-editor-description">
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          style={{ height: '32px', width: '32px', padding: 0 }}
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}
