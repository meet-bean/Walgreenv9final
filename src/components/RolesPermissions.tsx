import { useState, useEffect } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Label } from './design-system/Label';
import { Input } from './design-system/Input';
import { Switch } from './design-system/Switch';
import { Alert, AlertDescription } from './design-system/Alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './design-system/Table';
import { SlideOut } from './design-system/SlideOut';
import { SettingRow } from './SettingRow';
import { PageHeader } from './design-system/PageHeader';
import { 
  Shield, 
  Plus,
  Trash2,
  AlertCircle,
  Database,
  Edit3,
  PlusSquare,
  Bell,
  RotateCcw
} from 'lucide-react';
import { 
  Role,
  getAllRoles,
  createRole,
  updateRolePermission,
  deleteRole,
  resetRolesToDefaults,
  PermissionKey
} from '../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface RolesPermissionsProps {
  currentUserRole: 'executive' | 'vp' | 'site-manager' | 'supervisor';
}

const permissionConfig = [
  {
    id: 'dataInput' as PermissionKey,
    label: 'Data Input',
    description: 'Access to the Data Input button and data entry features',
    icon: Database,
  },
  {
    id: 'editDashboards' as PermissionKey,
    label: 'Edit Dashboards',
    description: 'Modify existing dashboards and their components',
    icon: Edit3,
  },
  {
    id: 'createDashboards' as PermissionKey,
    label: 'Create Dashboards',
    description: 'Create new dashboards from scratch',
    icon: PlusSquare,
  },
  {
    id: 'deleteDashboards' as PermissionKey,
    label: 'Delete Dashboards',
    description: 'Remove dashboards permanently',
    icon: Trash2,
  },
  {
    id: 'createAlerts' as PermissionKey,
    label: 'Create Alerts',
    description: 'Set up automated alerts and notifications',
    icon: Bell,
  },
];

export function RolesPermissions({ currentUserRole }: RolesPermissionsProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = () => {
    setRoles(getAllRoles());
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    const success = createRole(newRoleName.trim(), currentUserRole === 'executive' ? 'Executive' : 'VP');
    if (success) {
      toast.success(`Role "${newRoleName}" created successfully`);
      setNewRoleName('');
      setShowCreateDialog(false);
      loadRoles();
    } else {
      toast.error('Failed to create role. Name may already exist.');
    }
  };

  const handleTogglePermission = (roleId: string, permission: PermissionKey, enabled: boolean) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    updateRolePermission(roleId, permission, enabled, currentUserRole === 'executive' ? 'Executive' : 'VP');
    toast.success(
      `${permission} ${enabled ? 'enabled' : 'disabled'} for ${role.name}`,
      { duration: 2000 }
    );
    loadRoles();
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (!role.isCustom) {
      toast.error('Cannot delete system roles');
      return;
    }

    if (confirm(`Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`)) {
      deleteRole(roleId);
      toast.success(`Role "${role.name}" deleted successfully`);
      loadRoles();
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all roles to defaults? This will remove all custom roles and reset permissions.')) {
      resetRolesToDefaults();
      toast.success('Roles reset to defaults');
      loadRoles();
    }
  };

  const canManageRoles = currentUserRole === 'executive' || currentUserRole === 'vp';

  if (!canManageRoles) {
    return (
      <div className="settings-access-denied">
        <Shield size={48} style={{ color: 'var(--color-muted-foreground)', marginBottom: 'var(--spacing-4)' }} />
        <h2 className="settings-access-denied-title">Access Denied</h2>
        <p className="settings-access-denied-text">
          Only Executives and VPs can manage roles and permissions.
        </p>
      </div>
    );
  };

  const systemRoles = roles.filter(r => !r.isCustom);
  const customRoles = roles.filter(r => r.isCustom);

  return (
    <div className="settings-content-wrapper">
      <div className="settings-header">
        <div className="settings-header-content">
          <PageHeader
            title="Roles & Permissions"
            subtitle="Manage user roles and their access permissions"
            actions={
              <>
                <Button variant="outline" onClick={handleResetToDefaults}>
                  <RotateCcw size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Reset to Defaults
                </Button>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Create Role
                </Button>
              </>
            }
          />
        </div>
      </div>

      <div className="settings-scrollable-content">
        {/* Create Role Sidebar */}
        <SlideOut
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false);
            setNewRoleName('');
          }}
          title="Create New Role"
          description="Create a custom role with configurable permissions"
          icon={<Shield size={18} />}
          footer={
            <>
              <Button variant="outline" onClick={() => {
                setShowCreateDialog(false);
                setNewRoleName('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </>
          }
        >
          <div style={{ marginTop: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
            <Label>Role Name</Label>
            <Input
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g., Team Leader, Regional Manager"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateRole();
                }
              }}
              style={{ marginTop: 'var(--spacing-2)' }}
            />
          </div>
        </SlideOut>

        {/* Info Alert */}
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <Alert variant="default">
            <AlertCircle size={16} style={{ color: 'var(--primary)' }} />
            <AlertDescription>
              <strong>Permission Management:</strong> System roles cannot be deleted, but their permissions can be modified. Custom roles can be fully managed.
            </AlertDescription>
          </Alert>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-card-label">
              Total Roles
            </p>
            <p className="stat-card-value">
              {roles.length}
            </p>
            <p className="stat-card-detail">
              System & Custom
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">
              System Roles
            </p>
            <p className="stat-card-value">
              {systemRoles.length}
            </p>
            <p className="stat-card-detail">
              Built-in roles
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">
              Custom Roles
            </p>
            <p className="stat-card-value">
              {customRoles.length}
            </p>
            <p className="stat-card-detail">
              User-defined roles
            </p>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="settings-section">
          <h3 className="section-title">Role Permissions</h3>
          <p className="section-description">
            Configure permissions for each role
          </p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: '240px' }}>Role</TableHead>
                {permissionConfig.map((perm) => {
                  const Icon = perm.icon;
                  return (
                    <TableHead key={perm.id} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-2)' }}>
                        <Icon size={14} />
                        {perm.label}
                      </div>
                    </TableHead>
                  );
                })}
                <TableHead style={{ width: '80px', textAlign: 'center' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* System Roles */}
              {systemRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                        {role.name}
                        <Badge variant="outline" style={{ fontSize: 'var(--text-detail)' }}>System</Badge>
                      </div>
                    </div>
                  </TableCell>
                  {permissionConfig.map((perm) => {
                    const isEnabled = role.permissions[perm.id];
                    return (
                      <TableCell key={perm.id} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleTogglePermission(role.id, perm.id, checked)}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-detail)' }}>—</span>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Custom Roles */}
              {customRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                        {role.name}
                        <Badge variant="secondary" style={{ fontSize: 'var(--text-detail)' }}>Custom</Badge>
                      </div>
                      <div style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-detail)', marginTop: 'var(--spacing-1)' }}>
                        Created {new Date(role.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  {permissionConfig.map((perm) => {
                    const isEnabled = role.permissions[perm.id];
                    return (
                      <TableCell key={perm.id} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleTogglePermission(role.id, perm.id, checked)}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell style={{ textAlign: 'center' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                      style={{ padding: 'var(--spacing-1)' }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Permission Descriptions */}
        <div className="settings-section">
          <h3 className="section-title">Permission Descriptions</h3>
          <p className="section-description">
            What each permission allows users to do
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {permissionConfig.map((perm) => {
              return (
                <SettingRow 
                  key={perm.id} 
                  label={perm.label}
                  description={perm.description}
                >
                  <div />
                </SettingRow>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}