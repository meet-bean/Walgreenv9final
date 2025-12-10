import React, { createContext, useContext, useEffect } from 'react';
import { X } from 'lucide-react';

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ 
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children 
}: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export interface SheetTriggerProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function SheetTrigger({ children, onClick, className = '' }: SheetTriggerProps) {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('SheetTrigger must be used within Sheet');
  }

  return (
    <button
      className={`ds-sheet-trigger ${className}`}
      onClick={(e) => {
        onClick?.(e);
        context.onOpenChange(true);
      }}
    >
      {children}
    </button>
  );
}

export interface SheetContentProps {
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  side?: 'left' | 'right';
}

export function SheetContent({ 
  className = '', 
  children,
  onClose,
  side = 'right'
}: SheetContentProps) {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('SheetContent must be used within Sheet');
  }

  useEffect(() => {
    if (context.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [context.open]);

  if (!context.open) {
    return null;
  }

  const handleClose = () => {
    context.onOpenChange(false);
    onClose?.();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="ds-sheet-backdrop" onClick={handleClose} />
      
      {/* Sheet */}
      <div className={`ds-sheet-content ds-sheet-${side} ${className}`}>
        {children}
        
        {/* Close Button */}
        <button onClick={handleClose} className="ds-sheet-close">
          <X size={16} />
        </button>
      </div>
    </>
  );
}

export interface SheetHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function SheetHeader({ className = '', children }: SheetHeaderProps) {
  return (
    <div className={`ds-sheet-header ${className}`}>
      {children}
    </div>
  );
}

export interface SheetTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export function SheetTitle({ className = '', children }: SheetTitleProps) {
  return (
    <h2 className={`ds-sheet-title ${className}`}>
      {children}
    </h2>
  );
}

export interface SheetDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export function SheetDescription({ className = '', children }: SheetDescriptionProps) {
  return (
    <p className={`ds-sheet-description ${className}`}>
      {children}
    </p>
  );
}

export interface SheetFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function SheetFooter({ className = '', children }: SheetFooterProps) {
  return (
    <div className={`ds-sheet-footer ${className}`}>
      {children}
    </div>
  );
}
