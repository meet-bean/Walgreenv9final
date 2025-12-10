import React, { useState, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface SlideOutProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  resizable?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function SlideOut({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  resizable = false,
  defaultWidth = 520,
  minWidth = 400,
  maxWidth = 800,
}: SlideOutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  // Reset width when closed
  useEffect(() => {
    if (!open) {
      setSidebarWidth(defaultWidth);
    }
  }, [open, defaultWidth]);

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!resizable) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resizable, minWidth, maxWidth]);

  if (!open) return null;

  return (
    <div className="component-editor-overlay" style={{ width: `${sidebarWidth}px` }}>
      {/* Resize Handle */}
      {resizable && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            cursor: 'ew-resize',
            zIndex: 10,
            pointerEvents: 'all',
            background: isResizing ? 'var(--primary)' : 'transparent',
            transition: isResizing ? 'none' : 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'var(--border)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        />
      )}

      <div className="component-editor-container">
        {/* Header */}
        <div className="component-editor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flex: 1, minWidth: 0 }}>
            {icon && (
              <div className="icon-badge" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                {icon}
              </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 className="editor-title" style={{ fontSize: '16px' }}>
                {title}
              </h2>
              {description && (
                <p className="editor-subtitle" style={{ fontSize: '12px' }}>
                  {description}
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} style={{ flexShrink: 0 }}>
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-6)',
          }}
        >
          {children}
        </div>

        {/* Footer (optional) */}
        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-4)',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--muted)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
