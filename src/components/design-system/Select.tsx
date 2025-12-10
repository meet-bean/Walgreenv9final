import React from 'react';

// Simple native select (for basic usage)
export interface SelectProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void; // Added for composite pattern compatibility
  name?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg'; // Size variant
}

export function Select({ 
  className = '', 
  disabled = false, 
  children, 
  value,
  defaultValue,
  onChange,
  onValueChange,
  name,
  id,
  size = 'md'
}: SelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  // Check if this is being used with composite pattern (has SelectTrigger children)
  const hasCompositChildren = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === SelectTrigger
  );

  if (hasCompositChildren) {
    // Use composite pattern - prefer onValueChange, fallback to onChange
    const handleValueChange = onValueChange || (onChange ? (val: string) => {
      onChange({ target: { value: val } } as React.ChangeEvent<HTMLSelectElement>);
    } : undefined);
    return <CompositeSelect value={value} onValueChange={handleValueChange} disabled={disabled} size={size}>{children}</CompositeSelect>;
  }

  // Use simple native select
  return (
    <select
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`ds-select ds-select-${size} ${isFocused ? 'ds-select-focused' : ''} ${disabled ? 'ds-select-disabled' : ''} ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      name={name}
      id={id}
    >
      {children}
    </select>
  );
}

// Composite Select components (for compatibility with ShadCN pattern)
interface CompositeSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function CompositeSelect({ value, onValueChange, disabled, children, size = 'md' }: CompositeSelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  // Extract options and placeholder from children
  const options: React.ReactNode[] = [];
  let placeholder = 'Select...';
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SelectTrigger) {
      // Try to extract placeholder from SelectValue
      React.Children.forEach(child.props.children, (triggerChild) => {
        if (React.isValidElement(triggerChild) && triggerChild.type === SelectValue) {
          placeholder = triggerChild.props.placeholder || placeholder;
        }
      });
    }
    
    if (React.isValidElement(child) && child.type === SelectContent) {
      // Process children of SelectContent, handling both direct children and function results
      const contentChildren = typeof child.props.children === 'function' 
        ? child.props.children() 
        : child.props.children;
      
      // Recursively flatten and extract SelectItems
      const flattenSelectItems = (children: any): void => {
        if (Array.isArray(children)) {
          children.forEach(flattenSelectItems);
        } else if (React.isValidElement(children) && children.type === SelectItem) {
          options.push(children);
        } else {
          React.Children.forEach(children, flattenSelectItems);
        }
      };
      
      flattenSelectItems(contentChildren);
    }
  });

  return (
    <select
      value={value}
      onChange={(e) => {
        console.log('[Select] Value changed from', value, 'to', e.target.value);
        onValueChange?.(e.target.value);
      }}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`ds-select ds-select-sm ${isFocused ? 'ds-select-focused' : ''} ${disabled ? 'ds-select-disabled' : ''}`}
      style={{ alignSelf: 'flex-end' }}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options}
    </select>
  );
}

// SelectTrigger wraps the select content
interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  // This is just a container for SelectContent, rendering is handled by parent
  return <>{children}</>;
}

// SelectValue is a placeholder (not needed for native select, but kept for API compatibility)
export function SelectValue({ placeholder }: { placeholder?: string }) {
  return null;
}

// SelectContent wraps the options
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children }: SelectContentProps) {
  // This is just a container for SelectItems, rendering is handled by parent
  return <>{children}</>;
}

// SelectItem wraps individual option elements
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SelectItem({ value, children, disabled }: SelectItemProps) {
  // Extract text content from children (native option can't have complex elements)
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }
    if (React.isValidElement(node)) {
      return getTextContent(node.props.children);
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join('');
    }
    return '';
  };
  
  return (
    <option value={value} disabled={disabled}>
      {getTextContent(children)}
    </option>
  );
}