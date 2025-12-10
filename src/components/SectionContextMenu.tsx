/**
 * SectionContextMenu - Context menu for dashboard sections in the preview
 * 
 * Features:
 * - Appears on right-click or via three-dot menu button on hover
 * - Shows different options based on source tab (Design vs Test)
 * - Configure option only available for Test tab sections
 * - Auto-positions to prevent going off-screen
 * - Uses design system CSS variables for consistent styling
 * 
 * Usage:
 * Wrap section content with this component and provide action handlers.
 */

import React, { useState } from 'react';
import { Settings, Database, Trash2, Copy, BookmarkPlus, Maximize2, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Checkbox } from './design-system/Checkbox';

interface SectionContextMenuProps {
  sectionId: string;
  sectionTitle: string;
  sourceTab: 'design' | 'test';
  isConfigured: boolean;
  sectionType?: string; // NEW: Section type to show type-specific controls
  kpiCards?: Array<{ id: string; systemMetric: string; label: string }>; // NEW: Current KPI cards config
  onConfigure: (sectionId: string) => void;
  onEditDataSource: (sectionId: string) => void;
  onRemove: (sectionId: string) => void;
  onSaveToLibrary?: (sectionId: string) => void;
  onDuplicate?: (sectionId: string) => void;
  onCycleSize?: (sectionId: string) => void;
  onCycleHeight?: (sectionId: string) => void;
  onConfigureKPICards?: (sectionId: string, selectedMetrics: string[]) => void; // NEW: KPI cards configurator
  children: React.ReactNode;
}

// Available KPI metrics
const AVAILABLE_KPI_METRICS = [
  { id: 'avg-performance', label: 'Total Performance' },
  { id: 'total-hours', label: 'Total Hours' },
  { id: 'active-staff', label: 'Active Staff' },
  { id: 'efficiency-rate', label: 'Efficiency Rate' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'cost-savings', label: 'Cost Savings' },
  { id: 'completion-rate', label: 'Completion Rate' },
  { id: 'quality-score', label: 'Quality Score' },
  { id: 'tasks-completed', label: 'Tasks Completed' },
];

