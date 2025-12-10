import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from './design-system/Card';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Badge } from './design-system/Badge';
import { Switch } from './design-system/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Checkbox } from './design-system/Checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './design-system/Popover';
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye,
  Copy,
  GripVertical,
  X,
  User,
  Users,
  Trophy,
  BarChart3,
  TrendingUp,
  FolderTree,
  Clock,
  Award,
  DollarSign,
  Map,
  PieChart,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { DashboardDefinition, DashboardSection, UserRole } from '../lib/mockData';
import { DashboardRenderer } from './DashboardRenderer';
import { ModernDateRangePicker } from './ModernDateRangePicker';
import { SECTION_DEFINITIONS } from '../lib/sectionDefinitions';
import { Label } from './design-system/Label';
import { toast } from './design-system/Toast';
import { SectionSidebar } from './SectionSidebar';
import { KPIMetricsSelector } from './KPIMetricsSelector';
import { ReorderSectionsModal } from './ReorderSectionsModal';

const DRAG_TYPE = 'SECTION';

const ALL_ROLES: UserRole[] = ['executive', 'site-manager', 'supervisor'];

const ROLE_LABELS: Record<UserRole, string> = {
  'executive': 'Executive',
  'site-manager': 'Site Manager',
  'supervisor': 'Supervisor',
};

interface RoleVisibilityControlProps {
  sectionRoles?: UserRole[];
  useDefault: boolean;
  dashboardDefaultRoles?: UserRole[];
  onChange: (roles: UserRole[] | undefined, useDefault: boolean) => void;
}

