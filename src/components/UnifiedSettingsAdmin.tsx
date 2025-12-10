import React, { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Switch } from './design-system/Switch';
import { Badge } from './design-system/Badge';
import {
  Settings,
  Bell,
  Database,
  Link2,
  ShieldCheck,
  Sliders,
  Users,
  FileText,
  X,
  AlertTriangle,
  Shield,
  Info,
  CheckCircle2,
  ShieldAlert,
  Gauge,
  Paintbrush, // Add icon for design system
} from 'lucide-react';
import { UserManagement } from './UserManagement';
import { RolesPermissions } from './RolesPermissions';
import { AuditLogs } from './AuditLogs';
import { DashboardDefinition } from '../lib/mockData';
import { SYSTEM_CONFIG, FEATURE_FLAGS, ALERT_CONFIG, DATA_INPUT_CONFIG, DASHBOARD_CONFIG } from '../lib/config';
import { DataSourceBlock } from './blocks/DataSourceBlock';
import { DataFormatConfigurator } from './DataFormatConfigurator';
import { ImportedDataViewer } from './ImportedDataViewer';
import { SettingsSection } from './SettingsSection';
import { SettingRow } from './SettingRow';
import { DesignSystemEditor } from './DesignSystemEditor';
import { PageHeader } from './design-system/PageHeader';

interface UnifiedSettingsAdminProps {
  currentUserRole: 'executive' | 'vp' | 'site-manager' | 'supervisor';
  userName: string;
  dashboards?: DashboardDefinition[];
  onClose?: () => void;
}

type SettingsSection =
  | 'general'
  | 'notifications'
  | 'data-sources'
  | 'integrations'
  | 'metrics'
  | 'design-system' // Add design system to the type
  | 'security'
  | 'advanced'
  | 'users'
  | 'roles'
  | 'audit';

interface NavItem {
  id: SettingsSection;
  label: string;
  icon: any;
}

const navigationItems: NavItem[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data-sources', label: 'Data Entry', icon: Database },
  { id: 'metrics', label: 'Metrics', icon: Gauge },
  { id: 'design-system', label: 'Design System', icon: Paintbrush }, // Add design system nav item
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: ShieldAlert },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'advanced', label: 'Advanced', icon: Sliders },
];

