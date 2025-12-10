import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
}

export function Checkbox({ 
  className = '', 
  checked,
  disabled = false,
  onCheckedChange,
  onChange,
  name,
  id
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  };

  return (
    <div className={`ds-checkbox-wrapper ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="ds-checkbox-input"
        name={name}
        id={id}
      />
      <div className={`ds-checkbox-box ${checked ? 'ds-checkbox-checked' : ''} ${disabled ? 'ds-checkbox-disabled' : ''}`}>
        {checked && (
          <Check size={14} className="ds-checkbox-icon" />
        )}
      </div>
    </div>
  );
}
