import React from 'react';

export type SwitchColorVariant = 'gray' | 'light-gray' | 'muted' | 'border' | 'subtle';

export interface SwitchProps {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  variant?: SwitchColorVariant;
}

// Color options for unchecked state
const SWITCH_COLORS: Record<SwitchColorVariant, string> = {
  'gray': '#d1d5db',           // Current - Medium gray (default)
  'light-gray': '#e5e7eb',     // Lighter gray - more subtle
  'muted': '#f3f4f6',          // Very light gray - minimal contrast
  'border': '#9ca3af',         // Darker gray - more prominent
  'subtle': '#f9fafb',         // Nearly white - very minimal
};

export function Switch({ 
  className = '', 
  checked = false,
  disabled = false,
  onCheckedChange,
  onChange,
  name,
  id,
  variant = 'gray'
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Switch handleChange fired:', { checked: e.target.checked, disabled });
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  };

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  const uncheckedColor = SWITCH_COLORS[variant];

  return (
    <div 
      className={`ds-switch-container ${className}`}
      onClick={handleClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div 
        className={`ds-switch-track ${checked ? 'ds-switch-track-checked' : ''} ${disabled ? 'ds-switch-track-disabled' : ''}`}
        style={!checked ? { backgroundColor: uncheckedColor } : undefined}
      >
        <div className={`ds-switch-thumb ${checked ? 'ds-switch-thumb-checked' : ''}`} />
      </div>
    </div>
  );
}