function RoleVisibilityControl({
  sectionRoles,
  useDefault,
  dashboardDefaultRoles,
  onChange,
}: RoleVisibilityControlProps) {
  const [localUseDefault, setLocalUseDefault] = useState(useDefault);
  const [localRoles, setLocalRoles] = useState<UserRole[]>(sectionRoles || dashboardDefaultRoles || ALL_ROLES);

  const effectiveRoles = localUseDefault ? (dashboardDefaultRoles || ALL_ROLES) : localRoles;

  const toggleRole = (role: UserRole) => {
    const newRoles = effectiveRoles.includes(role)
      ? effectiveRoles.filter(r => r !== role)
      : [...effectiveRoles, role];
    setLocalRoles(newRoles);
    if (!localUseDefault) {
      onChange(newRoles, false);
    }
  };

  const handleUseDefaultChange = (checked: boolean) => {
    setLocalUseDefault(checked);
    onChange(checked ? undefined : localRoles, checked);
  };

  return (
    <div className="role-control-container">
      <div>
        <h4 className="role-control-header-title">
          Role Visibility
        </h4>
        <p className="role-control-header-description">
          Control which roles can see this section
        </p>
      </div>

      <div className="role-control-switch-group">
        <Checkbox
          id="use-default"
          checked={localUseDefault}
          onCheckedChange={handleUseDefaultChange}
        />
        <Label 
          htmlFor="use-default"
          style={{ cursor: 'pointer' }}
        >
          Use dashboard default
        </Label>
      </div>

      {localUseDefault && dashboardDefaultRoles && dashboardDefaultRoles.length > 0 && (
        <div 
          style={{ 
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-muted)',
            border: '1px solid var(--color-border)'
          }}
        >
          <p style={{ 
            color: 'var(--color-muted-foreground)',
            fontSize: '0.75rem',
            marginBottom: 'var(--spacing-2)'
          }}>
            Dashboard default:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
            {dashboardDefaultRoles.map(role => (
              <Badge 
                key={role} 
                variant="secondary"
                style={{ 
                  fontSize: '0.75rem'
                }}
              >
                {ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {localUseDefault && (!dashboardDefaultRoles || dashboardDefaultRoles.length === 0) && (
        <div 
          style={{ 
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-muted)',
            border: '1px solid var(--color-border)'
          }}
        >
          <p style={{ 
            color: 'var(--color-muted-foreground)',
            fontSize: '0.75rem'
          }}>
            No dashboard default set. Visible to all roles.
          </p>
        </div>
      )}

      {!localUseDefault && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <Label>
            Custom visibility:
          </Label>
          {ALL_ROLES.map(role => (
            <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Checkbox
                id={`role-${role}`}
                checked={effectiveRoles.includes(role)}
                onCheckedChange={() => toggleRole(role)}
              />
              <Label 
                htmlFor={`role-${role}`}
                style={{ 
                  color: 'var(--color-foreground)',
                  cursor: 'pointer'
                }}
              >
                {ROLE_LABELS[role]}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ModernDashboardBuilderProps {
  initialDashboard?: DashboardDefinition;
  userRole: 'executive' | 'site-manager';
  userName: string;
  onSave: (dashboard: DashboardDefinition) => void;
  onCancel: () => void;
  startInPreviewMode?: boolean;
}

interface DraggableSectionProps {
  section: DashboardSection;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onUpdateWidth: (id: string, width: 1 | 2 | 3 | 4) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateVisibility: (id: string, roles: UserRole[] | undefined, useDefault: boolean) => void;
  onConfigureKPICards: (sectionId: string, selectedMetrics: string[]) => void;
  onSectionClick?: (section: DashboardSection) => void;
  dashboardDefaultRoles?: UserRole[];
  isPreviewMode: boolean;
  userRole: 'vp' | 'site-manager' | 'supervisor';
  externalFilters: {
    startDate: Date | null;
    endDate: Date | null;
    showUnderperformingOnly: boolean;
  };
  isNewlyAdded?: boolean;
}

function DraggableSection({
  section,
  index,
  moveSection,
  onUpdateWidth,
  onDuplicate,
  onRemove,
  onUpdateVisibility,
  onConfigureKPICards,
  onSectionClick,
  dashboardDefaultRoles,
  isPreviewMode,
  userRole,
  externalFilters,
  isNewlyAdded,
}: DraggableSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisibilityPopoverOpen, setIsVisibilityPopoverOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE,
    item: { index, section },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isPreviewMode,
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current || isPreviewMode) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  drag(drop(ref));

  const sectionDef = SECTION_DEFINITIONS.find((def) => def.type === section.type);

  // Calculate grid column span based on columnSpan
  const getGridColumnSpan = (span: number) => {
    return `span ${span} / span ${span}`;
  };

  return (
    <div
      ref={ref}
      style={{
        gridColumn: getGridColumnSpan(section.columnSpan),
        opacity: isDragging ? 0.5 : 1,
        transition: isDragging ? 'none' : 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : isPreviewMode ? 'default' : 'grab',
        pointerEvents: isDragging ? 'none' : 'auto',
        animation: isNewlyAdded ? 'slideInFromRight 0.5s ease-out' : 'none',
      }}
      onMouseEnter={() => !isPreviewMode && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSectionClick && onSectionClick(section)}
    >
      {/* Placeholder shown when dragging over */}
      {isOver && canDrop && !isPreviewMode && (
        <>
          {/* Background fill */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              pointerEvents: 'none',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-primary)',
              opacity: 0.06,
              zIndex: 5,
            }}
          />
          {/* Animated border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              pointerEvents: 'none',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--color-primary)',
              zIndex: 10,
              animation: 'pulse 1.2s ease-in-out infinite',
            }}
          />
          {/* Corner markers for emphasis */}
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              top: '-4px',
              left: '-4px',
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              zIndex: 11,
              animation: 'pulse 1.2s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              top: '-4px',
              right: '-4px',
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              zIndex: 11,
              animation: 'pulse 1.2s ease-in-out infinite',
            }}
          />
        </>
      )}

      <Card
        style={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderColor: isHovered && !isPreviewMode ? 'var(--color-chart-1)' : 'var(--color-border)',
          boxShadow: isHovered && !isPreviewMode ? 'var(--shadow-elevation-md)' : 'var(--shadow-elevation-sm)',
          backgroundColor: isDragging ? 'var(--color-muted)' : 'var(--color-card)',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Builder Controls - Only visible on hover and in edit mode */}
        {!isPreviewMode && isHovered && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-muted)',
              borderColor: 'var(--color-border)',
              padding: 'var(--spacing-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div
                style={{
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-muted-foreground)',
                  padding: 'var(--spacing-1)',
                }}
              >
                <GripVertical size={16} />
              </div>
              <span className="section-editor-label">
                {sectionDef?.icon} {section.title}
              </span>
              {/* Visibility Indicator */}
              {(() => {
                const effectiveRoles = section.useDefaultVisibility !== false 
                  ? (dashboardDefaultRoles || ALL_ROLES)
                  : (section.visibleToRoles || ALL_ROLES);
                
                const isRestricted = effectiveRoles.length < ALL_ROLES.length;
                
                if (isRestricted) {
                  return (
                    <Badge 
                      variant="secondary" 
                      style={{ 
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-family-inter)',
                        backgroundColor: 'var(--color-chart-2)',
                        color: 'white'
                      }}
                    >
                      <Users size={10} style={{ marginRight: '2px' }} />
                      {effectiveRoles.map(r => ROLE_LABELS[r].charAt(0)).join(', ')}
                    </Badge>
                  );
                }
                return null;
              })()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
              {/* Width Controls */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4].map((width) => (
                  <button
                    key={width}
                    onClick={() => onUpdateWidth(section.id, width as 1 | 2 | 3 | 4)}
                    style={{
                      paddingLeft: 'var(--spacing-2)',
                      paddingRight: 'var(--spacing-2)',
                      paddingTop: 'var(--spacing-1)',
                      paddingBottom: 'var(--spacing-1)',
                      borderRadius: 'var(--radius)',
                      transition: 'all var(--transition-default)',
                      fontSize: 'var(--text-detail)',
                      backgroundColor:
                        section.columnSpan === width
                          ? 'var(--color-chart-1)'
                          : 'transparent',
                      color:
                        section.columnSpan === width
                          ? 'white'
                          : 'var(--color-muted-foreground)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {width}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              {/* KPI Cards Configuration Button - Only show for kpi-cards sections */}
              {section.type === 'kpi-cards' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ height: '28px', width: '28px', padding: 0 }}
                      title="Configure KPI metrics"
                    >
                      <SlidersHorizontal size={12} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    sideOffset={8}
                    collisionPadding={20}
                    style={{
                      width: '280px',
                      padding: 0,
                      backgroundColor: 'var(--color-popover)',
                      borderColor: 'var(--color-border)',
                      maxHeight: 'calc(100vh - 100px)',
                      overflow: 'visible',
                      zIndex: 9999,
                    }}
                  >
                    <KPIMetricsSelector
                      sectionId={section.id}
                      currentMetrics={(section as any).kpiCards?.map((c: any) => c.systemMetric) || []}
                      onApply={(selectedMetrics) => {
                        // Call the handler passed from parent
                        if (onConfigureKPICards) {
                          onConfigureKPICards(section.id, selectedMetrics);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
              
              <Popover open={isVisibilityPopoverOpen} onOpenChange={setIsVisibilityPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ height: '28px', width: '28px', padding: 0 }}
                    title="Role visibility"
                  >
                    <Users size={12} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  style={{ 
                    width: '320px',
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <RoleVisibilityControl
                    sectionRoles={section.visibleToRoles}
                    useDefault={section.useDefaultVisibility !== false}
                    dashboardDefaultRoles={dashboardDefaultRoles}
                    onChange={(roles, useDefault) => {
                      onUpdateVisibility(section.id, roles, useDefault);
                      setIsVisibilityPopoverOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(section.id)}
                style={{ height: '28px', width: '28px', padding: 0 }}
                title="Duplicate section"
              >
                <Copy size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(section.id)}
                style={{ height: '28px', width: '28px', padding: 0 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-error-light)';
                  e.currentTarget.style.color = 'var(--color-error)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                title="Remove section"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          </div>
        )}

        {/* Section Content - Use DashboardRenderer for individual sections */}
        <DashboardRenderer
          dashboard={{
            id: 'temp',
            name: '',
            description: '',
            sections: [section],
            targetRole: userRole === 'vp' ? 'executive' : userRole === 'site-manager' ? 'site-manager' : 'supervisor',
            createdBy: '',
            createdAt: '',
            filters: {
              allowDateRange: false,
              allowSiteFilter: false,
              allowAggregation: false,
              showUnderperformingOnly: false,
            },
          }}
          previewRole={userRole}
          siteId={userRole === 'site-manager' ? 'DC-001' : undefined}
          jobFunctionId={userRole === 'supervisor' ? 'receiving' : undefined}
          builderMode={true}
          externalFilters={externalFilters}
          onConfigureKPICards={undefined} // Will be passed from parent
        />
      </Card>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders during drag
const MemoizedDraggableSection = React.memo(DraggableSection);

export function ModernDashboardBuilder({
  initialDashboard,
  userRole,
  userName,
  onSave,
  onCancel,
  startInPreviewMode = false,
}: ModernDashboardBuilderProps) {
  // State management for dashboard builder
  const [dashboard, setDashboard] = useState<DashboardDefinition>(
    initialDashboard || {
      id: `dashboard-${Date.now()}`,
      name: '',
      description: '',
      targetRole: userRole,
      sections: [],
      createdBy: userName,
      createdAt: new Date().toISOString(),
      filters: {
        allowDateRange: true,
        allowSiteFilter: false,
        allowAggregation: true,
        showUnderperformingOnly: false,
      },
    }
  );

  const [isPreviewMode, setIsPreviewMode] = useState(startInPreviewMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUnderperforming, setShowUnderperforming] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [sectionDefinitions, setSectionDefinitions] = useState(SECTION_DEFINITIONS);
  const [newlyAddedSectionId, setNewlyAddedSectionId] = useState<string | null>(null);
  const [selectedSectionForInspector, setSelectedSectionForInspector] = useState<DashboardSection | null>(null);
  const [baselineSection, setBaselineSection] = useState<DashboardSection | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  // Convert userRole to the format expected by DashboardRenderer
  const convertedUserRole: 'vp' | 'site-manager' | 'supervisor' = 
    userRole === 'executive' ? 'vp' : 'site-manager';

  // Role preview selector for edit mode only (allows previewing other roles while building)
  const [editModePreviewRole, setEditModePreviewRole] = useState<'vp' | 'site-manager' | 'supervisor'>(
    convertedUserRole
  );

  // Determine which role to use for rendering
  const activeRole = isPreviewMode ? convertedUserRole : editModePreviewRole;

  // Helper function to check if a section is visible to a role
  const isSectionVisibleToRole = (section: DashboardSection, role: 'vp' | 'site-manager' | 'supervisor'): boolean => {
    const userRoleMapping: Record<'vp' | 'site-manager' | 'supervisor', UserRole> = {
      'vp': 'executive',
      'site-manager': 'site-manager',
      'supervisor': 'supervisor',
    };
    
    const currentUserRole = userRoleMapping[role];
    
    // Determine effective roles for this section
    const effectiveRoles = section.useDefaultVisibility !== false 
      ? (dashboard.visibleToRoles || ALL_ROLES)
      : (section.visibleToRoles || ALL_ROLES);
    
    return effectiveRoles.includes(currentUserRole);
  };

  // Filter sections based on role visibility in preview mode
  const visibleSections = isPreviewMode 
    ? dashboard.sections.filter(section => isSectionVisibleToRole(section, activeRole))
    : dashboard.sections;

  const handleAddSection = (type: DashboardSection['type']) => {
    const sectionDef = SECTION_DEFINITIONS.find((def) => def.type === type);
    if (!sectionDef) {
      toast.error('Section type not found');
      return;
    }

    // Create section with proper config based on type
    const newSection: DashboardSection = {
      id: `section-${Date.now()}`,
      type,
      title: sectionDef.label,
      columnSpan: 2, // Default to 2 columns (50% width)
      config: {},
    };

    // Add default config for KPI cards
    if (type === 'kpi-cards') {
      (newSection as any).kpiCards = [
        {
          id: 'card-1',
          label: 'Total Performance',
          dataSource: 'system',
          systemMetric: 'avg-performance',
          icon: 'trophy',
          trend: 'up',
          trendValue: '+5.2%',
        },
        {
          id: 'card-2',
          label: 'Total Hours',
          dataSource: 'system',
          systemMetric: 'total-hours',
          icon: 'clock',
          trend: 'up',
          trendValue: '+2.1%',
        },
        {
          id: 'card-3',
          label: 'Active Staff',
          dataSource: 'system',
          systemMetric: 'active-staff',
          icon: 'activity',
          trend: 'neutral',
          trendValue: '0%',
        },
        {
          id: 'card-4',
          label: 'Efficiency Rate',
          dataSource: 'system',
          systemMetric: 'efficiency-rate',
          icon: 'zap',
          trend: 'up',
          trendValue: '+3.4%',
        },
      ];
    }

    setDashboard({
      ...dashboard,
      sections: [...dashboard.sections, newSection],
    });
    
    // Set newly added section ID for animation
    setNewlyAddedSectionId(newSection.id);
    // Reset after animation completes
    setTimeout(() => setNewlyAddedSectionId(null), 1000);
  };

  // Bulk add sections in specified order
  const handleAddDefaultSections = () => {
    const sectionTypes: DashboardSection['type'][] = [
      'top-tasks',
      'kpi-cards',
      'trend-chart',
      'hierarchical-performance',
      'hours-chart',
      'rankings',
      'budget-tracking',
      'site-map',
      'task-distribution-pie',
    ];

    const newSections: DashboardSection[] = [];
    let timestamp = Date.now();

    sectionTypes.forEach((type, index) => {
      const sectionDef = SECTION_DEFINITIONS.find((def) => def.type === type);
      if (!sectionDef) return;

      const newSection: DashboardSection = {
        id: `section-${timestamp + index}`,
        type,
        title: sectionDef.label,
        columnSpan: 2, // Default to 2 columns (50% width)
        config: {},
      };

      // Add default config for KPI cards
      if (type === 'kpi-cards') {
        (newSection as any).kpiCards = [
          {
            id: 'card-1',
            label: 'Total Performance',
            dataSource: 'system',
            systemMetric: 'avg-performance',
            icon: 'trophy',
            trend: 'up',
            trendValue: '+5.2%',
          },
          {
            id: 'card-2',
            label: 'Total Hours',
            dataSource: 'system',
            systemMetric: 'total-hours',
            icon: 'clock',
            trend: 'up',
            trendValue: '+2.1%',
          },
          {
            id: 'card-3',
            label: 'Active Staff',
            dataSource: 'system',
            systemMetric: 'active-staff',
            icon: 'activity',
            trend: 'neutral',
            trendValue: '0%',
          },
          {
            id: 'card-4',
            label: 'Efficiency Rate',
            dataSource: 'system',
            systemMetric: 'efficiency-rate',
            icon: 'zap',
            trend: 'up',
            trendValue: '+3.4%',
          },
        ];
      }

      newSections.push(newSection);
    });

    setDashboard({
      ...dashboard,
      sections: [...dashboard.sections, ...newSections],
    });

    toast.success(`Added ${newSections.length} sections`);
  };

  const handleMoveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setDashboard((prevDashboard) => {
      const newSections = [...prevDashboard.sections];
      const [draggedSection] = newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      return {
        ...prevDashboard,
        sections: newSections,
      };
    });
  }, []);

  const handleUpdateWidth = (sectionId: string, width: 1 | 2 | 3 | 4) => {
    setDashboard({
      ...dashboard,
      sections: dashboard.sections.map((s) =>
        s.id === sectionId ? { ...s, columnSpan: width } : s
      ),
    });
  };

  const handleUpdateVisibility = (sectionId: string, roles: UserRole[] | undefined, useDefault: boolean) => {
    setDashboard({
      ...dashboard,
      sections: dashboard.sections.map((s) =>
        s.id === sectionId 
          ? { 
              ...s, 
              visibleToRoles: useDefault ? undefined : roles,
              useDefaultVisibility: useDefault
            } 
          : s
      ),
    });
  };

  const handleDuplicate = (sectionId: string) => {
    const section = dashboard.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newSection: DashboardSection = {
      ...section,
      id: `section-${Date.now()}`,
      title: `${section.title} (Copy)`,
    };

    // Find the index of the original section
    const sectionIndex = dashboard.sections.findIndex((s) => s.id === sectionId);
    
    // Insert the cloned section right after the original
    const newSections = [...dashboard.sections];
    newSections.splice(sectionIndex + 1, 0, newSection);

    setDashboard({
      ...dashboard,
      sections: newSections,
    });
  };

  const handleRemove = (sectionId: string) => {
    const section = dashboard.sections.find((s) => s.id === sectionId);
    const sectionTitle = section?.title || 'Section';
    
    setDashboard({
      ...dashboard,
      sections: dashboard.sections.filter((s) => s.id !== sectionId),
    });
    
    // Show toast notification
    toast.info(`Removed \"${sectionTitle}\"`);
  };

  // NEW: Handle KPI Cards configuration
  const handleConfigureKPICards = (sectionId: string, selectedMetrics: string[]) => {
    const section = dashboard.sections.find((s) => s.id === sectionId);
    if (!section || section.type !== 'kpi-cards') return;

    // Map of metric IDs to default config
    const metricDefaults: Record<string, { label: string; icon: string; trend: string; trendValue: string; }> = {
      'avg-performance': { label: 'Total Performance', icon: 'trophy', trend: 'up', trendValue: '+5.2%' },
      'total-hours': { label: 'Total Hours', icon: 'clock', trend: 'up', trendValue: '+2.1%' },
      'active-staff': { label: 'Active Staff', icon: 'users', trend: 'neutral', trendValue: '0%' },
      'efficiency-rate': { label: 'Efficiency Rate', icon: 'zap', trend: 'up', trendValue: '+3.4%' },
      'revenue': { label: 'Revenue', icon: 'dollar-sign', trend: 'up', trendValue: '+12.5%' },
      'cost-savings': { label: 'Cost Savings', icon: 'trending-down', trend: 'up', trendValue: '+8.3%' },
      'completion-rate': { label: 'Completion Rate', icon: 'check-circle', trend: 'up', trendValue: '+4.1%' },
      'quality-score': { label: 'Quality Score', icon: 'award', trend: 'up', trendValue: '+2.0%' },
      'tasks-completed': { label: 'Tasks Completed', icon: 'check-square', trend: 'up', trendValue: '+15' },
    };

    // Create new KPI cards array based on selected metrics
    const newKpiCards = selectedMetrics.map((metricId, index) => {
      const defaults = metricDefaults[metricId] || { label: metricId, icon: 'activity', trend: 'neutral', trendValue: '0%' };
      return {
        id: `card-${index + 1}`,
        label: defaults.label,
        dataSource: 'system',
        systemMetric: metricId,
        icon: defaults.icon,
        trend: defaults.trend,
        trendValue: defaults.trendValue,
      };
    });

    // Update the section with new KPI cards
    setDashboard({
      ...dashboard,
      sections: dashboard.sections.map((s) =>
        s.id === sectionId
          ? { ...s, kpiCards: newKpiCards }
          : s
      ),
    });

    // Show toast notification
    toast.success(`Updated KPI metrics (${selectedMetrics.length} selected)`);
  };

  const handleReorderSections = (reorderedDefinitions: typeof SECTION_DEFINITIONS) => {
    setSectionDefinitions(reorderedDefinitions);
  };

  const handleSave = () => {
    if (!dashboard.name.trim()) {
      toast.error('Dashboard name is required');
      return;
    }
    if (dashboard.sections.length === 0) {
      toast.error('Add at least one section to your dashboard');
      return;
    }
    onSave(dashboard);
    toast.success(initialDashboard ? 'Dashboard updated' : 'Dashboard saved');
  };



  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        style={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-background)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Unified Control Bar - Single line with all controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: 'var(--spacing-4)',
            gap: 'var(--spacing-3)',
          }}>
            {/* Left side controls - Data filters first, then mode-specific controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap', flex: 1 }}>
              {/* Date Range Picker - matches View mode order */}
              <ModernDateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onDateChange={(start, end) => setDateRange({ start, end })}
              />
              
              {/* Quick preset buttons - matches View mode order */}
              <button
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(end.getDate() - 7);
                  setDateRange({ start, end });
                }}
                style={{
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-family-inter)',
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-muted)'}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(end.getDate() - 30);
                  setDateRange({ start, end });
                }}
                style={{
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-family-inter)',
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-muted)'}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(end.getDate() - 90);
                  setDateRange({ start, end });
                }}
                style={{
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-family-inter)',
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-foreground)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-muted)'}
              >
                Last 90 Days
              </button>

              {/* Underperforming Switch - matches View mode order */}
              <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <Switch
                  id="underperforming"
                  checked={showUnderperforming}
                  onCheckedChange={setShowUnderperforming}
                />
                <Label 
                  htmlFor="underperforming" 
                  style={{ 
                    cursor: 'pointer',
                    fontSize: 'var(--text-label)',
                    fontFamily: 'var(--font-family-inter)',
                    color: 'var(--color-foreground)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Show Underperforming
                </Label>
              </div>

              {/* Mode-specific controls - Edit/Preview mode only */}
              <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />
              
              {/* Mode Switch - Edit/Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <Label 
                  htmlFor="mode-switch" 
                  style={{
                    fontFamily: 'var(--font-family-inter)',
                    fontSize: 'var(--text-label)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
                </Label>
                <Switch
                  id="mode-switch"
                  checked={isPreviewMode}
                  onCheckedChange={setIsPreviewMode}
                />
              </div>

              {/* Role Selector - Only in edit mode */}
              {!isPreviewMode && (
                <>
                  <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <User size={16} style={{ color: 'var(--color-muted-foreground)' }} />
                    <Select size="sm" value={editModePreviewRole} onValueChange={(value: any) => setEditModePreviewRole(value)}>
                      <SelectTrigger className="select-compact">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vp">Executive</SelectItem>
                        <SelectItem value="site-manager">Site Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Right side - Cancel and Save/Update buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!dashboard.name || dashboard.sections.length === 0}>
                <Save size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                {initialDashboard ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          style={{ 
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-6)',
            backgroundColor: 'var(--color-muted)',
          }}
        >
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {/* Dashboard Info - Edit Mode */}
            {!isPreviewMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                <Input
                  value={dashboard.name}
                  onChange={(e) => setDashboard({ ...dashboard, name: e.target.value })}
                  placeholder="Dashboard Name *"
                  style={{
                    backgroundColor: 'var(--color-card)',
                  }}
                />
                <Input
                  value={dashboard.description}
                  onChange={(e) => setDashboard({ ...dashboard, description: e.target.value })}
                  placeholder="Description (optional)"
                  style={{
                    backgroundColor: 'var(--color-card)',
                  }}
                />
                
                {/* Dashboard-Level Role Visibility */}
                <Card className="card-content-padded-compact">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', padding: 'var(--spacing-4)' }}>
                    <h4>
                      Dashboard Visibility (Default for all sections)
                    </h4>
                    <p style={{ 
                      fontFamily: 'var(--font-family-inter)', 
                      color: 'var(--color-muted-foreground)',
                      fontSize: '0.875rem'
                    }}>
                      Select which roles can view this dashboard. Leave unchecked for all roles.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      {ALL_ROLES.map(role => (
                        <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <Checkbox
                            id={`dashboard-role-${role}`}
                            checked={dashboard.visibleToRoles?.includes(role) ?? true}
                            onCheckedChange={(checked) => {
                              const currentRoles = dashboard.visibleToRoles || ALL_ROLES;
                              let newRoles: UserRole[];
                              if (checked) {
                                newRoles = [...new Set([...currentRoles, role])];
                              } else {
                                newRoles = currentRoles.filter(r => r !== role);
                              }
                              setDashboard({ 
                                ...dashboard, 
                                visibleToRoles: newRoles.length === ALL_ROLES.length ? undefined : newRoles
                              });
                            }}
                          />
                          <Label 
                            htmlFor={`dashboard-role-${role}`}
                            style={{ 
                              fontFamily: 'var(--font-family-inter)',
                              color: 'var(--color-foreground)',
                              cursor: 'pointer'
                            }}
                          >
                            {ROLE_LABELS[role]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Dashboard Title - Preview Mode */}
            {isPreviewMode && dashboard.name && (
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h2 style={{ 
                  fontFamily: 'var(--font-family-inter)',
                  color: 'var(--color-foreground)',
                  marginBottom: dashboard.description ? 'var(--spacing-2)' : '0'
                }}>
                  {dashboard.name}
                </h2>
                {dashboard.description && (
                  <p style={{ 
                    fontFamily: 'var(--font-family-inter)',
                    color: 'var(--color-muted-foreground)',
                  }}>
                    {dashboard.description}
                  </p>
                )}
              </div>
            )}

            {/* Sections Grid */}
            {visibleSections.length === 0 ? (
              <Card className="card-content-empty-state-padded">
                <div
                  style={{
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-muted)',
                    marginBottom: 'var(--spacing-4)',
                  }}
                >
                  <Plus size={32} style={{ color: 'var(--color-muted-foreground)' }} />
                </div>
                {isPreviewMode && !dashboard.name ? (
                  <>
                    <h3 style={{ 
                      fontFamily: 'var(--font-family-inter)',
                      color: 'var(--color-foreground)', 
                      marginBottom: 'var(--spacing-2)' 
                    }}>
                      No Dashboard Selected
                    </h3>
                    <p style={{ 
                      fontFamily: 'var(--font-family-inter)',
                      color: 'var(--color-muted-foreground)', 
                      marginBottom: 'var(--spacing-4)',
                      textAlign: 'center'
                    }}>
                      Select a dashboard from Your Dashboards or create a new one to get started
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ 
                      fontFamily: 'var(--font-family-inter)',
                      color: 'var(--color-muted-foreground)', 
                      marginBottom: 'var(--spacing-4)' 
                    }}>
                      No sections added yet
                    </p>
                    {!isPreviewMode && (
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button variant="outline" onClick={handleAddDefaultSections}>
                          <Plus size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                          Add All Sections
                        </Button>
                        <Button onClick={() => setIsSidebarOpen(true)}>
                          <Plus size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                          Add First Section
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridAutoRows: 'min-content',
                  gap: 'var(--grid-gap)',
                  transition: 'all 200ms ease-out',
                }}
              >
                {visibleSections.map((section, index) => (
                  <MemoizedDraggableSection
                    key={section.id}
                    section={section}
                    index={dashboard.sections.indexOf(section)}
                    moveSection={handleMoveSection}
                    onUpdateWidth={handleUpdateWidth}
                    onDuplicate={handleDuplicate}
                    onRemove={handleRemove}
                    onUpdateVisibility={handleUpdateVisibility}
                    onConfigureKPICards={handleConfigureKPICards}
                    onSectionClick={setSelectedSectionForInspector}
                    dashboardDefaultRoles={dashboard.visibleToRoles}
                    isPreviewMode={isPreviewMode}
                    userRole={activeRole}
                    externalFilters={{
                      startDate: dateRange.start,
                      endDate: dateRange.end,
                      showUnderperformingOnly: showUnderperforming,
                    }}
                    isNewlyAdded={section.id === newlyAddedSectionId}
                  />
                ))}
              </div>
            )}

            {/* Add Section FAB - Fixed position, only in edit mode */}
            {!isPreviewMode && dashboard.sections.length > 0 && (
              <>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  style={{
                    position: 'fixed',
                    bottom: '32px',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-elevation-lg)',
                    transition: 'right 0.3s ease, transform var(--transition-default)',
                    right: isSidebarOpen ? '424px' : '32px',
                    width: '56px',
                    height: '56px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-primary-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                  }}
                >
                  <Plus size={24} />
                </button>
                
                {/* Reorder Sections Button */}
                <button
                  onClick={() => setIsReorderModalOpen(true)}
                  title="Reorder Sections"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  style={{
                    position: 'fixed',
                    bottom: '100px',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-elevation-lg)',
                    transition: 'right 0.3s ease, transform var(--transition-default)',
                    right: isSidebarOpen ? '424px' : '32px',
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-secondary-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowUpDown size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Add Section Sidebar */}
        {isSidebarOpen && !isPreviewMode && (
          <SectionSidebar
            isOpen={isSidebarOpen}
            sectionDefinitions={sectionDefinitions}
            onAddSection={handleAddSection}
            onReorderSections={handleReorderSections}
            currentSections={dashboard.sections}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Reorder Sections Modal */}
        <ReorderSectionsModal
          isOpen={isReorderModalOpen}
          sections={dashboard.sections}
          onClose={() => setIsReorderModalOpen(false)}
          onReorder={(reorderedSections) => {
            setDashboard({
              ...dashboard,
              sections: reorderedSections,
            });
            toast.success('Sections reordered');
          }}
        />
      </div>
    </DndProvider>
  );
}