import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from './design-system/Button';
import { Label } from './design-system/Label';
import { Checkbox } from './design-system/Checkbox';
import { Select } from './design-system/Select';
import { Badge } from './design-system/Badge';
import { Separator } from './design-system/Separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './design-system/Dialog';
import { Input } from './design-system/Input';
import { ChevronUp, ChevronDown, Layers, Columns, GripVertical, FolderPlus, Trash2, ChevronRight } from 'lucide-react';
import { ReportType } from '../lib/reportGenerator';

export interface ColumnDefinition {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
  category?: 'core' | 'volume' | 'performance' | 'calculated';
  groupId?: string;
}

export interface ColumnGroup {
  id: string;
  label: string;
  collapsed: boolean;
  order: number;
}

export interface GroupingConfig {
  enabled: boolean;
  groupBy: 'none' | 'site' | 'jobFunction' | 'date' | 'performanceLevel';
  sortBy: 'name' | 'performance' | 'volume';
  sortDirection: 'asc' | 'desc';
}

export interface ReportDisplayConfig {
  columns: ColumnDefinition[];
  grouping: GroupingConfig;
  columnGroups?: ColumnGroup[];
}

interface ReportColumnConfigProps {
  reportType: ReportType;
  currentConfig: ReportDisplayConfig;
  onSave: (config: ReportDisplayConfig) => void;
}

// Default column configurations for each report type
export const DEFAULT_COLUMNS: Record<ReportType, ColumnDefinition[]> = {
  'daily-performance': [
    { id: 'task', label: 'Task', enabled: true, order: 0, category: 'core' },
    { id: 'function', label: 'Function', enabled: true, order: 1, category: 'core' },
    { id: 'budgeted', label: 'Budgeted Volume', enabled: true, order: 2, category: 'volume', groupId: 'budget' },
    { id: 'budgetedRate', label: 'Budgeted Rate (UPH)', enabled: true, order: 3, category: 'volume', groupId: 'budget' },
    { id: 'budgetedHours', label: 'Budgeted Hours', enabled: true, order: 4, category: 'volume', groupId: 'budget' },
    { id: 'forecasted', label: 'Forecasted Volume', enabled: true, order: 5, category: 'volume' },
    { id: 'site', label: 'Site ID', enabled: false, order: 6, category: 'core' },
    { id: 'date', label: 'Date', enabled: false, order: 7, category: 'core' },
    { id: 'actual', label: 'Actual Volume', enabled: true, order: 8, category: 'volume', groupId: 'actual' },
    { id: 'unitsPerHour', label: 'Actual Rate (UPH)', enabled: true, order: 9, category: 'calculated', groupId: 'actual' },
    { id: 'hours', label: 'Actual Hours', enabled: true, order: 10, category: 'core', groupId: 'actual' },
    { id: 'variance', label: 'Variance', enabled: true, order: 11, category: 'calculated', groupId: 'variance' },
    { id: 'efficiency', label: 'Efficiency %', enabled: true, order: 12, category: 'calculated', groupId: 'variance' },
    { id: 'performance', label: 'Avg Performance', enabled: false, order: 13, category: 'performance' },
  ],
  'weekly-trend': [
    { id: 'task', label: 'Task', enabled: true, order: 0, category: 'core' },
    { id: 'date', label: 'Date', enabled: true, order: 1, category: 'core' },
    { id: 'budgeted', label: 'Budgeted Volume', enabled: true, order: 2, category: 'volume', groupId: 'budget' },
    { id: 'budgetedRate', label: 'Budgeted Rate (UPH)', enabled: true, order: 3, category: 'volume', groupId: 'budget' },
    { id: 'budgetedHours', label: 'Budgeted Hours', enabled: true, order: 4, category: 'volume', groupId: 'budget' },
    { id: 'forecasted', label: 'Forecasted Volume', enabled: true, order: 5, category: 'volume' },
    { id: 'site', label: 'Site ID', enabled: false, order: 6, category: 'core' },
    { id: 'jobFunction', label: 'Job Function', enabled: false, order: 7, category: 'core' },
    { id: 'actual', label: 'Actual Volume', enabled: true, order: 8, category: 'volume', groupId: 'actual' },
    { id: 'unitsPerHour', label: 'Actual Rate (UPH)', enabled: true, order: 9, category: 'calculated', groupId: 'actual' },
    { id: 'hours', label: 'Actual Hours', enabled: true, order: 10, category: 'core', groupId: 'actual' },
    { id: 'variance', label: 'Variance', enabled: true, order: 11, category: 'calculated', groupId: 'variance' },
    { id: 'efficiency', label: 'Efficiency %', enabled: true, order: 12, category: 'calculated', groupId: 'variance' },
    { id: 'performance', label: 'Performance', enabled: false, order: 13, category: 'performance' },
    { id: 'dayOfWeek', label: 'Day of Week', enabled: false, order: 14, category: 'core' },
  ],
  'exception': [
    { id: 'task', label: 'Task', enabled: true, order: 0, category: 'core' },
    { id: 'budgeted', label: 'Budgeted Volume', enabled: true, order: 1, category: 'volume', groupId: 'budget' },
    { id: 'budgetedRate', label: 'Budgeted Rate (UPH)', enabled: true, order: 2, category: 'volume', groupId: 'budget' },
    { id: 'budgetedHours', label: 'Budgeted Hours', enabled: true, order: 3, category: 'volume', groupId: 'budget' },
    { id: 'forecasted', label: 'Forecasted Volume', enabled: true, order: 4, category: 'volume' },
    { id: 'site', label: 'Site ID', enabled: true, order: 5, category: 'core' },
    { id: 'jobFunction', label: 'Job Function', enabled: true, order: 6, category: 'core' },
    { id: 'date', label: 'Date', enabled: true, order: 7, category: 'core' },
    { id: 'actual', label: 'Actual Volume', enabled: true, order: 8, category: 'volume', groupId: 'actual' },
    { id: 'unitsPerHour', label: 'Actual Rate (UPH)', enabled: true, order: 9, category: 'calculated', groupId: 'actual' },
    { id: 'hours', label: 'Actual Hours', enabled: true, order: 10, category: 'core', groupId: 'actual' },
    { id: 'variance', label: 'Variance', enabled: true, order: 11, category: 'calculated', groupId: 'variance' },
    { id: 'efficiency', label: 'Efficiency %', enabled: true, order: 12, category: 'calculated', groupId: 'variance' },
    { id: 'performance', label: 'Performance', enabled: false, order: 13, category: 'performance' },
  ],
};

