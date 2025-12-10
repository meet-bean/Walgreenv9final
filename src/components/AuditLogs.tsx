import { useState } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { PageHeader } from './design-system/PageHeader';
import {
  Shield,
  Search,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  FileDown,
  UserPlus,
  UserMinus,
  Share2,
  Clock,
  User,
} from 'lucide-react';
import { AuditLog, mockAuditLogs } from '../lib/mockData';
import { toast } from 'sonner';
import { SettingsSection } from './SettingsSection';

interface AuditLogsProps {
  currentUserRole: 'executive' | 'vp' | 'site-manager' | 'supervisor';
}

export function AuditLogs({ currentUserRole }: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterResource, setFilterResource] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Access control
  if (currentUserRole !== 'vp' && currentUserRole !== 'executive') {
    return (
      <div className="settings-access-denied-container">
        <div className="settings-access-denied-box">
          <Shield className="settings-access-denied-icon" size={20} />
          <div>
            <h4 className="settings-access-denied-title">Access Denied</h4>
            <p className="settings-access-denied-text">
              Audit logs can only be accessed by VPs and Executives.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view':
        return <Eye size={16} />;
      case 'edit':
        return <Edit size={16} />;
      case 'create':
        return <Plus size={16} />;
      case 'delete':
        return <Trash2 size={16} />;
      case 'export':
        return <FileDown size={16} />;
      case 'grant':
        return <UserPlus size={16} />;
      case 'revoke':
        return <UserMinus size={16} />;
      case 'publish':
        return <Share2 size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'delete':
      case 'revoke':
        return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
      case 'create':
      case 'grant':
      case 'publish':
        return { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      case 'edit':
        return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
      case 'export':
        return { backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      !searchQuery ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesResource = filterResource === 'all' || log.resource === filterResource;

    const logDate = new Date(log.timestamp);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchesDateRange = logDate >= startDate && logDate <= endDate;

    return matchesSearch && matchesAction && matchesResource && matchesDateRange;
  });

  const handleExportLogs = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          console.log('Exporting audit logs:', {
            logs: filteredLogs,
            dateRange,
          });
          resolve(null);
        }, 1500);
      }),
      {
        loading: 'Generating audit log export...',
        success: 'Audit logs exported successfully!',
        error: 'Export failed',
      }
    );
  };

  return (
    <div className="settings-content-wrapper">
      <div className="settings-header">
        <div className="settings-header-content">
          <PageHeader
            title="Audit Logs"
            subtitle="Comprehensive tracking of all system activities for compliance and security"
            actions={
              <Button onClick={handleExportLogs}>
                <Download size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                Export Logs
              </Button>
            }
          />
        </div>
      </div>

      <div className="settings-scrollable-content">
        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-card-label">Total Actions</p>
            <p className="stat-card-value">
              {filteredLogs.length}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">Unique Users</p>
            <p className="stat-card-value">
              {new Set(filteredLogs.map(log => log.userName)).size}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">Resources Modified</p>
            <p className="stat-card-value">
              {new Set(filteredLogs.map(log => log.resourceName)).size}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">Date Range</p>
            <p className="stat-card-value" style={{ fontSize: 'var(--text-base)' }}>
              {Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        </div>

        {/* Filters */}
        <SettingsSection
          title="Filters"
          description="Narrow down audit log entries by date range, action type, and resource"
        >
          {/* Search */}
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <Input
              className="search-input-with-icon"
              placeholder="Search by user, action, or resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="grid-2-col">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          {/* Action and Resource Filters */}
          <div className="grid-2-col">
            <div>
              <Label>Action</Label>
              <Select size="sm" value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="grant">Grant Permission</SelectItem>
                  <SelectItem value="revoke">Revoke Permission</SelectItem>
                  <SelectItem value="publish">Publish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resource Type</Label>
              <Select size="sm" value={filterResource} onValueChange={setFilterResource}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="goal">Goal</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsSection>

        {/* Activity Log */}
        <SettingsSection
          title={`Activity Log (${filteredLogs.length} entries)`}
          description="Detailed chronological record of all user actions and system events"
        >
          {filteredLogs.length === 0 ? (
            <div className="ds-card card-content-empty-state">
              <Shield size={48} style={{ opacity: 0.2, marginBottom: 'var(--spacing-4)' }} />
              <h3 className="text-large alerts-empty-state-title">No audit logs found</h3>
              <p className="text-detail alerts-empty-state-description">Try adjusting your filters</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {filteredLogs.map((log) => (
                <div key={log.id} className="setting-row">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
                    {/* Timestamp */}
                    <div style={{
                      color: 'var(--color-muted-foreground)',
                      width: '128px',
                      flexShrink: 0
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-1)' }}>
                        <Clock size={12} />
                        {formatTimestamp(log.timestamp)}
                      </div>
                      <div>{log.ipAddress}</div>
                    </div>

                    {/* Action Badge */}
                    <div style={{ flexShrink: 0 }}>
                      <Badge
                        variant="outline"
                        style={{
                          gap: 'var(--spacing-1)',
                          ...getActionColor(log.action)
                        }}
                      >
                        {getActionIcon(log.action)}
                        {log.action}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        marginBottom: 'var(--spacing-1)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                          <User size={12} />
                          <span>{log.userName}</span>
                        </span>
                        <span style={{ color: 'var(--color-muted-foreground)', opacity: 0.5 }}>•</span>
                        <span style={{
                          color: 'var(--color-muted-foreground)'
                        }}>
                          {log.resource}: {log.resourceName}
                        </span>
                      </div>

                      {/* Additional Details */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div style={{
                          color: 'var(--color-muted-foreground)',
                          marginTop: 'var(--spacing-2)'
                        }}>
                          <details style={{ cursor: 'pointer' }}>
                            <summary>View details</summary>
                            <pre style={{
                              marginTop: 'var(--spacing-2)',
                              padding: 'var(--spacing-2)',
                              background: 'var(--background)',
                              borderRadius: 'var(--radius)',
                              overflow: 'auto'
                            }}>
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SettingsSection>
      </div>
    </div>
  );
}