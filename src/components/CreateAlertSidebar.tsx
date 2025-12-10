import React, { useState, useEffect } from 'react';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Textarea } from './design-system/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Switch } from './design-system/Switch';
import { Checkbox } from './design-system/Checkbox';
import { SlideOut } from './design-system/SlideOut';
import { 
  AlertRule, 
  AlertCondition, 
  AlertMetric, 
  AlertScope, 
  NotificationMethod, 
  NotificationFrequency,
  AlertSeverity,
  UserRole,
  sites,
  jobFunctions
} from '../lib/mockData';
import { AlertTriangle, Info, AlertCircle, Bell } from 'lucide-react';

interface CreateAlertSidebarProps {
  open: boolean;
  onClose: () => void;
  onSave: (alert: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingAlert?: AlertRule | null;
  currentUserName: string;
}

export function CreateAlertSidebar({ open, onClose, onSave, editingAlert, currentUserName }: CreateAlertSidebarProps) {
  const [name, setName] = useState(editingAlert?.name || '');
  const [description, setDescription] = useState(editingAlert?.description || '');
  const [isActive, setIsActive] = useState(editingAlert?.isActive ?? true);
  const [condition, setCondition] = useState<AlertCondition>(editingAlert?.condition || 'below');
  const [threshold, setThreshold] = useState(editingAlert?.threshold?.toString() || '95');
  const [metric, setMetric] = useState<AlertMetric>(editingAlert?.metric || 'performance');
  const [scope, setScope] = useState<AlertScope>(editingAlert?.scope || 'task');
  const [siteIds, setSiteIds] = useState<string[]>(editingAlert?.siteIds || []);
  const [jobFunctionTypes, setJobFunctionTypes] = useState<string[]>(editingAlert?.jobFunctionTypes || []);
  const [recipients, setRecipients] = useState<UserRole[]>(editingAlert?.recipients || ['executive', 'site-manager']);
  const [notificationMethods, setNotificationMethods] = useState<NotificationMethod[]>(editingAlert?.notificationMethod || ['in-app']);
  const [frequency, setFrequency] = useState<NotificationFrequency>(editingAlert?.frequency || 'immediate');
  const [severity, setSeverity] = useState<AlertSeverity>(editingAlert?.severity || 'warning');

  // Update form when editingAlert changes
  useEffect(() => {
    if (editingAlert) {
      setName(editingAlert.name);
      setDescription(editingAlert.description);
      setIsActive(editingAlert.isActive);
      setCondition(editingAlert.condition);
      setThreshold(editingAlert.threshold.toString());
      setMetric(editingAlert.metric);
      setScope(editingAlert.scope);
      setSiteIds(editingAlert.siteIds);
      setJobFunctionTypes(editingAlert.jobFunctionTypes);
      setRecipients(editingAlert.recipients);
      setNotificationMethods(editingAlert.notificationMethod);
      setFrequency(editingAlert.frequency);
      setSeverity(editingAlert.severity);
    } else {
      // Reset form
      setName('');
      setDescription('');
      setIsActive(true);
      setCondition('below');
      setThreshold('95');
      setMetric('performance');
      setScope('task');
      setSiteIds([]);
      setJobFunctionTypes([]);
      setRecipients(['executive', 'site-manager']);
      setNotificationMethods(['in-app']);
      setFrequency('immediate');
      setSeverity('warning');
    }
  }, [editingAlert]);

  const handleSave = () => {
    if (!name || !threshold) return;

    onSave({
      name,
      description,
      isActive,
      condition,
      threshold: parseFloat(threshold),
      metric,
      scope,
      siteIds,
      jobFunctionTypes,
      taskIds: [],
      recipients,
      notificationMethod: notificationMethods,
      frequency,
      severity,
      createdBy: editingAlert?.createdBy || currentUserName,
    });

    onClose();
  };

  const toggleSite = (siteId: string) => {
    setSiteIds(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const toggleJobFunction = (type: string) => {
    setJobFunctionTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleRecipient = (role: UserRole) => {
    setRecipients(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const toggleNotificationMethod = (method: NotificationMethod) => {
    setNotificationMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const uniqueJobFunctionTypes = Array.from(new Set(jobFunctions.map(jf => jf.type)));

  return (
    <SlideOut
      open={open}
      onClose={onClose}
      title={editingAlert ? 'Edit Alert Rule' : 'Create Alert Rule'}
      description="Configure automatic alerts for performance metrics"
      icon={<Bell size={18} />}
      resizable
      defaultWidth={520}
      minWidth={400}
      maxWidth={900}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || !threshold}>
            {editingAlert ? 'Update Alert' : 'Create Alert'}
          </Button>
        </>
      }
    >
          {/* Basic Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="name">Alert Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Critical Performance Drop"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe when this alert should trigger"
                rows={2}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Alert is active</Label>
            </div>
          </div>

          {/* Condition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-4)' }}>
            <h3 className="create-alert-section-title">
              Alert Condition
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Metric</Label>
                <Select value={metric} onValueChange={(v) => setMetric(v as AlertMetric)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance %</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Condition</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as AlertCondition)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below">Below</SelectItem>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Threshold</Label>
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="95"
                  step="0.1"
                />
              </div>
            </div>

            <div className="create-alert-preview-box">
              Alert when <strong>{metric}</strong> is <strong>{condition}</strong> <strong>{threshold}</strong>
              {metric === 'performance' && '%'}
            </div>
          </div>

          {/* Scope */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Alert Scope</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as AlertScope)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task Level</SelectItem>
                  <SelectItem value="job-function">Job Function Level</SelectItem>
                  <SelectItem value="site">Site Level</SelectItem>
                  <SelectItem value="enterprise">Enterprise Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Site Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Sites (leave all unchecked for all sites)</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', maxHeight: '128px', overflowY: 'auto' }}>
                {sites.map(site => (
                  <div key={site.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Checkbox
                      id={`site-${site.id}`}
                      checked={siteIds.includes(site.id)}
                      onCheckedChange={() => toggleSite(site.id)}
                    />
                    <label
                      htmlFor={`site-${site.id}`}
                      className="create-alert-checkbox-label"
                    >
                      {site.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Function Filter */}
            {(scope === 'task' || scope === 'job-function') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Job Functions (leave all unchecked for all functions)</Label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  {uniqueJobFunctionTypes.map(type => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Checkbox
                        id={`jf-${type}`}
                        checked={jobFunctionTypes.includes(type)}
                        onCheckedChange={() => toggleJobFunction(type)}
                      />
                      <label
                        htmlFor={`jf-${type}`}
                        className="create-alert-checkbox-label-capitalized"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-4)' }}>
            <h3 className="create-alert-section-title">
              Notification Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as AlertSeverity)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      Critical
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <AlertTriangle style={{ width: '16px', height: '16px', color: '#eab308' }} />
                      Warning
                    </div>
                  </SelectItem>
                  <SelectItem value="info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Info style={{ width: '16px', height: '16px', color: 'var(--chart-1)' }} />
                      Info
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Notify</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                {(['executive', 'site-manager', 'supervisor'] as UserRole[]).map(role => (
                  <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Checkbox
                      id={`role-${role}`}
                      checked={recipients.includes(role)}
                      onCheckedChange={() => toggleRecipient(role)}
                    />
                    <label
                      htmlFor={`role-${role}`}
                      className="create-alert-checkbox-label-capitalized"
                    >
                      {role.replace('-', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Method</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', padding: 'var(--spacing-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  {(['in-app', 'email', 'sms'] as NotificationMethod[]).map(method => (
                    <div key={method} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Checkbox
                        id={`method-${method}`}
                        checked={notificationMethods.includes(method)}
                        onCheckedChange={() => toggleNotificationMethod(method)}
                      />
                      <label
                        htmlFor={`method-${method}`}
                        className="create-alert-checkbox-label-capitalized"
                      >
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as NotificationFrequency)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily-digest">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
    </SlideOut>
  );
}
