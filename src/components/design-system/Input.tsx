import React from 'react';

export interface InputProps {
  className?: string;
  type?: string;
  disabled?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
}

export function Input({ 
  className = '', 
  type = 'text', 
  disabled = false, 
  value, 
  defaultValue, 
  readOnly = false, 
  onChange, 
  onFocus,
  onBlur,
  placeholder,
  name,
  id,
  min,
  max,
  step,
  accept
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  
  // Determine if this is a controlled or uncontrolled input
  const isControlled = value !== undefined;
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  return (
    <input
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      {...(isControlled ? { value, onChange: onChange || (() => {}) } : { defaultValue })}
      className={`ds-input ${isFocused ? 'ds-input-focused' : ''} ${disabled ? 'ds-input-disabled' : ''} ${className}`}
      style={{ paddingTop: '3px' }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      name={name}
      id={id}
      min={min}
      max={max}
      step={step}
      accept={accept}
    />
  );
}