export const DEFAULT_COLUMN_GROUPS: ColumnGroup[] = [
  { id: 'budget', label: 'Budget', collapsed: false, order: 0 },
  { id: 'actual', label: 'Actual', collapsed: false, order: 1 },
  { id: 'variance', label: 'Variance', collapsed: false, order: 2 },
];

export const DEFAULT_GROUPING: GroupingConfig = {
  enabled: false,
  groupBy: 'none',
  sortBy: 'name',
  sortDirection: 'asc',
};

const ItemTypes = {
  COLUMN: 'column',
};

interface DroppableGroupHeaderProps {
  group: ColumnGroup;
  groupColumns: ColumnDefinition[];
  isExpanded: boolean;
  toggleExpanded: () => void;
  deleteGroup: () => void;
  assignColumnToGroup: (columnId: string, groupId: string) => void;
}

function DroppableGroupHeader({ 
  group, 
  groupColumns, 
  isExpanded, 
  toggleExpanded, 
  deleteGroup,
  assignColumnToGroup 
}: DroppableGroupHeaderProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    drop: (item: { columnId: string }) => {
      assignColumnToGroup(item.columnId, group.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`column-group-header ${isOver ? 'column-group-header-drop-target' : ''}`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpanded}
      >
        <ChevronRight 
          className={`icon-sm transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </Button>
      <span className="column-group-label">{group.label}</span>
      <Badge variant="outline" className="column-group-count">
        {groupColumns.length}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={deleteGroup}
      >
        <Trash2 className="icon-sm" />
      </Button>
    </div>
  );
}

interface DraggableColumnItemProps {
  column: ColumnDefinition;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  toggleColumn: (columnId: string) => void;
  removeFromGroup: (columnId: string) => void;
  inGroup?: boolean;
}

function DraggableColumnItem({ column, index, moveColumn, toggleColumn, removeFromGroup, inGroup }: DraggableColumnItemProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemTypes.COLUMN,
    item: { index, columnId: column.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover: (item: { index: number; columnId: string }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`column-config-row ${!column.enabled ? 'column-config-row-disabled' : ''} ${isDragging ? 'column-config-row-dragging' : ''}`}
    >
      <div className="column-config-row-content">
        <div className="column-config-drag-handle">
          <GripVertical className="icon-sm text-muted" />
        </div>
        <Checkbox
          checked={column.enabled}
          onCheckedChange={() => toggleColumn(column.id)}
        />
        <div className="column-config-label-group">
          <span className="column-config-label">{column.label}</span>
          {column.category && (
            <Badge
              variant="outline"
              className="column-category-badge"
            >
              {column.category}
            </Badge>
          )}
        </div>
      </div>

      {inGroup && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeFromGroup(column.id)}
        >
          <Trash2 className="icon-sm" />
        </Button>
      )}
    </div>
  );
}

export function ReportColumnConfig({ reportType, currentConfig, onSave }: ReportColumnConfigProps) {
  const [columns, setColumns] = useState<ColumnDefinition[]>(currentConfig.columns);
  const [grouping, setGrouping] = useState<GroupingConfig>(currentConfig.grouping);
  const [columnGroups, setColumnGroups] = useState<ColumnGroup[]>(
    currentConfig.columnGroups || DEFAULT_COLUMN_GROUPS
  );
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(columnGroups.map(g => g.id))
  );

  const toggleColumn = (columnId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, enabled: !col.enabled } : col
    );
    setColumns(newColumns);
    onSave({ columns: newColumns, grouping, columnGroups });
  };

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const sorted = [...columns].sort((a, b) => a.order - b.order);
    const dragColumn = sorted[dragIndex];
    sorted.splice(dragIndex, 1);
    sorted.splice(hoverIndex, 0, dragColumn);
    
    // Reassign order
    const reordered = sorted.map((col, idx) => ({ ...col, order: idx }));
    setColumns(reordered);
    onSave({ columns: reordered, grouping, columnGroups });
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: ColumnGroup = {
      id: newGroupName.toLowerCase().replace(/\s+/g, '-'),
      label: newGroupName,
      collapsed: false,
      order: columnGroups.length,
    };
    
    const newGroups = [...columnGroups, newGroup];
    setColumnGroups(newGroups);
    setExpandedGroups(prev => new Set([...prev, newGroup.id]));
    onSave({ columns, grouping, columnGroups: newGroups });
    setNewGroupName('');
    setShowNewGroupDialog(false);
  };

  const deleteGroup = (groupId: string) => {
    // Remove group from columns
    const newColumns = columns.map(col =>
      col.groupId === groupId ? { ...col, groupId: undefined } : col
    );
    const newGroups = columnGroups.filter(g => g.id !== groupId);
    
    setColumns(newColumns);
    setColumnGroups(newGroups);
    onSave({ columns: newColumns, grouping, columnGroups: newGroups });
  };

  const removeFromGroup = (columnId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, groupId: undefined } : col
    );
    setColumns(newColumns);
    onSave({ columns: newColumns, grouping, columnGroups });
  };

  const assignColumnToGroup = (columnId: string, groupId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, groupId } : col
    );
    setColumns(newColumns);
    onSave({ columns: newColumns, grouping, columnGroups });
  };

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleReset = () => {
    const defaultColumns = DEFAULT_COLUMNS[reportType];
    const defaultGrouping = DEFAULT_GROUPING;
    const defaultGroups = DEFAULT_COLUMN_GROUPS;
    setColumns(defaultColumns);
    setGrouping(defaultGrouping);
    setColumnGroups(defaultGroups);
    onSave({ columns: defaultColumns, grouping: defaultGrouping, columnGroups: defaultGroups });
  };

  const enabledCount = columns.filter(col => col.enabled).length;
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  const ungroupedColumns = sortedColumns.filter(col => !col.groupId);

  const groupingOptions = [
    { value: 'none', label: 'No Grouping' },
    ...(reportType !== 'daily-performance' ? [{ value: 'site', label: 'Group by Site' }] : []),
    ...(reportType === 'exception' ? [{ value: 'jobFunction', label: 'Group by Job Function' }] : []),
    ...(reportType === 'exception' ? [{ value: 'performanceLevel', label: 'Group by Performance Level' }] : []),
    ...(reportType === 'weekly-trend' ? [{ value: 'date', label: 'Group by Week' }] : []),
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="report-config-panel">
        <div className="space-y-6">
          {/* Live Update Notice */}
          <div className="report-config-notice">
            <p className="text-muted">Changes apply automatically</p>
          </div>

          {/* Column Configuration */}
          <div>
            <div className="text-muted column-config-subtitle">
              {enabledCount} of {columns.length} columns shown • Drag to reorder • Drag columns into groups to organize
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewGroupDialog(true)}
              className="mb-3"
            >
              <FolderPlus className="icon-sm" />
              New Group
            </Button>

            <div className="column-config-list">
              {/* Column Groups */}
              {columnGroups.map((group) => {
                const groupColumns = sortedColumns.filter(col => col.groupId === group.id);
                if (groupColumns.length === 0) return null;
                
                return (
                  <div key={group.id} className="column-group">
                    <DroppableGroupHeader
                      group={group}
                      groupColumns={groupColumns}
                      isExpanded={expandedGroups.has(group.id)}
                      toggleExpanded={() => toggleGroupExpanded(group.id)}
                      deleteGroup={() => deleteGroup(group.id)}
                      assignColumnToGroup={assignColumnToGroup}
                    />
                    
                    {expandedGroups.has(group.id) && (
                      <div className="column-group-items">
                        {groupColumns.map((column, index) => (
                          <DraggableColumnItem
                            key={column.id}
                            column={column}
                            index={sortedColumns.indexOf(column)}
                            moveColumn={moveColumn}
                            toggleColumn={toggleColumn}
                            removeFromGroup={removeFromGroup}
                            inGroup
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Ungrouped Columns */}
              {ungroupedColumns.length > 0 && (
                <div className="column-group">
                  <div className="column-group-header">
                    <span className="column-group-label text-muted">Ungrouped</span>
                    <Badge variant="outline" className="column-group-count">
                      {ungroupedColumns.length}
                    </Badge>
                  </div>
                  <div className="column-group-items">
                    {ungroupedColumns.map((column) => (
                      <DraggableColumnItem
                        key={column.id}
                        column={column}
                        index={sortedColumns.indexOf(column)}
                        moveColumn={moveColumn}
                        toggleColumn={toggleColumn}
                        removeFromGroup={removeFromGroup}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Grouping Configuration */}
          <div>
            <div className="flex-start grouping-config-header">
              <Layers className="icon-sm" />
              <div className="label-section">Row Grouping</div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="groupBy">Group By</Label>
                <Select
                  id="groupBy"
                  value={grouping.groupBy}
                  onChange={(e) => {
                    const newGrouping = {
                      ...grouping,
                      groupBy: e.target.value as GroupingConfig['groupBy'],
                      enabled: e.target.value !== 'none',
                    };
                    setGrouping(newGrouping);
                    onSave({ columns, grouping: newGrouping, columnGroups });
                  }}
                >
                  {groupingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {grouping.enabled && (
                <>
                  <div>
                    <Label htmlFor="sortBy">Sort Groups By</Label>
                    <Select
                      id="sortBy"
                      value={grouping.sortBy}
                      onChange={(e) => {
                        const newGrouping = {
                          ...grouping,
                          sortBy: e.target.value as GroupingConfig['sortBy'],
                        };
                        setGrouping(newGrouping);
                        onSave({ columns, grouping: newGrouping, columnGroups });
                      }}
                    >
                      <option value="name">Name</option>
                      <option value="performance">Performance</option>
                      <option value="volume">Volume</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sortDirection">Sort Direction</Label>
                    <Select
                      id="sortDirection"
                      value={grouping.sortDirection}
                      onChange={(e) => {
                        const newGrouping = {
                          ...grouping,
                          sortDirection: e.target.value as GroupingConfig['sortDirection'],
                        };
                        setGrouping(newGrouping);
                        onSave({ columns, grouping: newGrouping, columnGroups });
                      }}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="report-config-actions">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>

      {/* New Group Dialog */}
      {showNewGroupDialog && (
        <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Column Group</DialogTitle>
              <DialogDescription>
                Group related columns together for better organization
              </DialogDescription>
            </DialogHeader>
            
            <div className="dialog-body">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Performance Metrics"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createGroup();
                    }
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewGroupDialog(false);
                  setNewGroupName('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={createGroup}
                disabled={!newGroupName.trim()}
              >
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DndProvider>
  );
}