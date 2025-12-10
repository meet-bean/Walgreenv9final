import React, { createContext, useContext, useEffect, useRef } from 'react';

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | undefined>(undefined);

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({ 
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children 
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className="ds-popover-wrapper">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  asChild?: boolean;
}

export function PopoverTrigger({ children, onClick, className = '', asChild = false }: PopoverTriggerProps) {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('PopoverTrigger must be used within Popover');
  }

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    context.onOpenChange(!context.open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      className,
    } as any);
  }

  return (
    <button onClick={handleClick} className={`ds-popover-trigger ${className}`}>
      {children}
    </button>
  );
}

export interface PopoverContentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children?: React.ReactNode;
}

export function PopoverContent({ 
  align = 'center',
  side = 'bottom',
  className = '', 
  children
}: PopoverContentProps) {
  const context = useContext(PopoverContext);
  const ref = useRef<HTMLDivElement>(null);

  if (!context) {
    throw new Error('PopoverContent must be used within Popover');
  }

  useEffect(() => {
    if (!context.open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [context]);

  if (!context.open) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`ds-popover-content ds-popover-${side} ds-popover-align-${align} ${className}`}
    >
      {children}
    </div>
  );
}
