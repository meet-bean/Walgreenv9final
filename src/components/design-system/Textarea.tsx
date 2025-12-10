import React from 'react';

export interface TextareaProps {
  className?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  name?: string;
  id?: string;
}

export function Textarea({ 
  className = '', 
  disabled = false, 
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  rows,
  name,
  id
}: TextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <textarea
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`ds-textarea ${isFocused ? 'ds-textarea-focused' : ''} ${disabled ? 'ds-textarea-disabled' : ''} ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      rows={rows}
      name={name}
      id={id}
    />
  );
}
