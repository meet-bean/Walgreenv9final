import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Global toast state
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastsState: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toastsState]));
}

function addToast(message: string, type: Toast['type'] = 'default', duration = 5000) {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: Toast = { id, message, type, duration };
  toastsState = [...toastsState, toast];
  notifyListeners();
  
  if (duration) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
}

function removeToast(id: string) {
  toastsState = toastsState.filter(toast => toast.id !== id);
  notifyListeners();
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };
    
    toastListeners.push(listener);
    setToasts([...toastsState]);
    
    // Listen for custom toast events
    const handleToastEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { message, type } = customEvent.detail;
      addToast(message, type);
    };
    
    window.addEventListener('toast', handleToastEvent);
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
      window.removeEventListener('toast', handleToastEvent);
    };
  }, []);

  return (
    <div className="ds-toaster">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className={`ds-toast ds-toast-${toast.type || 'default'}`}>
      <p className="ds-toast-message">{toast.message}</p>
      <button onClick={onClose} className="ds-toast-close">
        <X className="ds-toast-icon" />
      </button>
    </div>
  );
}

// Toast API for programmatic usage
export const toast = {
  success: (message: string) => {
    addToast(message, 'success');
  },
  error: (message: string) => {
    addToast(message, 'error');
  },
  warning: (message: string) => {
    addToast(message, 'warning');
  },
  info: (message: string) => {
    addToast(message, 'info');
  },
  message: (message: string) => {
    addToast(message, 'default');
  },
};
