import { useState } from 'react';
import { Button } from './design-system/Button';
import { Card, CardDescription, CardTitle } from './design-system/Card';
import { Badge } from './design-system/Badge';
import { Switch } from './design-system/Switch';
import { 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { CreateAlertSidebar } from './CreateAlertSidebar';
import { 
  AlertRule, 
  TriggeredAlert,
  alertRules,
  triggeredAlerts,
  getTriggeredAlertsForUser,
  acknowledgeAlert,
  resolveAlert,
  createAlertRule,
  updateAlertRule,
  deleteAlertRule,
  UserRole
} from '../lib/mockData';
import { toast } from './design-system/Toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './design-system/AlertDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './design-system/Tabs';
import { Textarea } from './design-system/Textarea';
import { PageHeader } from './design-system/PageHeader';

interface AlertsManagementProps {
  userRole: UserRole;
  siteId: string;
  userName: string;
}

export function AlertsManagement({ userRole, siteId, userName }: AlertsManagementProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertRule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);

  const activeAlerts = getTriggeredAlertsForUser(userRole, siteId);
  const canManageAlerts = true; // All roles can create and manage alerts

  // Debug logging
  console.log('🔍 AlertsManagement - userRole:', userRole);
  console.log('🔍 AlertsManagement - canManageAlerts:', canManageAlerts);
  console.log('🔍 AlertsManagement - userRole === "executive":', userRole === 'executive');

  const handleCreateAlert = (alert: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    createAlertRule(alert);
    toast.success('Alert rule created!', {
      description: 'The alert is now active and monitoring your metrics.',
    });
  };

  const handleEditAlert = (alert: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAlert) {
      updateAlertRule(editingAlert.id, alert);
      toast.success('Alert rule updated!');
      setEditingAlert(null);
    }
  };

  const handleToggleAlert = (alertId: string, isActive: boolean) => {
    updateAlertRule(alertId, { isActive });
    toast.success(isActive ? 'Alert activated' : 'Alert deactivated');
  };

  const handleDeleteAlert = () => {
    if (alertToDelete) {
      deleteAlertRule(alertToDelete);
      toast.success('Alert rule deleted');
      setAlertToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    acknowledgeAlert(alertId, userName);
    toast.success('Alert acknowledged');
  };

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId, resolveNotes);
    toast.success('Alert resolved');
    setResolvingAlertId(null);
    setResolveNotes('');
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle style={{ width: '16px', height: '16px', color: 'var(--color-error)' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--color-warning)' }} />;
      case 'info':
        return <Info style={{ width: '16px', height: '16px', color: 'var(--color-info)' }} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-6)' }}>
      {/* Header */}
      <PageHeader
        title="Alerts & Notifications"
        description="Monitor performance metrics and get notified when thresholds are crossed"
        actions={
          canManageAlerts && (
            <Button onClick={() => setSidebarOpen(true)}>
              <Plus style={{ width: '16px', height: '16px', marginRight: 'var(--spacing-2)' }} />
              Create Alert
            </Button>
          )
        }
      />

      <Tabs defaultValue="active" className="ds-tabs-flex-col">
        <TabsList>
          <TabsTrigger value="active" className="ds-tabs-trigger-with-badge">
            Active Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="badge-count">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="active" className="ds-tabs-flex-col">
          {activeAlerts.length === 0 ? (
            <Card className="card-content-empty-state">
              <CheckCircle2 style={{ width: '48px', height: '48px', color: 'var(--color-success)', marginBottom: 'var(--spacing-4)' }} />
              <h3 className="alerts-empty-state-title">All Clear</h3>
              <p className="alerts-empty-state-description">
                No active alerts at the moment. All metrics are within acceptable thresholds.
              </p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {activeAlerts.map(alert => (
                <Card 
                  key={alert.id} 
                  className={`card-alert-${alert.severity} card-header-compact`}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <CardTitle>{alert.alertRuleName}</CardTitle>
                        <CardDescription className="card-description-spaced">
                          {alert.siteName}
                          {alert.jobFunctionName && ` • ${alert.jobFunctionName}`}
                          {alert.taskName && ` • ${alert.taskName}`}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="card-content-flex-col-gap">
                    <div className="alert-card-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        {alert.condition === 'below' ? (
                          <TrendingDown style={{ width: '16px', height: '16px', color: 'var(--color-error)' }} />
                        ) : (
                          <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--color-warning)' }} />
                        )}
                        <span>
                          Current: <strong>{alert.currentValue.toFixed(1)}%</strong>
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <span className="alert-card-timestamp">
                          Threshold: {alert.threshold}%
                        </span>
                      </div>
                      <div className="alert-card-meta">
                        <Clock style={{ width: '16px', height: '16px' }} />
                        {formatTime(alert.triggeredAt)}
                      </div>
                    </div>

                    {alert.acknowledgedAt && (
                      <div className="alert-card-message">
                        Acknowledged by {alert.acknowledgedBy} at {new Date(alert.acknowledgedAt).toLocaleTimeString()}
                      </div>
                    )}

                    {resolvingAlertId === alert.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)', borderTop: '1px solid var(--color-border)' }}>
                        <Textarea
                          placeholder="Add resolution notes (optional)"
                          value={resolveNotes}
                          onChange={(e) => setResolveNotes(e.target.value)}
                          rows={2}
                        />
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                          <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                            Confirm Resolve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setResolvingAlertId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)', borderTop: '1px solid var(--color-border)' }}>
                        {!alert.acknowledgedAt && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => setResolvingAlertId(alert.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="ds-tabs-flex-col">
          {!canManageAlerts ? (
            <Card className="card-content-empty-state">
              <Bell style={{ width: '48px', height: '48px', color: 'var(--color-muted-foreground)', marginBottom: 'var(--spacing-4)' }} />
              <h3 className="alerts-empty-state-title">View Only</h3>
              <p className="alerts-empty-state-description">
                You can view alert rules but only executives can create or modify them.
              </p>
            </Card>
          ) : null}

          <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
            {alertRules.map(rule => (
              <Card key={rule.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', flex: 1 }}>
                    <div style={{ marginTop: '2px' }}>
                      {getSeverityIcon(rule.severity)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <CardTitle>{rule.name}</CardTitle>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {rule.description && (
                        <CardDescription className="card-description-spaced">{rule.description}</CardDescription>
                      )}
                    </div>
                  </div>
                  {canManageAlerts && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => handleToggleAlert(rule.id, checked)}
                      />
                    </div>
                  )}
                </div>
                <div className="card-content-flex-col-gap">
                  <div className="bg-muted rounded-lg p-6">
                    <div className="alert-rule-grid">
                      <div>
                        <span className="alert-rule-field-label">Condition:</span>
                        <div className="alert-rule-field-value">
                          {rule.metric} {rule.condition} {rule.threshold}
                          {rule.metric === 'performance' && '%'}
                        </div>
                      </div>
                      <div>
                        <span className="alert-rule-field-label">Scope:</span>
                        <div className="alert-rule-field-value-capitalized">{rule.scope}</div>
                      </div>
                      <div>
                        <span className="alert-rule-field-label">Recipients:</span>
                        <div className="alert-rule-field-value-capitalized">
                          {rule.recipients.join(', ').replace(/-/g, ' ')}
                        </div>
                      </div>
                      <div>
                        <span className="alert-rule-field-label">Method:</span>
                        <div className="alert-rule-field-value-capitalized">
                          {rule.notificationMethod.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {rule.siteIds.length > 0 && (
                    <div className="alert-rule-contacts">
                      <span className="alert-rule-field-label">Sites: </span>
                      <Badge variant="outline" className="badge-spaced-left">
                        {rule.siteIds.length} site(s)
                      </Badge>
                    </div>
                  )}

                  {rule.jobFunctionTypes.length > 0 && (
                    <div className="alert-rule-escalation">
                      <span className="alert-rule-field-label">Job Functions: </span>
                      {rule.jobFunctionTypes.map(type => (
                        <Badge key={type} variant="outline" className="badge-capitalize">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {canManageAlerts && (
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingAlert(rule);
                          setSidebarOpen(true);
                        }}
                      >
                        <Pencil style={{ width: '12px', height: '12px', marginRight: 'var(--spacing-1)' }} />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setAlertToDelete(rule.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 style={{ width: '12px', height: '12px', marginRight: 'var(--spacing-1)' }} />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Sidebar */}
      <CreateAlertSidebar
        open={sidebarOpen}
        onClose={() => {
          setSidebarOpen(false);
          setEditingAlert(null);
        }}
        onSave={editingAlert ? handleEditAlert : handleCreateAlert}
        editingAlert={editingAlert}
        currentUserName={userName}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alert Rule?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this alert rule. You will no longer receive notifications for this condition.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlert}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}