export function UnifiedSettingsAdmin({
  currentUserRole,
  userName,
  dashboards = [],
  onClose,
}: UnifiedSettingsAdminProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  // Settings state
  const [settings, setSettings] = useState({
    alertThresholds: {
      critical: ALERT_CONFIG.thresholds.critical,
      warning: ALERT_CONFIG.thresholds.warning,
      info: ALERT_CONFIG.thresholds.info,
    },
    dashboardRefresh: {
      executive: DASHBOARD_CONFIG.autoRefresh.executive / 60000,
      siteManager: DASHBOARD_CONFIG.autoRefresh['site-manager'] / 60000,
      supervisor: DASHBOARD_CONFIG.autoRefresh.supervisor / 60000,
    },
    dataInput: {
      allowPartialSubmission: DATA_INPUT_CONFIG.submissionRules.allowPartialSubmission,
      duplicatePrevention: DATA_INPUT_CONFIG.submissionRules.duplicatePrevention,
      editWindow: DATA_INPUT_CONFIG.submissionRules.editWindow,
      varianceThreshold: DATA_INPUT_CONFIG.submissionRules.requireNotesWhen.varianceThreshold,
      blockNegativeValues: DATA_INPUT_CONFIG.validation.hardStops.negativeValues,
      photoAttachment: DATA_INPUT_CONFIG.mobile.photoAttachment,
      voiceNotes: DATA_INPUT_CONFIG.mobile.voiceNotes,
      hapticFeedback: DATA_INPUT_CONFIG.mobile.hapticFeedback,
    },
    features: { ...FEATURE_FLAGS },
    security: {
      sessionTimeout: 8,
      extendOnActivity: true,
      passwordMinLength: 12,
      passwordExpiration: 90,
      lockoutAttempts: 5,
      mfaVP: true,
      mfaSiteManager: false,
      mfaSupervisor: false,
      logDataModifications: true,
      logPermissionChanges: true,
      auditLogRetention: 365,
    },
    advanced: {
      cacheDuration: 5,
      debugMode: false,
    },
    integrationsTab: 'upload' as 'upload' | 'view',
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Access control
  const canAccessAdminPanel = currentUserRole === 'vp' || currentUserRole === 'executive';
  const canAccessSystemSettings = currentUserRole === 'vp' || currentUserRole === 'executive';

  // Filter navigation based on access - only show Users, Roles, Audit to VPs/Executives
  const filteredNavigation = navigationItems.filter((item) => {
    if (item.id === 'users' || item.id === 'roles' || item.id === 'audit') {
      return canAccessAdminPanel;
    }
    return true;
  });

  const updateSetting = (path: string[], value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    toast.success('Settings saved successfully');
    setHasChanges(false);
  };

  const renderSystemSettingsContent = () => {
    // Access control for system settings
    if (!canAccessSystemSettings) {
      return (
        <div className="access-denied-container">
          <div className="access-denied-box">
            <Shield className="access-denied-icon" size={20} />
            <div>
              <h4 className="access-denied-title">Access Denied</h4>
              <p className="access-denied-text">
                System settings can only be accessed by VPs and Executives.
              </p>
            </div>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'general':
        return (
          <>
            <SettingsSection 
              title="System Information"
              description="View core system configuration and environment details"
            >
              <div className="grid-2-col">
                <div>
                  <Label>System Name</Label>
                  <Input value={SYSTEM_CONFIG.name} readOnly className="mt-2" />
                </div>
                <div>
                  <Label>Version</Label>
                  <Input value={SYSTEM_CONFIG.version} readOnly className="mt-2" />
                </div>
                <div>
                  <Label>Environment</Label>
                  <div className="mt-2">
                    <Badge variant={SYSTEM_CONFIG.environment === 'production' ? 'default' : 'secondary'}>
                      {SYSTEM_CONFIG.environment}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Input value={SYSTEM_CONFIG.timezone} readOnly className="mt-2" />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Dashboard Auto-Refresh"
              description="Configure how frequently dashboards refresh for each role"
            >
              <SettingRow label="Executive Dashboard" description="Auto-refresh interval">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.dashboardRefresh.executive}
                    onChange={(e) => updateSetting(['dashboardRefresh', 'executive'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">minutes</span>
                </div>
              </SettingRow>

              <SettingRow label="Site Manager Dashboard" description="Auto-refresh interval">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.dashboardRefresh.siteManager}
                    onChange={(e) => updateSetting(['dashboardRefresh', 'siteManager'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">minutes</span>
                </div>
              </SettingRow>

              <SettingRow label="Supervisor Dashboard" description="Auto-refresh interval">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.dashboardRefresh.supervisor}
                    onChange={(e) => updateSetting(['dashboardRefresh', 'supervisor'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">minutes</span>
                </div>
              </SettingRow>
            </SettingsSection>
          </>
        );

      case 'notifications':
        return (
          <SettingsSection
            title="Alert Thresholds"
            description="Set performance thresholds that trigger alerts"
          >
            <SettingRow label="Critical Threshold" description="Below this triggers critical alerts">
              <div className="setting-control">
                <Input
                  type="number"
                  value={settings.alertThresholds.critical}
                  onChange={(e) => updateSetting(['alertThresholds', 'critical'], Number(e.target.value))}
                  className="input-narrow"
                />
                <span className="setting-unit">%</span>
              </div>
            </SettingRow>

            <SettingRow label="Warning Threshold" description="Below this triggers warnings">
              <div className="setting-control">
                <Input
                  type="number"
                  value={settings.alertThresholds.warning}
                  onChange={(e) => updateSetting(['alertThresholds', 'warning'], Number(e.target.value))}
                  className="input-narrow"
                />
                <span className="setting-unit">%</span>
              </div>
            </SettingRow>

            <SettingRow label="Info Threshold" description="Below this shows info notifications">
              <div className="setting-control">
                <Input
                  type="number"
                  value={settings.alertThresholds.info}
                  onChange={(e) => updateSetting(['alertThresholds', 'info'], Number(e.target.value))}
                  className="input-narrow"
                />
                <span className="setting-unit">%</span>
              </div>
            </SettingRow>
          </SettingsSection>
        );

      case 'data-sources':
        return (
          <>
            <SettingsSection
              title="Data Input Rules"
              description="Configure validation and submission rules for data entry"
            >
              <SettingRow label="Allow Partial Submission" description="Users can save incomplete forms">
                <Switch
                  checked={settings.dataInput.allowPartialSubmission}
                  onCheckedChange={(checked) => updateSetting(['dataInput', 'allowPartialSubmission'], checked)}
                />
              </SettingRow>

              <SettingRow label="Duplicate Prevention" description="Prevent duplicate data entries">
                <Switch
                  checked={settings.dataInput.duplicatePrevention}
                  onCheckedChange={(checked) => updateSetting(['dataInput', 'duplicatePrevention'], checked)}
                />
              </SettingRow>

              <SettingRow label="Block Negative Values" description="Prevent negative number entry">
                <Switch
                  checked={settings.dataInput.blockNegativeValues}
                  onCheckedChange={(checked) => updateSetting(['dataInput', 'blockNegativeValues'], checked)}
                />
              </SettingRow>

              <SettingRow label="Edit Window" description="Time allowed to edit submissions">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.dataInput.editWindow}
                    onChange={(e) => updateSetting(['dataInput', 'editWindow'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">hours</span>
                </div>
              </SettingRow>

              <SettingRow label="Variance Threshold" description="Requires notes when exceeded">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.dataInput.varianceThreshold}
                    onChange={(e) => updateSetting(['dataInput', 'varianceThreshold'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">%</span>
                </div>
              </SettingRow>
            </SettingsSection>

            <SettingsSection
              title="Mobile Features"
              description="Enable mobile-specific data entry features"
            >
              <SettingRow label="Photo Attachment" description="Allow photo uploads with entries">
                <Switch
                  checked={settings.dataInput.photoAttachment}
                  onCheckedChange={(checked) => updateSetting(['dataInput', 'photoAttachment'], checked)}
                />
              </SettingRow>

              <SettingRow label="Voice Notes" description="Enable voice note recording">
                <Switch
                  checked={settings.dataInput.voiceNotes}
                  onCheckedChange={(checked) => updateSetting(['dataInput', 'voiceNotes'], checked)}
                />
              </SettingRow>

              <SettingRow label="Haptic Feedback" description="Vibrate on interactions">
                <Switch
                  checked={settings.dataInput.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting(['dataInput', 'hapticFeedback'], checked)}
                />
              </SettingRow>
            </SettingsSection>
          </>
        );

      case 'integrations':
        return (
          <>
            <div className="integration-tabs">
              <div className="tab-list">
                <button
                  onClick={() => updateSetting(['integrationsTab'], 'upload')}
                  className={`tab-button ${settings.integrationsTab === 'upload' ? 'active' : ''}`}
                >
                  Data Upload
                </button>
                <button
                  onClick={() => updateSetting(['integrationsTab'], 'view')}
                  className={`tab-button ${settings.integrationsTab === 'view' ? 'active' : ''}`}
                >
                  View Data
                </button>
              </div>
            </div>

            {settings.integrationsTab === 'upload' && <DataSourceBlock />}
            {settings.integrationsTab === 'view' && <ImportedDataViewer />}
          </>
        );

      case 'metrics':
        return <DataFormatConfigurator />;

      case 'design-system':
        return <DesignSystemEditor onClose={() => {}} />; // Add design system editor with no-op onClose since navigation is handled by settings sidebar

      case 'security':
        return (
          <>
            <div className="info-box">
              <Shield className="info-icon" size={20} />
              <div>
                <p className="info-text">
                  Security settings affect all users. Changes take effect immediately and may require users to re-authenticate.
                </p>
              </div>
            </div>

            <SettingsSection 
              title="Session Management"
              description="Configure user session timeouts and activity tracking"
            >
              <SettingRow label="Session Timeout" description="Idle time before logout">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting(['security', 'sessionTimeout'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">hours</span>
                </div>
              </SettingRow>

              <SettingRow label="Extend on Activity" description="Reset timeout on user action">
                <Switch
                  checked={settings.security.extendOnActivity}
                  onCheckedChange={(checked) => updateSetting(['security', 'extendOnActivity'], checked)}
                />
              </SettingRow>
            </SettingsSection>

            <SettingsSection
              title="Password Policy"
              description="Define password requirements and expiration rules"
            >
              <SettingRow label="Minimum Length" description="Required password characters">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting(['security', 'passwordMinLength'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">chars</span>
                </div>
              </SettingRow>

              <SettingRow label="Password Expiration" description="Force password change after">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.security.passwordExpiration}
                    onChange={(e) => updateSetting(['security', 'passwordExpiration'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">days</span>
                </div>
              </SettingRow>

              <SettingRow label="Lockout After Failed Attempts" description="Lock account after X wrong passwords">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.security.lockoutAttempts}
                    onChange={(e) => updateSetting(['security', 'lockoutAttempts'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">attempts</span>
                </div>
              </SettingRow>
            </SettingsSection>

            <SettingsSection
              title="Multi-Factor Authentication"
              description="Require MFA for specific roles"
            >
              <SettingRow label="VPs & Executives" description="Require MFA for admin users">
                <Switch
                  checked={settings.security.mfaVP}
                  onCheckedChange={(checked) => updateSetting(['security', 'mfaVP'], checked)}
                />
              </SettingRow>

              <SettingRow label="Site Managers" description="Require MFA for site managers">
                <Switch
                  checked={settings.security.mfaSiteManager}
                  onCheckedChange={(checked) => updateSetting(['security', 'mfaSiteManager'], checked)}
                />
              </SettingRow>

              <SettingRow label="Supervisors" description="Require MFA for supervisors">
                <Switch
                  checked={settings.security.mfaSupervisor}
                  onCheckedChange={(checked) => updateSetting(['security', 'mfaSupervisor'], checked)}
                />
              </SettingRow>
            </SettingsSection>

            <SettingsSection
              title="Audit Logging"
              description="Track system activity and maintain security audit trails"
            >
              <SettingRow label="Log Data Modifications" description="Track all data changes">
                <Switch
                  checked={settings.security.logDataModifications}
                  onCheckedChange={(checked) => updateSetting(['security', 'logDataModifications'], checked)}
                />
              </SettingRow>

              <SettingRow label="Log Permission Changes" description="Track role and access modifications">
                <Switch
                  checked={settings.security.logPermissionChanges}
                  onCheckedChange={(checked) => updateSetting(['security', 'logPermissionChanges'], checked)}
                />
              </SettingRow>

              <SettingRow label="Audit Log Retention" description="How long to keep audit logs">
                <div className="setting-control">
                  <Input
                    type="number"
                    value={settings.security.auditLogRetention}
                    onChange={(e) => updateSetting(['security', 'auditLogRetention'], Number(e.target.value))}
                    className="input-narrow"
                  />
                  <span className="setting-unit">days</span>
                </div>
              </SettingRow>
            </SettingsSection>
          </>
        );

      case 'advanced':
        return (
          <SettingsSection
            title="Advanced System Settings"
            description="Additional configuration options and system maintenance"
          >
            <div className="warning-box">
              <AlertTriangle className="warning-icon" size={20} />
              <div>
                <p className="warning-text">
                  <strong>Warning:</strong> These settings can significantly impact system behavior. Only modify if you understand the implications.
                </p>
              </div>
            </div>

            <SettingRow label="Cache Duration" description="How long to cache dashboard data">
              <div className="setting-control">
                <Input
                  type="number"
                  value={settings.advanced.cacheDuration}
                  onChange={(e) => updateSetting(['advanced', 'cacheDuration'], Number(e.target.value))}
                  className="input-narrow"
                />
                <span className="setting-unit">minutes</span>
              </div>
            </SettingRow>

            <SettingRow label="Debug Mode" description="Enable detailed logging for troubleshooting">
              <Switch
                checked={settings.advanced.debugMode}
                onCheckedChange={(checked) => updateSetting(['advanced', 'debugMode'], checked)}
              />
            </SettingRow>
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    // System Settings sections
    if (activeSection === 'general' ||
        activeSection === 'notifications' ||
        activeSection === 'data-sources' ||
        activeSection === 'integrations' ||
        activeSection === 'metrics' || // Add metrics check
        activeSection === 'design-system' || // Add design system check
        activeSection === 'security' ||
        activeSection === 'advanced') {
      return (
        <div className="settings-content-wrapper">
          <div className="settings-header">
            <div className="settings-header-content">
              <PageHeader
                title={
                  activeSection === 'general' ? 'General Settings' :
                  activeSection === 'notifications' ? 'Notifications' :
                  activeSection === 'data-sources' ? 'Data Entry' :
                  activeSection === 'integrations' ? 'Integrations' :
                  activeSection === 'metrics' ? 'Metrics' :
                  activeSection === 'design-system' ? 'Design System' :
                  activeSection === 'security' ? 'Security' :
                  activeSection === 'advanced' ? 'Advanced' : ''
                }
                subtitle={
                  activeSection === 'general' ? 'System information and dashboard configuration' :
                  activeSection === 'notifications' ? 'Alert thresholds and notification settings' :
                  activeSection === 'data-sources' ? 'Data input rules and mobile features' :
                  activeSection === 'integrations' ? 'Feature toggles and integrations' :
                  activeSection === 'metrics' ? 'Configure metrics and data visualization' :
                  activeSection === 'design-system' ? 'Customize the design system' :
                  activeSection === 'security' ? 'Authentication and access control' :
                  activeSection === 'advanced' ? 'Audit logs and system maintenance' : ''
                }
                actions={
                  hasChanges ? (
                    <Button onClick={handleSave}>
                      <CheckCircle2 size={16} className="btn-icon" />
                      Save Changes
                    </Button>
                  ) : undefined
                }
              />
            </div>
          </div>

          <div className="settings-scrollable-content">
            {renderSystemSettingsContent()}
          </div>
        </div>
      );
    }

    // Admin sections - these manage their own layout structure
    switch (activeSection) {
      case 'users':
        return <UserManagement currentUserRole={currentUserRole} />;
      case 'roles':
        return <RolesPermissions currentUserRole={currentUserRole} />;
      case 'audit':
        return <AuditLogs currentUserRole={currentUserRole} />;
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="sidebar-header">
          <PageHeader
            title="Settings"
            subtitle={userName}
          />
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          )}
        </div>

        <div className="sidebar-nav">
          {/* System Settings Section */}
          <div style={{ 
            padding: 'var(--spacing-2) var(--spacing-3)',
            color: 'var(--color-muted-foreground)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: 'var(--spacing-2)'
          }}>
            System Settings
          </div>
          {filteredNavigation
            .filter(item => ['general', 'security', 'notifications', 'advanced'].includes(item.id))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`nav-button ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

          {/* Data Section */}
          <div style={{ 
            padding: 'var(--spacing-2) var(--spacing-3)',
            color: 'var(--color-muted-foreground)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--spacing-4)'
          }}>
            Data
          </div>
          {filteredNavigation
            .filter(item => ['data-sources', 'metrics', 'integrations'].includes(item.id))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`nav-button ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

          {/* Customization Section */}
          <div style={{ 
            padding: 'var(--spacing-2) var(--spacing-3)',
            color: 'var(--color-muted-foreground)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: 'var(--spacing-4)',
            borderTop: '1px solid var(--border)',
            paddingTop: 'var(--spacing-4)'
          }}>
            Customization
          </div>
          {filteredNavigation
            .filter(item => ['design-system'].includes(item.id))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`nav-button ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}

          {/* Admin Section - Only show if user has access */}
          {canAccessAdminPanel && (
            <>
              <div style={{ 
                padding: 'var(--spacing-2) var(--spacing-3)',
                color: 'var(--color-muted-foreground)',
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: 'var(--spacing-4)',
                borderTop: '1px solid var(--border)',
                paddingTop: 'var(--spacing-4)'
              }}>
                Admin
              </div>
              {filteredNavigation
                .filter(item => ['users', 'roles', 'audit'].includes(item.id))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`nav-button ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </>
          )}
        </div>
      </div>

      <div className="settings-main">{renderContent()}</div>
    </div>
  );
}