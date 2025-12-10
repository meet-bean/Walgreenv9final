/**
 * Enhanced Report Table
 * Advanced table with sorting, filtering, heat maps, resizing, pinning, sparklines
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { Badge } from './design-system/Badge';
import { Input } from './design-system/Input';
import { Select } from './design-system/Select';
import { Button } from './design-system/Button';
import { Popover } from './design-system/Popover';
import { Checkbox } from './design-system/Checkbox';
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronsUpDown, 
  Filter,
  Pin,
  PinOff,
  GripVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Search
} from 'lucide-react';

export interface ColumnConfig {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'performance' | 'variance';
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  pinnable?: boolean;
  width?: number;
  minWidth?: number;
  heatMap?: boolean;
  sparkline?: boolean;
  accessor?: (row: any) => any;
  formatter?: (value: any, row: any) => React.ReactNode;
}

interface EnhancedReportTableProps {
  columns: ColumnConfig[];
  data: any[];
  onSort?: (columnId: string, direction: 'asc' | 'desc' | null) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onColumnResize?: (columnId: string, width: number) => void;
  onColumnPin?: (columnId: string, pinned: boolean) => void;
  density?: 'compact' | 'comfortable' | 'spacious';
  zebraStriping?: boolean;
  stickyHeader?: boolean;
  expandable?: boolean;
  onRowExpand?: (row: any) => React.ReactNode;
}

export function EnhancedReportTable({
  columns,
  data,
  onSort,
  onFilter,
  onColumnResize,
  onColumnPin,
  density = 'comfortable',
  zebraStriping = true,
  stickyHeader = true,
  expandable = false,
  onRowExpand
}: EnhancedReportTableProps) {
  const [sortConfig, setSortConfig] = useState<{ columnId: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set());
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState<string | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Handle column sort
  const handleSort = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column?.sortable) return;

    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig?.columnId === columnId) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else {
        direction = null;
      }
    }

    if (direction === null) {
      setSortConfig(null);
      onSort?.(columnId, null);
    } else {
      setSortConfig({ columnId, direction });
      onSort?.(columnId, direction);
    }
  };

  // Handle column filter
  const handleFilter = (columnId: string, value: any) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[columnId];
    } else {
      newFilters[columnId] = value;
    }
    
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Handle column pinning
  const handlePin = (columnId: string) => {
    const newPinned = new Set(pinnedColumns);
    if (newPinned.has(columnId)) {
      newPinned.delete(columnId);
      onColumnPin?.(columnId, false);
    } else {
      newPinned.add(columnId);
      onColumnPin?.(columnId, true);
    }
    setPinnedColumns(newPinned);
  };

  // Handle column resizing
  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    setResizingColumn(columnId);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = columnWidths[columnId] || columns.find(c => c.id === columnId)?.width || 150;
  };

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX.current;
      const newWidth = Math.max(100, resizeStartWidth.current + diff);
      setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }));
    };

    const handleMouseUp = () => {
      if (resizingColumn) {
        onColumnResize?.(resizingColumn, columnWidths[resizingColumn]);
      }
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, columnWidths, onColumnResize]);

  // Calculate heat map colors
  const getHeatMapStyle = (value: number, column: ColumnConfig): React.CSSProperties => {
    if (!column.heatMap) return {};
    
    let intensity = 0;
    
    if (column.type === 'performance') {
      // Performance: 0-100%
      if (value >= 90) {
        // Excellent: green
        intensity = (value - 90) / 10;
        return { backgroundColor: `rgba(16, 185, 129, ${0.1 + intensity * 0.2})` };
      } else if (value >= 75) {
        // Good: light green
        return { backgroundColor: 'rgba(16, 185, 129, 0.05)' };
      } else if (value >= 60) {
        // Warning: yellow
        intensity = (75 - value) / 15;
        return { backgroundColor: `rgba(245, 158, 11, ${0.1 + intensity * 0.2})` };
      } else {
        // Critical: red
        intensity = (60 - value) / 60;
        return { backgroundColor: `rgba(239, 68, 68, ${0.1 + intensity * 0.3})` };
      }
    } else if (column.type === 'variance') {
      // Variance: can be positive or negative
      const absValue = Math.abs(value);
      intensity = Math.min(absValue / 20, 1);
      
      if (value > 0) {
        return { backgroundColor: `rgba(16, 185, 129, ${0.05 + intensity * 0.2})` };
      } else {
        return { backgroundColor: `rgba(239, 68, 68, ${0.05 + intensity * 0.2})` };
      }
    } else if (column.type === 'number') {
      // For other numbers, use a blue scale based on relative value
      const values = data.map(row => {
        const accessor = column.accessor || ((r: any) => r[column.id]);
        return accessor(row);
      }).filter(v => typeof v === 'number');
      
      if (values.length === 0) return {};
      
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      if (max === min) return {};
      
      intensity = (value - min) / (max - min);
      return { backgroundColor: `rgba(59, 130, 246, ${0.05 + intensity * 0.15})` };
    }
    
    return {};
  };

  // Render sparkline
  const renderSparkline = (values: number[]) => {
    if (!values || values.length === 0) return null;
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 50;
      const y = 20 - ((v - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="60" height="20" className="sparkline">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="sparkline-line"
        />
      </svg>
    );
  };

  // Sort and filter data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      const column = columns.find(c => c.id === columnId);
      if (!column) return;
      
      result = result.filter(row => {
        const accessor = column.accessor || ((r: any) => r[columnId]);
        const value = accessor(row);
        
        if (typeof filterValue === 'string') {
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return value === filterValue;
      });
    });
    
    // Apply sorting
    if (sortConfig) {
      const column = columns.find(c => c.id === sortConfig.columnId);
      if (column) {
        result.sort((a, b) => {
          const accessor = column.accessor || ((r: any) => r[sortConfig.columnId]);
          const aVal = accessor(a);
          const bVal = accessor(b);
          
          if (aVal === bVal) return 0;
          
          const comparison = aVal < bVal ? -1 : 1;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
      }
    }
    
    return result;
  }, [data, filters, sortConfig, columns]);

  // Organize columns (pinned first)
  const organizedColumns = useMemo(() => {
    const pinned = columns.filter(c => pinnedColumns.has(c.id));
    const unpinned = columns.filter(c => !pinnedColumns.has(c.id));
    return [...pinned, ...unpinned];
  }, [columns, pinnedColumns]);

  // Get unique filter options
  const getFilterOptions = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column) return [];
    
    const accessor = column.accessor || ((r: any) => r[columnId]);
    const values = data.map(row => accessor(row));
    return Array.from(new Set(values)).sort();
  };

  return (
    <div className={`enhanced-table-container enhanced-table-${density}`}>
      <div className="enhanced-table-wrapper">
        <Table className={stickyHeader ? 'enhanced-table-sticky' : ''}>
          <TableHeader>
            <TableRow>
              {organizedColumns.map((column) => {
                const isPinned = pinnedColumns.has(column.id);
                const width = columnWidths[column.id] || column.width;
                const isSorted = sortConfig?.columnId === column.id;
                const hasFilter = filters[column.id] !== undefined;
                
                return (
                  <TableHead 
                    key={column.id}
                    className={`enhanced-table-head ${isPinned ? 'enhanced-table-head-pinned' : ''}`}
                    style={{ 
                      width: width ? `${width}px` : undefined,
                      minWidth: column.minWidth ? `${column.minWidth}px` : undefined
                    }}
                  >
                    <div className="enhanced-table-head-content">
                      {/* Sort icon and label */}
                      <button
                        className="enhanced-table-sort-button"
                        onClick={() => handleSort(column.id)}
                        disabled={!column.sortable}
                      >
                        <span>{column.label}</span>
                        {column.sortable && (
                          <span className="enhanced-table-sort-icon">
                            {isSorted ? (
                              sortConfig.direction === 'asc' ? (
                                <ArrowUp className="icon-sm" />
                              ) : (
                                <ArrowDown className="icon-sm" />
                              )
                            ) : (
                              <ChevronsUpDown className="icon-sm icon-muted" />
                            )}
                          </span>
                        )}
                      </button>

                      {/* Filter and pin controls */}
                      <div className="enhanced-table-controls">
                        {column.filterable && (
                          <Popover
                            open={filterPopoverOpen === column.id}
                            onOpenChange={(open) => setFilterPopoverOpen(open ? column.id : null)}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className={hasFilter ? 'enhanced-table-filter-active' : ''}
                            >
                              <Filter className="icon-sm" />
                            </Button>
                            <div className="popover-content enhanced-table-filter-popover">
                              <div className="enhanced-table-filter-header">
                                <span>Filter {column.label}</span>
                                {hasFilter && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFilter(column.id, null)}
                                  >
                                    <X className="icon-sm" />
                                  </Button>
                                )}
                              </div>
                              {column.type === 'text' || !column.type ? (
                                <Input
                                  placeholder="Search..."
                                  value={filters[column.id] || ''}
                                  onChange={(e) => handleFilter(column.id, e.target.value)}
                                />
                              ) : column.type === 'number' || column.type === 'performance' || column.type === 'variance' ? (
                                <div className="enhanced-table-filter-range">
                                  <Input
                                    type="number"
                                    placeholder="Min"
                                    className="enhanced-table-filter-range-input"
                                  />
                                  <span>to</span>
                                  <Input
                                    type="number"
                                    placeholder="Max"
                                    className="enhanced-table-filter-range-input"
                                  />
                                </div>
                              ) : (
                                <Select
                                  value={filters[column.id] || ''}
                                  onChange={(e) => handleFilter(column.id, e.target.value)}
                                >
                                  <option value="">All</option>
                                  {getFilterOptions(column.id).map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                  ))}
                                </Select>
                              )}
                            </div>
                          </Popover>
                        )}

                        {column.pinnable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePin(column.id)}
                          >
                            {isPinned ? (
                              <PinOff className="icon-sm" />
                            ) : (
                              <Pin className="icon-sm" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Resize handle */}
                      {column.resizable && (
                        <div
                          className="enhanced-table-resize-handle"
                          onMouseDown={(e) => handleResizeStart(e, column.id)}
                        >
                          <GripVertical className="icon-sm" />
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((row, rowIndex) => {
              const isExpanded = expandedRows.has(rowIndex);
              
              return (
                <React.Fragment key={rowIndex}>
                  <TableRow 
                    className={`
                      ${zebraStriping && rowIndex % 2 === 1 ? 'enhanced-table-row-zebra' : ''}
                      ${expandable ? 'enhanced-table-row-expandable' : ''}
                    `}
                    onClick={() => {
                      if (expandable) {
                        setExpandedRows(prev => {
                          const next = new Set(prev);
                          if (next.has(rowIndex)) {
                            next.delete(rowIndex);
                          } else {
                            next.add(rowIndex);
                          }
                          return next;
                        });
                      }
                    }}
                  >
                    {organizedColumns.map((column) => {
                      const accessor = column.accessor || ((r: any) => r[column.id]);
                      const value = accessor(row);
                      const isPinned = pinnedColumns.has(column.id);
                      const width = columnWidths[column.id] || column.width;
                      const heatMapStyle = column.heatMap && typeof value === 'number' 
                        ? getHeatMapStyle(value, column) 
                        : {};
                      
                      return (
                        <TableCell
                          key={column.id}
                          className={isPinned ? 'enhanced-table-cell-pinned' : ''}
                          style={{ 
                            width: width ? `${width}px` : undefined,
                            ...heatMapStyle
                          }}
                        >
                          {column.formatter ? (
                            column.formatter(value, row)
                          ) : column.sparkline ? (
                            renderSparkline(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {expandable && isExpanded && onRowExpand && (
                    <TableRow className="enhanced-table-row-expanded">
                      <TableCell colSpan={organizedColumns.length}>
                        {onRowExpand(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Active filters display */}
      {Object.keys(filters).length > 0 && (
        <div className="enhanced-table-active-filters">
          <span className="text-muted">Active filters:</span>
          {Object.entries(filters).map(([columnId, value]) => {
            const column = columns.find(c => c.id === columnId);
            return (
              <Badge key={columnId} variant="outline" className="enhanced-table-filter-chip">
                {column?.label}: {String(value)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilter(columnId, null)}
                >
                  <X className="icon-sm" />
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({});
              onFilter?.({});
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
