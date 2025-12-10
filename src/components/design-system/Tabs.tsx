import React, { createContext, useContext, useState } from 'react';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Tabs({ 
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  className = '', 
  children,
  style
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`ds-tabs ${className}`} style={style}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TabsList({ className = '', children, style }: TabsListProps) {
  return (
    <div className={`ds-tabs-list ${className}`} style={style}>
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function TabsTrigger({ 
  value, 
  className = '', 
  children,
  disabled = false,
  style
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      disabled={disabled}
      className={`ds-tabs-trigger ${isActive ? 'active' : ''} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TabsContent({ 
  value, 
  className = '', 
  children,
  style
}: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  if (context.value !== value) {
    return null;
  }

  return (
    <div className={`ds-tabs-content ${className}`} style={style}>
      {children}
    </div>
  );
}