export function SectionContextMenu({
  sectionId,
  sectionTitle,
  sourceTab,
  isConfigured,
  sectionType,
  kpiCards = [],
  onConfigure,
  onEditDataSource,
  onRemove,
  onSaveToLibrary,
  onDuplicate,
  onCycleSize,
  onCycleHeight,
  onConfigureKPICards,
  children,
}: SectionContextMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showKPIPopover, setShowKPIPopover] = useState(false);
  const [kpiPopoverPosition, setKpiPopoverPosition] = useState({ x: 0, y: 0 });

  // Get currently selected metrics from kpiCards
  const selectedMetrics = kpiCards.map(card => card.systemMetric);
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState<string[]>(selectedMetrics);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate position and ensure menu doesn't go off-screen
    const menuWidth = 200;
    const menuHeight = 300; // approximate height
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX;
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY;
    
    setMenuPosition({ x, y });
    setShowMenu(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Close menu when clicking outside
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  // Close menu when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMenu(false);
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  return (
    <div 
      className="relative w-full h-full group"
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      
      {/* Size control buttons - top left */}
      {isHovering && !showMenu && (onCycleHeight || onCycleSize || (sectionType === 'kpi-cards' && onConfigureKPICards)) && (
        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex" style={{ gap: 'var(--spacing-2)' }}>
          {/* KPI Cards Configure button - ONLY for kpi-cards sections */}
          {sectionType === 'kpi-cards' && onConfigureKPICards && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const buttonRect = e.currentTarget.getBoundingClientRect();
                const popoverWidth = 280;
                const popoverHeight = 400;
                // Position below and to the right of the button
                const x = Math.min(buttonRect.right + 8, window.innerWidth - popoverWidth - 20);
                const y = Math.min(buttonRect.top, window.innerHeight - popoverHeight - 20);
                setKpiPopoverPosition({ x, y });
                setTempSelectedMetrics(selectedMetrics);
                setShowKPIPopover(!showKPIPopover);
              }}
              className="rounded-md p-2 hover:scale-110 transition-all duration-200"
              style={{
                backgroundColor: showKPIPopover ? 'var(--accent)' : 'var(--popover)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--elevation-sm)',
                color: 'var(--color-chart-3)',
              }}
              onMouseEnter={(e) => {
                if (!showKPIPopover) {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showKPIPopover) {
                  e.currentTarget.style.backgroundColor = 'var(--popover)';
                }
              }}
              title="Configure KPI metrics"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          )}
          
          {/* Height button */}
          {onCycleHeight && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCycleHeight(sectionId);
              }}
              className="rounded-md p-2 hover:scale-110 transition-all duration-200"
              style={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--elevation-sm)',
                color: 'var(--color-chart-1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--popover)';
              }}
              title="Adjust section height (Small → Medium → Large → XL)"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          )}
          
          {/* Width button */}
          {onCycleSize && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCycleSize(sectionId);
              }}
              className="rounded-md p-2 hover:scale-110 transition-all duration-200"
              style={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--elevation-sm)',
                color: 'var(--color-chart-1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--popover)';
              }}
              title="Cycle section width (click to resize)"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Action buttons - top right */}
      {isHovering && !showMenu && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex" style={{ gap: 'var(--spacing-2)' }}>
          {/* Configure button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure(sectionId);
            }}
            className="rounded-md p-2 hover:scale-110 transition-all duration-200"
            style={{
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--elevation-sm)',
              color: 'var(--foreground)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--popover)';
            }}
            title="Configure section"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          {/* Duplicate button */}
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(sectionId);
              }}
              className="rounded-md p-2 hover:scale-110 transition-all duration-200"
              style={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--elevation-sm)',
                color: 'var(--foreground)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--popover)';
              }}
              title="Duplicate section"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}
          
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(sectionId);
            }}
            className="rounded-md p-2 hover:scale-110 transition-all duration-200"
            style={{
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--elevation-sm)',
              color: 'var(--destructive)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-error-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--popover)';
            }}
            title="Remove section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Context Menu */}
      {showMenu && (
        <div
          className="fixed z-50 rounded-lg border shadow-lg"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            backgroundColor: 'var(--popover)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--elevation-lg)',
            minWidth: '200px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="px-3 py-2 border-b"
            style={{ 
              borderColor: 'var(--border)',
              backgroundColor: 'var(--muted)',
            }}
          >
            <p 
              className="truncate"
              style={{ 
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-label)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
              }}
            >
              {sectionTitle}
            </p>
            <p 
              style={{ 
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-detail)',
                color: 'var(--muted-foreground)',
                marginTop: 'var(--spacing-1)',
              }}
            >
              From {sourceTab === 'design' ? 'Design' : 'Test'} tab
            </p>
          </div>

          <div style={{ padding: 'var(--spacing-2)' }}>
            {/* Configure option - only for test tab system sections */}
            {sourceTab === 'test' && (
              <button
                onClick={() => handleMenuAction(() => onConfigure(sectionId))}
                className="w-full flex items-center rounded-md transition-colors"
                style={{
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  fontFamily: 'var(--font-family-inter)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Settings className="h-4 w-4" />
                <span>Configure</span>
              </button>
            )}

            {/* Data Source option */}
            <button
              onClick={() => handleMenuAction(() => onEditDataSource(sectionId))}
              className="w-full flex items-center rounded-md transition-colors"
              style={{
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-base)',
                color: 'var(--foreground)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Database className="h-4 w-4" />
              <span>{isConfigured ? 'Edit' : 'Configure'} Data Source</span>
            </button>

            {/* Save to Library - only if configured */}
            {isConfigured && onSaveToLibrary && (
              <button
                onClick={() => handleMenuAction(() => onSaveToLibrary(sectionId))}
                className="w-full flex items-center rounded-md transition-colors"
                style={{
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  fontFamily: 'var(--font-family-inter)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <BookmarkPlus className="h-4 w-4" />
                <span>Save to Library</span>
              </button>
            )}

            {/* Duplicate - optional feature */}
            {onDuplicate && (
              <button
                onClick={() => handleMenuAction(() => onDuplicate(sectionId))}
                className="w-full flex items-center rounded-md transition-colors"
                style={{
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  fontFamily: 'var(--font-family-inter)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--foreground)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </button>
            )}

            {/* Divider */}
            <div 
              className="my-2" 
              style={{ 
                height: '1px', 
                backgroundColor: 'var(--border)' 
              }} 
            />

            {/* Remove option */}
            <button
              onClick={() => handleMenuAction(() => onRemove(sectionId))}
              className="w-full flex items-center rounded-md transition-colors"
              style={{
                gap: 'var(--spacing-3)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-base)',
                color: 'var(--destructive)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-error-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove Section</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Configuration Popover */}
      {showKPIPopover && sectionType === 'kpi-cards' && onConfigureKPICards && (
        <div
          className="fixed z-50 rounded-lg border shadow-lg"
          style={{
            left: `${kpiPopoverPosition.x}px`,
            top: `${kpiPopoverPosition.y}px`,
            backgroundColor: 'var(--popover)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--elevation-lg)',
            width: '280px',
            maxHeight: '400px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="px-3 py-2 border-b"
            style={{ 
              borderColor: 'var(--border)',
              backgroundColor: 'var(--muted)',
            }}
          >
            <p 
              style={{ 
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-label)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
              }}
            >
              Configure KPI Metrics
            </p>
            <p 
              style={{ 
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-detail)',
                color: 'var(--muted-foreground)',
                marginTop: 'var(--spacing-1)',
              }}
            >
              Select metrics to display
            </p>
          </div>

          {/* Metrics List */}
          <div style={{ padding: 'var(--spacing-3)', maxHeight: '280px', overflowY: 'auto' }}>
            {AVAILABLE_KPI_METRICS.map((metric) => {
              const isSelected = tempSelectedMetrics.includes(metric.id);
              return (
                <div
                  key={metric.id}
                  onClick={() => {
                    if (isSelected) {
                      setTempSelectedMetrics(tempSelectedMetrics.filter(m => m !== metric.id));
                    } else {
                      setTempSelectedMetrics([...tempSelectedMetrics, metric.id]);
                    }
                  }}
                  className="flex items-center rounded-md transition-colors cursor-pointer"
                  style={{
                    gap: 'var(--spacing-2)',
                    padding: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTempSelectedMetrics([...tempSelectedMetrics, metric.id]);
                      } else {
                        setTempSelectedMetrics(tempSelectedMetrics.filter(m => m !== metric.id));
                      }
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {metric.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer with Apply/Cancel */}
          <div 
            className="px-3 py-2 border-t flex justify-end"
            style={{ 
              borderColor: 'var(--border)',
              gap: 'var(--spacing-2)',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowKPIPopover(false);
                setTempSelectedMetrics(selectedMetrics); // Reset to original
              }}
              className="rounded-md px-3 py-1 transition-colors"
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-base)',
                color: 'var(--foreground)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfigureKPICards(sectionId, tempSelectedMetrics);
                setShowKPIPopover(false);
              }}
              className="rounded-md px-3 py-1 transition-colors"
              style={{
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-base)',
                color: 'var(--primary-foreground)',
                backgroundColor: 'var(--primary)',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}