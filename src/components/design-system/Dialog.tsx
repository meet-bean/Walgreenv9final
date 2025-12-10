import React, { createContext, useContext, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ 
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children 
}: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  asChild?: boolean;
}

export function DialogTrigger({ children, onClick, className = '', asChild = false }: DialogTriggerProps) {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('DialogTrigger must be used within Dialog');
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context.onOpenChange(true);
  };

  // If asChild is true, clone the child element and add the onClick handler
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick
    });
  }

  return (
    <button
      className={`ds-dialog-trigger ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export interface DialogContentProps {
  className?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export function DialogContent({ 
  className = '', 
  children,
  onClose
}: DialogContentProps) {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('DialogContent must be used within Dialog');
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
      <div className="ds-dialog-backdrop" onClick={handleClose} />
      
      {/* Dialog */}
      <div className={`ds-dialog-content ${className}`} onClick={(e) => e.stopPropagation()}>
        {children}
        
        {/* Close Button */}
        <button onClick={handleClose} className="ds-dialog-close">
          <X size={16} />
        </button>
      </div>
    </>
  );
}

export interface DialogHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function DialogHeader({ className = '', children }: DialogHeaderProps) {
  return (
    <div className={`ds-dialog-header ${className}`}>
      {children}
    </div>
  );
}

export interface DialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export function DialogTitle({ className = '', children }: DialogTitleProps) {
  return (
    <h2 className={`ds-dialog-title ${className}`}>
      {children}
    </h2>
  );
}

export interface DialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export function DialogDescription({ className = '', children }: DialogDescriptionProps) {
  return (
    <p className={`ds-dialog-description ${className}`}>
      {children}
    </p>
  );
}

export interface DialogFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function DialogFooter({ className = '', children }: DialogFooterProps) {
  return (
    <div className={`ds-dialog-footer ${className}`}>
      {children}
    </div>
  );
}
