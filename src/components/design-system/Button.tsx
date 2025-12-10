import React from 'react';

export interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  children, 
  disabled = false,
  type = 'button',
  onClick,
  onMouseEnter,
  onMouseLeave,
  style
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ds-button ds-button-${variant} ds-button-${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </button>
  );
}