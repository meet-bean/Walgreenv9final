import React, { createContext, useContext, useEffect } from 'react';

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue | undefined>(undefined);

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({ 
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children 
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export interface AlertDialogTriggerProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function AlertDialogTrigger({ children, onClick, className = '' }: AlertDialogTriggerProps) {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialogTrigger must be used within AlertDialog');
  }

  return (
    <button
      className={`ds-alert-dialog-trigger ${className}`}
      onClick={(e) => {
        onClick?.(e);
        context.onOpenChange(true);
      }}
    >
      {children}
    </button>
  );
}

export interface AlertDialogContentProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertDialogContent({ 
  className = '', 
  children
}: AlertDialogContentProps) {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialogContent must be used within AlertDialog');
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

  return (
    <>
      {/* Backdrop */}
      <div className="ds-alert-dialog-backdrop" />
      
      {/* Alert Dialog */}
      <div className={`ds-alert-dialog-content ${className}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </>
  );
}

export interface AlertDialogHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertDialogHeader({ className = '', children }: AlertDialogHeaderProps) {
  return (
    <div className={`ds-alert-dialog-header ${className}`}>
      {children}
    </div>
  );
}

export interface AlertDialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertDialogTitle({ className = '', children }: AlertDialogTitleProps) {
  return (
    <h2 className={`ds-alert-dialog-title ${className}`}>
      {children}
    </h2>
  );
}

export interface AlertDialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertDialogDescription({ className = '', children }: AlertDialogDescriptionProps) {
  return (
    <p className={`ds-alert-dialog-description ${className}`}>
      {children}
    </p>
  );
}

export interface AlertDialogFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function AlertDialogFooter({ className = '', children }: AlertDialogFooterProps) {
  return (
    <div className={`ds-alert-dialog-footer ${className}`}>
      {children}
    </div>
  );
}

export interface AlertDialogActionProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

export function AlertDialogAction({ children, onClick, className = '', disabled = false }: AlertDialogActionProps) {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialogAction must be used within AlertDialog');
  }

  return (
    <button
      className={`ds-alert-dialog-action ${className}`}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        context.onOpenChange(false);
      }}
    >
      {children}
    </button>
  );
}

export interface AlertDialogCancelProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

export function AlertDialogCancel({ children, onClick, className = '', disabled = false }: AlertDialogCancelProps) {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialogCancel must be used within AlertDialog');
  }

  return (
    <button
      className={`ds-alert-dialog-cancel ${className}`}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        context.onOpenChange(false);
      }}
    >
      {children}
    </button>
  );
}
