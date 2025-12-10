import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from './design-system/Button';
import { Card, CardDescription, CardTitle } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Switch } from './design-system/Switch';
import { Label } from './design-system/Label';
import { PageContainer } from './design-system/PageContainer';
import { PageHeader } from './design-system/PageHeader';
import { LogOut, Plus, Edit, Eye, Calendar, User as UserIcon, LayoutDashboard, CheckCircle, Clock, Settings, Bell, Database, Star, Copy, Trash2, Grid3x3, List, Paintbrush, FileText, ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { ModernDashboardBuilder } from './ModernDashboardBuilder';
import { DashboardRenderer } from './DashboardRenderer';
import { DataInputFlow } from './DataInputFlow';
import { AlertsManagement } from './AlertsManagement';
import { UnifiedSettingsAdmin } from './UnifiedSettingsAdmin';
import { ReportsHub } from './ReportsHub';
import { SetRoleDefaultDialog } from './SetRoleDefaultDialog';
import { ModernDateRangePicker } from './ModernDateRangePicker';
import { DashboardStructureDiagram } from './DashboardStructureDiagram';
import { DesignSystemEditor } from './DesignSystemEditor'; // Add import
import { User } from '../App';
import { UserRole, DashboardDefinition, DashboardSection, saveDashboard, getAllCustomDashboards, deleteDashboard } from '../lib/mockData';
import { getUserSettings, setDefaultDashboard, setRoleBasedDefaultDashboard, getRolesForDefaultDashboard, getRoleBasedDefaultDashboard } from '../lib/userSettings';
import { toast } from 'sonner';

interface MainAppProps {
  user: User;
  onLogout: () => void;
}

type ViewState = 'list' | 'edit' | 'preview' | 'view' | 'data-input' | 'reports' | 'alerts' | 'settings' | 'structure';
type DashboardViewMode = 'tiles' | 'list';

// View Mode Component with Control Bar
interface ViewModeWithControlsProps {
  dashboard: DashboardDefinition;
  userRole: UserRole;
  user: User;
  onEditDashboard: (dashboard: DashboardDefinition) => void;
}

function ViewModeWithControls({ dashboard, userRole, user, onEditDashboard }: ViewModeWithControlsProps) {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [showUnderperforming, setShowUnderperforming] = useState(false);

  return (
    <div className="ds-relative">
      {/* Control Bar */}
      <div
        className="ds-flex-col ds-border-b ds-bg-card ds-mb-6"
        style={{
          borderRadius: 'var(--radius)',
        }}
      >
        {/* Primary Control Bar - Date range and filters */}
        <div className="ds-flex ds-items-center ds-justify-between ds-p-4">
          <div className="ds-flex ds-items-center ds-gap-3 ds-flex-wrap">
            {/* Date Range Picker */}
            <ModernDateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onDateChange={(start, end) => setDateRange({ start, end })}
            />
            
            {/* Quick preset buttons */}
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

            {/* Underperforming Switch */}
            <div className="ds-h-6 ds-w-px ds-bg-border" />
            <div className="ds-flex ds-items-center ds-gap-2">
              <Switch
                id="underperforming-view"
                checked={showUnderperforming}
                onCheckedChange={setShowUnderperforming}
              />
              <Label 
                htmlFor="underperforming-view" 
                className="ds-cursor-pointer ds-whitespace-nowrap"
              >
                Show Underperforming
              </Label>
            </div>
          </div>

          {/* Edit Button & Layer Inspector Hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <Button 
              size="sm"
              onClick={() => onEditDashboard(dashboard)}
            >
              <Edit size={16} className="ds-mr-2" />
              Edit Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      {/* Clean Dashboard Render */}
      <DashboardRenderer
        dashboard={dashboard}
        siteId={userRole === 'site-manager' ? user.siteId : undefined}
        jobFunctionId={userRole === 'supervisor' ? user.jobFunctionId : undefined}
        allowEditing={false}
        showTitle={true}
        builderMode={false}
        hideDescription={false}
        externalFilters={{
          startDate: dateRange.start,
          endDate: dateRange.end,
          showUnderperformingOnly: showUnderperforming
        }}
      />
    </div>
  );
}

export function MainApp({ user, onLogout }: MainAppProps) {
  // Define userRole first so it can be used in state initialization
  const userRole = user.role as UserRole;
  
  const [viewState, setViewState] = useState<ViewState>('list');
  const [dashboardToEdit, setDashboardToEdit] = useState<DashboardDefinition | null>(null);
  
  // DEBUG: Load dashboards with extensive logging
  const loadedDashboards = getAllCustomDashboards();
  console.log('🔍 MainApp: getAllCustomDashboards() returned:', loadedDashboards);
  console.log('🔍 MainApp: Dashboard count:', loadedDashboards.length);
  console.log('🔍 MainApp: Dashboard IDs:', loadedDashboards.map(d => d.id));
  console.log('🔍 MainApp: d-1 present?', loadedDashboards.some(d => d.id === 'd-1'));
  
  const [dashboards, setDashboards] = useState<DashboardDefinition[]>(loadedDashboards);
  const [defaultDashboardId, setDefaultDashboardId] = useState<string | undefined>(() => {
    // Check user-specific default first, then fall back to role-based default
    const userDefault = getUserSettings(user.id)?.dashboard.defaultDashboard;
    if (userDefault) return userDefault;
    
    // Use role-based default if available
    const roleDefault = getRoleBasedDefaultDashboard(userRole);
    return roleDefault;
  });
  const [dashboardViewMode, setDashboardViewMode] = useState<DashboardViewMode>('tiles');
  
  // Reports Hub state - track when viewing a report
  const [reportsHubViewMode, setReportsHubViewMode] = useState<'list' | 'view'>('list');
  const [reportsHubRefreshTrigger, setReportsHubRefreshTrigger] = useState(0);
  
  // Design System Editor state
  const [showDesignSystemEditor, setShowDesignSystemEditor] = useState(false);
  
  // Role-based default dashboard dialog state
  const [roleDefaultDialog, setRoleDefaultDialog] = useState<{
    isOpen: boolean;
    dashboardId: string;
    dashboardName: string;
  } | null>(null);

  // Auto-navigate to default dashboard on initial load
  useEffect(() => {
    // First, check for a role-based default dashboard
    const roleDefault = getRoleBasedDefaultDashboard(userRole);
    
    if (roleDefault) {
      const defaultDashboard = dashboards.find(d => d.id === roleDefault);
      if (defaultDashboard) {
        setDashboardToEdit(defaultDashboard);
        setViewState('view');
        console.log(`📋 Showing default dashboard "${defaultDashboard.name}" on login`);
        return;
      }
    }
    
    // Fallback to list view if no default dashboard is set
    setViewState('list');
    setDashboardToEdit(null);
    console.log('📋 No default dashboard set, showing Your Dashboards list');
  }, []); // Empty dependency array to run only once on mount

  // Keyboard shortcut to open structure diagram (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setViewState('structure');
        console.log('📊 Opening Dashboard Structure Diagram');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateNew = () => {
    setDashboardToEdit(null);
    setViewState('edit');
  };

  const handleEditDashboard = (dashboard: DashboardDefinition) => {
    setDashboardToEdit(dashboard);
    setViewState('edit');
  };

  const handlePreviewDashboard = (dashboard: DashboardDefinition) => {
    setDashboardToEdit(dashboard);
    setViewState('preview');
  };

  const handleViewDashboard = (dashboard: DashboardDefinition) => {
    setDashboardToEdit(dashboard);
    setViewState('view');
  };

  const handleSaveDashboard = (dashboard: DashboardDefinition) => {
    saveDashboard(dashboard);
    toast.success('Dashboard saved successfully!');
    setViewState('list');
    setDashboardToEdit(null);
    // Refresh dashboard list
    setDashboards(getAllCustomDashboards());
  };

  const handleCancelBuilder = () => {
    // If editing an existing dashboard, return to view mode
    // If creating new dashboard, return to list
    if (dashboardToEdit) {
      setViewState('view');
    } else {
      setViewState('list');
      setDashboardToEdit(null);
    }
  };

  const handleToggleDefaultDashboard = (dashboardId: string) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return;
    
    // Check if this dashboard already has role-based defaults
    const currentRoles = getRolesForDefaultDashboard(dashboardId);
    
    // Open dialog to select roles
    setRoleDefaultDialog({
      isOpen: true,
      dashboardId,
      dashboardName: dashboard.name
    });
  };
  
  const handleConfirmRoleDefault = (dashboardId: string, selectedRoles: UserRole[]) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return;
    
    // Set role-based default
    setRoleBasedDefaultDashboard(dashboardId, selectedRoles, user.id);
    
    // Update UI
    setDashboards([...dashboards]); // Force re-render
    
    if (selectedRoles.length > 0) {
      const roleNames = selectedRoles.map(r => {
        if (r === 'executive') return 'Executives';
        if (r === 'site-manager') return 'Site Managers';
        return 'Supervisors';
      }).join(', ');
      
      toast.success(`${dashboard.name} set as default for: ${roleNames}`);
    } else {
      toast.success('Role-based defaults cleared for this dashboard');
    }
  };

  const handleCloneDashboard = (dashboard: DashboardDefinition) => {
    // Generate new ID for the cloned dashboard
    const newId = `d-${Date.now()}`;
    
    // Create cloned dashboard with new ID and updated metadata
    const clonedDashboard: DashboardDefinition = {
      ...dashboard,
      id: newId,
      name: `${dashboard.name} (Copy)`,
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      // Clone sections with new IDs
      sections: dashboard.sections.map((section, index) => ({
        ...section,
        id: `sec-${newId}-${index + 1}`,
      })),
    };
    
    // Save the cloned dashboard
    saveDashboard(clonedDashboard);
    toast.success(`Dashboard "${dashboard.name}" cloned successfully!`);
    
    // Refresh dashboard list
    setDashboards(getAllCustomDashboards());
  };

  const handleDeleteDashboard = (dashboard: DashboardDefinition) => {
    // PROTECTION: Prevent deleting the protected d-1 dashboard
    if (dashboard.id === 'd-1') {
      toast.error('Cannot delete the protected "Supply Chain Overview" dashboard. This is a system default dashboard.');
      return;
    }
    
    // Prevent deleting if it's a role-based default dashboard
    const rolesUsingAsDefault = getRolesForDefaultDashboard(dashboard.id);
    if (rolesUsingAsDefault.length > 0) {
      const roleNames = rolesUsingAsDefault.map(r => {
        if (r === 'executive') return 'Executives';
        if (r === 'site-manager') return 'Site Managers';
        return 'Supervisors';
      }).join(', ');
      toast.error(`Cannot delete this dashboard. It's set as default for: ${roleNames}. Please change the default first.`);
      return;
    }
    
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${dashboard.name}"? This action cannot be undone.`)) {
      return;
    }
    
    // Delete the dashboard
    const success = deleteDashboard(dashboard.id);
    
    if (success) {
      toast.success(`Dashboard "${dashboard.name}" deleted successfully!`);
    } else {
      toast.error(`Failed to delete dashboard "${dashboard.name}".`);
    }
    
    // Refresh dashboard list
    setDashboards(getAllCustomDashboards());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="ds-min-h-screen ds-bg-background">
        {/* Header */}
        <header className="ds-bg-card ds-sticky ds-top-0 ds-border-b" style={{ zIndex: 1000 }}>
          {/* Navigation Bar - Now visible in all screens */}
          <div className="ds-py-2 ds-px-4">
              <div className="ds-flex-between ds-gap-2 ds-w-full">
                {/* Left Side: Quick Preview Tabs + Main Navigation */}
                <div className="ds-flex ds-items-center ds-gap-2">
                  {/* Home Button - Navigate to default dashboard */}
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const roleDefault = getRoleBasedDefaultDashboard(userRole);
                      if (roleDefault) {
                        const defaultDashboard = dashboards.find(d => d.id === roleDefault);
                        if (defaultDashboard) {
                          handleViewDashboard(defaultDashboard);
                        } else {
                          // Default dashboard not found, go to list
                          setViewState('list');
                          setDashboardToEdit(null);
                        }
                      } else {
                        // No default set, go to dashboards list
                        setViewState('list');
                        setDashboardToEdit(null);
                      }
                    }}
                    title={(() => {
                      const roleDefault = getRoleBasedDefaultDashboard(userRole);
                      if (roleDefault) {
                        const defaultDashboard = dashboards.find(d => d.id === roleDefault);
                        return defaultDashboard ? `Home - ${defaultDashboard.name}` : 'Home';
                      }
                      return 'Home - Your Dashboards';
                    })()}
                  >
                    <Home size={16} />
                  </Button>
                  
                  {/* Quick Access Preview Dropdown */}
                  <Select
                    size="sm"
                    value={dashboardToEdit?.id || ""}
                    onValueChange={(value) => {
                      const dashboard = dashboards.find(d => d.id === value);
                      if (dashboard) {
                        handleViewDashboard(dashboard);
                      }
                    }}
                  >
                    <SelectTrigger 
                      style={{ 
                        width: '240px',
                        gap: 'var(--spacing-2)',
                        height: '36px'
                      }}
                    >
                      <Eye size={16} />
                      <SelectValue placeholder="Select Dashboard" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        if (dashboards.length === 0) {
                          return (
                            <SelectItem value="__no_dashboards__" disabled>
                              No dashboards available
                            </SelectItem>
                          );
                        }
                        
                        // Sort dashboards: role-based default first, then alphabetically
                        const roleDefault = getRoleBasedDefaultDashboard(userRole);
                        const sortedDashboards = [...dashboards].sort((a, b) => {
                          if (a.id === roleDefault) return -1;
                          if (b.id === roleDefault) return 1;
                          return a.name.localeCompare(b.name);
                        });
                        
                        // Check if we should show "Currently Viewing" at the top
                        const showCurrentlyViewing = dashboardToEdit && 
                          viewState !== 'list' && 
                          viewState !== 'view' && 
                          viewState !== 'edit' && 
                          viewState !== 'preview';
                        
                        const items = [];
                        
                        // Add "Currently Viewing" section
                        if (showCurrentlyViewing) {
                          items.push(
                            <SelectItem 
                              key="__currently_viewing__"
                              value={dashboardToEdit.id}
                            >
                              ✓ {dashboardToEdit.name} (viewing)
                            </SelectItem>
                          );
                        }
                        
                        // Add all other dashboards
                        sortedDashboards.forEach((dashboard) => {
                          const isRoleDefault = dashboard.id === roleDefault;
                          const isCurrentlyViewing = dashboardToEdit?.id === dashboard.id && showCurrentlyViewing;
                          
                          // Don't show the currently viewing dashboard again
                          if (isCurrentlyViewing) return;
                          
                          items.push(
                            <SelectItem key={dashboard.id} value={dashboard.id}>
                              {dashboard.name}{isRoleDefault ? ' ⭐' : ''}
                            </SelectItem>
                          );
                        });
                        
                        return items;
                      })()}
                    </SelectContent>
                  </Select>
                  
                  {/* Data Input - Always visible */}
                  <Button 
                    variant="destructive"
                    onClick={() => setViewState('data-input')}
                    title="Data Input & Integration"
                    style={{ 
                      paddingLeft: 'var(--spacing-3)',
                      paddingRight: 'var(--spacing-3)'
                    }}
                  >
                    <span className="ds-whitespace-nowrap">Data Input</span>
                  </Button>
                </div>

                {/* Right Side: Icon-only buttons */}
                <div className="ds-flex ds-items-center ds-gap-2">
                  
                  {/* Dashboards - Icon with hover expansion */}
                  <div 
                    className="ds-relative"
                    onMouseEnter={(e) => {
                      const element = e.currentTarget;
                      const timeoutId = setTimeout(() => {
                        const span = element.querySelector('span[data-expandable]') as HTMLElement;
                        if (span) {
                          span.style.opacity = '1';
                          span.style.maxWidth = '200px';
                        }
                      }, 200);
                      (element as any)._hoverTimeout = timeoutId;
                    }}
                    onMouseLeave={(e) => {
                      const element = e.currentTarget;
                      if ((element as any)._hoverTimeout) {
                        clearTimeout((element as any)._hoverTimeout);
                      }
                      const span = element.querySelector('span[data-expandable]') as HTMLElement;
                      if (span) {
                        span.style.opacity = '0';
                        span.style.maxWidth = '0';
                      }
                    }}
                  >
                    <Button 
                      variant="ghost"
                      onClick={() => setViewState('list')}
                      title="Your Dashboards"
                      style={{ 
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all var(--transition-default)',
                        gap: 'var(--spacing-2)',
                        paddingLeft: 'var(--spacing-3)',
                        paddingRight: 'var(--spacing-3)',
                        color: viewState === 'list' ? 'var(--primary)' : undefined
                      }}
                    >
                      <LayoutDashboard size={16} className="ds-flex-shrink-0" />
                      <span 
                        data-expandable="true"
                        style={{ 
                          fontFamily: 'var(--font-family-inter)',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                          maxWidth: 0,
                          transition: 'all var(--transition-default)',
                          overflow: 'hidden',
                          marginLeft: '0'
                        }}
                      >
                        <span className="ds-ml-2">Dashboards</span>
                      </span>
                    </Button>
                  </div>
                  
                  {/* Reports - Icon only */}
                  <div 
                    className="ds-relative"
                    onMouseEnter={(e) => {
                      const element = e.currentTarget;
                      const timeoutId = setTimeout(() => {
                        const span = element.querySelector('span[data-expandable]') as HTMLElement;
                        if (span) {
                          span.style.opacity = '1';
                          span.style.maxWidth = '200px';
                        }
                      }, 200);
                      (element as any)._hoverTimeout = timeoutId;
                    }}
                    onMouseLeave={(e) => {
                      const element = e.currentTarget;
                      if ((element as any)._hoverTimeout) {
                        clearTimeout((element as any)._hoverTimeout);
                      }
                      const span = element.querySelector('span[data-expandable]') as HTMLElement;
                      if (span) {
                        span.style.opacity = '0';
                        span.style.maxWidth = '0';
                      }
                    }}
                  >
                    <Button 
                      variant="ghost"
                      onClick={() => setViewState('reports')}
                      title="Reports"
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all var(--transition-default)',
                        gap: 'var(--spacing-2)',
                        paddingLeft: 'var(--spacing-3)',
                        paddingRight: 'var(--spacing-3)',
                        color: viewState === 'reports' ? 'var(--primary)' : undefined
                      }}
                    >
                      <FileText size={16} className="ds-flex-shrink-0" />
                      <span 
                        data-expandable="true"
                        style={{ 
                          fontFamily: 'var(--font-family-inter)',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                          maxWidth: 0,
                          transition: 'all var(--transition-default)',
                          overflow: 'hidden',
                          marginLeft: '0'
                        }}
                      >
                        <span className="ds-ml-2">Reports</span>
                      </span>
                    </Button>
                  </div>

                  {/* Alerts - Icon only */}
                  <Button 
                    variant="ghost"
                    onClick={() => setViewState('alerts')}
                    size="icon"
                    title="Alerts"
                    style={{
                      color: viewState === 'alerts' ? 'var(--primary)' : undefined
                    }}
                  >
                    <Bell size={16} />
                  </Button>

                  {/* Settings & Admin - Icon only */}
                  <Button 
                    variant="ghost"
                    onClick={() => setViewState('settings')}
                    size="icon"
                    title="Settings & Administration"
                    style={{
                      color: viewState === 'settings' ? 'var(--primary)' : undefined
                    }}
                  >
                    <Settings size={16} />
                  </Button>

                  {/* Design System Editor - Icon only */}
                  <Button 
                    variant="ghost"
                    onClick={() => setShowDesignSystemEditor(true)}
                    size="icon"
                    title="Design System Editor"
                    style={{
                      color: showDesignSystemEditor ? 'var(--primary)' : undefined
                    }}
                  >
                    <Paintbrush size={16} />
                  </Button>

                  {/* Logout - Icon only */}
                  <Button 
                    variant="ghost"
                    onClick={onLogout}
                    size="icon"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </div>
            </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: 'var(--spacing-6)', position: 'relative' }}>
          {/* Back button for Reports View */}
          {viewState === 'reports' && reportsHubViewMode === 'view' && (
            <Button 
              variant="ghost" 
              onClick={() => setReportsHubViewMode('list')}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                paddingLeft: 'var(--spacing-6)',
                paddingTop: '0',
                paddingBottom: '0',
                paddingRight: '0',
                margin: '0',
                zIndex: 10
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
              Back
            </Button>
          )}
          
          {viewState === 'list' ? (
            // Dashboard List View
            <PageContainer>
              {dashboards.length === 0 ? (
                // Empty State
                <div className="ds-container-empty-state">
                  <div className="ds-container-empty-content">
                    <div className="ds-heading-welcome">
                      Welcome to Dashboard Builder
                    </div>
                    <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-6)' }}>
                      Create custom dashboards with sections for metrics, charts, and performance tracking. 
                      Click "New Dashboard" to start building your first dashboard.
                    </p>
                    <Button size="lg" onClick={handleCreateNew}>
                      <Plus size={20} style={{ marginRight: 'var(--spacing-2)' }} />
                      Create Your First Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <PageHeader
                    title="Your Dashboards"
                    description="Manage and organize all your dashboards"
                  >
                    {/* View Mode Toggle */}
                    <div className="ds-view-toggle">
                      <Button 
                        onClick={() => setDashboardViewMode('tiles')}
                        variant="ghost"
                        size="sm"
                        style={{
                          backgroundColor: dashboardViewMode === 'tiles' ? 'var(--background)' : 'transparent',
                          color: dashboardViewMode === 'tiles' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        }}
                        title="Tile view"
                      >
                        <Grid3x3 size={16} />
                      </Button>
                      <Button 
                        onClick={() => setDashboardViewMode('list')}
                        variant="ghost"
                        size="sm"
                        style={{
                          backgroundColor: dashboardViewMode === 'list' ? 'var(--background)' : 'transparent',
                          color: dashboardViewMode === 'list' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        }}
                        title="List view"
                      >
                        <List size={16} />
                      </Button>
                    </div>
                    <Button onClick={handleCreateNew}>
                      <Plus size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                      New Dashboard
                    </Button>
                  </PageHeader>

                  {/* Tile View */}
                  {dashboardViewMode === 'tiles' ? (
                    <div className="ds-grid-tiles" style={{ marginTop: 'var(--spacing-6)' }}>
                      {dashboards.map((dashboard) => (
                        <Card key={dashboard.id} className="ds-dashboard-tile">
                          {/* Title and Badge Row */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <h3 className="heading-section">{dashboard.name}</h3>
                            {(() => {
                              const rolesWithDefault = getRolesForDefaultDashboard(dashboard.id);
                              if (rolesWithDefault.length > 0) {
                                return (
                                  <Badge 
                                    variant="outline"
                                    title={`Default for: ${rolesWithDefault.join(', ')}`}
                                  >
                                    <Star size={12} style={{ marginRight: 'var(--spacing-1)' }} fill="currentColor" />
                                    Default
                                  </Badge>
                                );
                              }
                              return null;
                            })()}
                          </div>

                          {/* Description */}
                          {dashboard.description && (
                            <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>{dashboard.description}</p>
                          )}

                          {/* Dashboard Metadata */}
                          <div className="ds-dashboard-metadata">
                            <div className="ds-dashboard-meta-group mt-4">
                              <div className="ds-dashboard-meta-item">
                                <UserIcon size={16} style={{ color: 'var(--muted-foreground)' }} />
                                <span className="ds-dashboard-meta-text">
                                  {dashboard.createdBy}
                                </span>
                              </div>
                              <div className="ds-dashboard-meta-item">
                                <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
                                <span className="ds-dashboard-meta-text">
                                  {formatDate(dashboard.updatedAt || dashboard.createdAt)}
                                </span>
                                <span className="ds-dashboard-meta-text" style={{ marginLeft: 'var(--spacing-2)' }}>
                                  • {dashboard.sections.length} {dashboard.sections.length === 1 ? 'section' : 'sections'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Access Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)' }}>
                              <Button 
                                onClick={() => handleToggleDefaultDashboard(dashboard.id)}
                                variant={getRolesForDefaultDashboard(dashboard.id).length > 0 ? "default" : "outline"}
                                size="icon"
                                title={getRolesForDefaultDashboard(dashboard.id).length > 0 
                                  ? `Default for: ${getRolesForDefaultDashboard(dashboard.id).join(', ')}` 
                                  : "Set as default for roles"}
                                style={{
                                  backgroundColor: getRolesForDefaultDashboard(dashboard.id).length > 0 ? 'var(--color-warning)' : undefined,
                                  borderColor: getRolesForDefaultDashboard(dashboard.id).length > 0 ? 'var(--color-warning)' : undefined,
                                  color: getRolesForDefaultDashboard(dashboard.id).length > 0 ? 'white' : undefined
                                }}
                              >
                                {getRolesForDefaultDashboard(dashboard.id).length > 0 ? (
                                  <Star size={16} fill="currentColor" />
                                ) : (
                                  <Star size={16} />
                                )}
                              </Button>
                              <Button 
                                onClick={() => handleCloneDashboard(dashboard)}
                                variant="outline"
                                size="icon"
                                title="Clone dashboard"
                              >
                                <Copy size={16} />
                              </Button>
                              <Button 
                                onClick={() => handleDeleteDashboard(dashboard)}
                                variant="outline"
                                size="icon"
                                title={dashboard.id === 'd-1' ? 'Cannot delete protected dashboard' : 'Delete dashboard'}
                                disabled={dashboard.id === 'd-1'}
                                style={{
                                  color: dashboard.id === 'd-1' ? 'var(--muted-foreground)' : 'var(--destructive)',
                                  cursor: dashboard.id === 'd-1' ? 'not-allowed' : 'pointer',
                                  opacity: dashboard.id === 'd-1' ? 0.5 : 1
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                              <Button 
                                onClick={() => handleEditDashboard(dashboard)}
                                style={{ flex: 1 }}
                                variant="default"
                              >
                                <Edit size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleViewDashboard(dashboard)}
                                style={{ flex: 1 }}
                                variant="outline"
                              >
                                <Eye size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    /* List View */
                    <div className="ds-list-container">
                      {dashboards.map((dashboard) => (
                        <Card key={dashboard.id} className="ds-dashboard-tile">
                          <div className="ds-list-item-content">
                            {/* Left side: Dashboard info */}
                            <div className="ds-list-item-info">
                              <div className="ds-list-item-details">
                                <div className="ds-list-item-title-row">
                                  <h3 className="ds-list-item-title">
                                    {dashboard.name}
                                  </h3>
                                  {(() => {
                                    const rolesWithDefault = getRolesForDefaultDashboard(dashboard.id);
                                    if (rolesWithDefault.length > 0) {
                                      return (
                                        <Badge 
                                          variant="outline"
                                          title={`Default for: ${rolesWithDefault.join(', ')}`}
                                        >
                                          <Star size={12} style={{ marginRight: 'var(--spacing-1)' }} fill="currentColor" />
                                          Default
                                        </Badge>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                                {dashboard.description && (
                                  <p className="ds-list-item-description">
                                    {dashboard.description}
                                  </p>
                                )}
                                <div className="ds-list-item-meta-row">
                                  <div className="ds-list-item-meta-item">
                                    <UserIcon size={12} style={{ color: 'var(--muted-foreground)' }} />
                                    <span className="ds-list-item-meta-text-sm">
                                      {dashboard.createdBy}
                                    </span>
                                  </div>
                                  <div className="ds-list-item-meta-item">
                                    <Calendar size={12} style={{ color: 'var(--muted-foreground)' }} />
                                    <span className="ds-list-item-meta-text-sm">
                                      {formatDate(dashboard.updatedAt || dashboard.createdAt)}
                                    </span>
                                  </div>
                                  <div className="ds-list-item-meta-item">
                                    <span className="ds-list-item-meta-text-sm">
                                      {dashboard.sections.length} {dashboard.sections.length === 1 ? 'section' : 'sections'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right side: Action buttons */}
                            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                              <Button 
                                onClick={() => handleToggleDefaultDashboard(dashboard.id)}
                                variant={getRolesForDefaultDashboard(dashboard.id).length > 0 ? "default" : "outline"}
                                size="icon"
                                title={getRolesForDefaultDashboard(dashboard.id).length > 0 
                                  ? `Default for: ${getRolesForDefaultDashboard(dashboard.id).join(', ')}` 
                                  : "Set as default for roles"}
                                style={{
                                  backgroundColor: getRolesForDefaultDashboard(dashboard.id).length > 0 ? 'var(--color-warning)' : undefined,
                                  borderColor: getRolesForDefaultDashboard(dashboard.id).length > 0 ? 'var(--color-warning)' : undefined,
                                  color: getRolesForDefaultDashboard(dashboard.id).length > 0 ? 'white' : undefined
                                }}
                              >
                                {getRolesForDefaultDashboard(dashboard.id).length > 0 ? (
                                  <Star size={16} fill="currentColor" />
                                ) : (
                                  <Star size={16} />
                                )}
                              </Button>
                              <Button 
                                onClick={() => handleCloneDashboard(dashboard)}
                                variant="outline"
                                size="icon"
                                title="Clone dashboard"
                              >
                                <Copy size={16} />
                              </Button>
                              <Button 
                                onClick={() => handleDeleteDashboard(dashboard)}
                                variant="outline"
                                size="icon"
                                title={dashboard.id === 'd-1' ? 'Cannot delete protected dashboard' : 'Delete dashboard'}
                                disabled={dashboard.id === 'd-1'}
                                style={{
                                  color: dashboard.id === 'd-1' ? 'var(--muted-foreground)' : 'var(--destructive)',
                                  cursor: dashboard.id === 'd-1' ? 'not-allowed' : 'pointer',
                                  opacity: dashboard.id === 'd-1' ? 0.5 : 1
                                }}
                              >
                                <Trash2 size={16} />
                              </Button>
                              <Button 
                                onClick={() => handleEditDashboard(dashboard)}
                                variant="default"
                              >
                                <Edit size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleViewDashboard(dashboard)}
                                variant="outline"
                              >
                                <Eye size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </PageContainer>
          ) : viewState === 'data-input' ? (
            // Data Input Flow
            <DataInputFlow
              userRole={userRole}
              userName={user.name}
              siteId={userRole === 'site-manager' ? 'DC-001' : 'DC-001'}
            />
          ) : viewState === 'reports' ? (
            // Reports Hub
            <ReportsHub
              viewMode={reportsHubViewMode}
              setViewMode={setReportsHubViewMode}
              refreshTrigger={reportsHubRefreshTrigger}
              setRefreshTrigger={setReportsHubRefreshTrigger}
            />
          ) : viewState === 'alerts' ? (
            // Alerts Management
            <AlertsManagement
              userRole={userRole}
              userName={user.name}
              siteId={userRole === 'site-manager' ? 'DC-001' : 'DC-001'}
            />
          ) : viewState === 'settings' ? (
            // Unified Settings & Administration
            <UnifiedSettingsAdmin
              currentUserRole={userRole}
              userName={user.name}
              dashboards={dashboards}
            />
          ) : viewState === 'structure' ? (
            // Dashboard Structure Diagram
            <DashboardStructureDiagram onBack={() => setViewState('list')} />
          ) : viewState === 'view' && dashboardToEdit ? (
            // Clean View Mode - Full-screen dashboard without builder UI
            <ViewModeWithControls
              dashboard={dashboardToEdit}
              userRole={userRole}
              user={user}
              onEditDashboard={handleEditDashboard}
            />
          ) : (
            // Builder View (Edit or Preview)
            <ModernDashboardBuilder
              initialDashboard={dashboardToEdit || undefined}
              userRole={userRole}
              userName={user.name}
              onSave={handleSaveDashboard}
              onCancel={handleCancelBuilder}
              startInPreviewMode={viewState === 'preview' || viewState.startsWith('preview-')}
            />
          )}
        </main>
      </div>

      {/* Role Default Dashboard Dialog */}
      {roleDefaultDialog && (
        <SetRoleDefaultDialog
          isOpen={roleDefaultDialog.isOpen}
          onClose={() => setRoleDefaultDialog(null)}
          dashboardName={roleDefaultDialog.dashboardName}
          currentRoles={getRolesForDefaultDashboard(roleDefaultDialog.dashboardId)}
          onConfirm={(selectedRoles) => handleConfirmRoleDefault(roleDefaultDialog.dashboardId, selectedRoles)}
        />
      )}
      
      {/* Design System Editor */}
      {showDesignSystemEditor && (
        <DesignSystemEditor
          onClose={() => setShowDesignSystemEditor(false)}
        />
      )}
    </DndProvider>
  );
}