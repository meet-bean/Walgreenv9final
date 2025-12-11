import { useState } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { SlideOut } from './design-system/SlideOut';
import { PageHeader } from './design-system/PageHeader';
import {
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Shield,
  Download,
  Upload,
  UserPlus,
} from 'lucide-react';
import { UserInvitation, mockUserInvitations, UserRole, sites } from '../lib/mockData';
import { toast } from 'sonner';

interface UserManagementProps {
  currentUserRole: 'executive' | 'vp' | 'site-manager' | 'supervisor';
}

export function UserManagement({ currentUserRole }: UserManagementProps) {
  const [invitations, setInvitations] = useState<UserInvitation[]>(mockUserInvitations);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'supervisor' as UserRole,
    siteId: '',
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
              User management can only be accessed by VPs and Executives.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSendInvite = () => {
    if (!newInvite.email || !newInvite.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    const site = sites.find(s => s.id === newInvite.siteId);
    const invitation: UserInvitation = {
      id: `invite-${Date.now()}`,
      email: newInvite.email,
      role: newInvite.role,
      siteId: newInvite.siteId || undefined,
      siteName: site?.name,
      invitedBy: 'current-user-id',
      invitedByName: 'Current User',
      invitedAt: new Date().toISOString(),
      status: newInvite.role === 'executive' ? 'approved' : 'pending',
    };

    setInvitations([...invitations, invitation]);
    setNewInvite({ email: '', role: 'supervisor', siteId: '' });
    setShowInviteDialog(false);
    toast.success(`Invitation sent to ${newInvite.email}`);
  };

  const handleApprove = (inviteId: string) => {
    setInvitations(
      invitations.map(inv =>
        inv.id === inviteId
          ? { ...inv, status: 'approved', approvedAt: new Date().toISOString() }
          : inv
      )
    );
    toast.success('User invitation approved');
  };

  const handleReject = (inviteId: string) => {
    setInvitations(
      invitations.map(inv =>
        inv.id === inviteId
          ? { ...inv, status: 'rejected', approvedAt: new Date().toISOString() }
          : inv
      )
    );
    toast.success('User invitation rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="badge-success">
            <CheckCircle size={12} />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="badge-error">
            <XCircle size={12} />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="badge-pending">
            <Clock size={12} />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const approvedInvitations = invitations.filter(inv => inv.status === 'approved');
  const rejectedInvitations = invitations.filter(inv => inv.status === 'rejected');

  return (
    <div className="settings-content-wrapper">
      <div className="settings-header">
        <div className="settings-header-content">
          <PageHeader
            title="User Management"
            description="Manage user invitations, approvals, and access permissions"
            actions={
              <>
                <Button variant="outline" onClick={() => toast.info('Export functionality coming soon')}>
                  <Download size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Export Users
                </Button>
                <Button variant="outline" onClick={() => toast.info('Bulk import functionality coming soon')}>
                  <Upload size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Bulk Import
                </Button>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <UserPlus size={16} style={{ marginRight: 'var(--spacing-2)' }} />
                  Invite User
                </Button>
              </>
            }
          />
        </div>
      </div>

      <div className="settings-scrollable-content">
        {/* Statistics - Minimal Design */}
        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="stat-card-label" style={{ color: '#ca8a04' }}>
                  Pending Approvals
                </p>
                <p className="stat-card-value" style={{ color: '#ca8a04' }}>
                  {pendingInvitations.length}
                </p>
              </div>
              <Clock size={32} style={{ color: '#ca8a04', opacity: 0.2 }} />
            </div>
          </div>
          
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="stat-card-label" style={{ color: '#16a34a' }}>
                  Approved
                </p>
                <p className="stat-card-value" style={{ color: '#16a34a' }}>
                  {approvedInvitations.length}
                </p>
              </div>
              <CheckCircle size={32} style={{ color: '#16a34a', opacity: 0.2 }} />
            </div>
          </div>
          
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="stat-card-label" style={{ color: '#dc2626' }}>
                  Rejected
                </p>
                <p className="stat-card-value" style={{ color: '#dc2626' }}>
                  {rejectedInvitations.length}
                </p>
              </div>
              <XCircle size={32} style={{ color: '#dc2626', opacity: 0.2 }} />
            </div>
          </div>
          
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="stat-card-label">
                  Total Invitations
                </p>
                <p className="stat-card-value">
                  {invitations.length}
                </p>
              </div>
              <Mail size={32} style={{ color: 'var(--color-muted-foreground)', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        {pendingInvitations.length > 0 && (
          <div className="settings-section">
            <h3 className="section-title">
              Pending Approvals ({pendingInvitations.length})
            </h3>
            <p className="section-description">
              Review and approve user access requests
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {pendingInvitations.map((invite) => (
                <div
                  key={invite.id}
                  className="setting-row"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                        <Mail size={16} style={{ color: 'var(--color-muted-foreground)' }} />
                        <span>{invite.email}</span>
                        {getStatusBadge(invite.status)}
                      </div>
                      
                      <div className="grid-2-col" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted-foreground)' }}>
                        <div>
                          <p className="stat-card-label">Role</p>
                          <Badge variant="outline" className="badge-with-icon">
                            <Shield size={12} />
                            {invite.role}
                          </Badge>
                        </div>
                        {invite.siteName && (
                          <div>
                            <p className="stat-card-label">Site</p>
                            <Badge variant="outline" className="badge-with-icon">
                              <Building2 size={12} />
                              {invite.siteName}
                            </Badge>
                          </div>
                        )}
                        <div>
                          <p className="stat-card-label">Invited By</p>
                          <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{invite.invitedByName}</p>
                        </div>
                        <div>
                          <p className="stat-card-label">Invited On</p>
                          <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{formatDate(invite.invitedAt)}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginLeft: 'var(--spacing-4)' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(invite.id)}
                      >
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(invite.id)}>
                        <CheckCircle size={16} style={{ marginRight: 'var(--spacing-1)' }} />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Invitations */}
        <div className="settings-section">
          <h3 className="section-title">All Invitations</h3>
          <p className="section-description">
            Complete history of user invitations and their status
          </p>

          {invitations.length === 0 ? (
            <div className="empty-state">
              <Mail className="empty-state-icon" size={48} style={{ opacity: 0.2 }} />
              <h4 className="empty-state-title">No invitations yet</h4>
              <p className="empty-state-description">Click "Invite User" to get started</p>
            </div>
          ) : (
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="setting-row"
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                          <span style={{ fontSize: 'var(--text-sm)' }}>
                            {invite.email}
                          </span>
                          {getStatusBadge(invite.status)}
                          <Badge variant="outline" className="badge-role">
                            {invite.role}
                          </Badge>
                          {invite.siteName && (
                            <Badge variant="outline" className="badge-role">
                              {invite.siteName}
                            </Badge>
                          )}
                        </div>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-muted-foreground)',
                          margin: 0
                        }}>
                          Invited by {invite.invitedByName} on {formatDate(invite.invitedAt)}
                          {invite.approvedAt &&
                            ` • ${invite.status} on ${formatDate(invite.approvedAt)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Sidebar */}
      <SlideOut
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        title="Invite New User"
        description="Send an invitation to a new user to join the platform"
        icon={<UserPlus size={18} />}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvite}>
              <Mail size={16} style={{ marginRight: 'var(--spacing-2)' }} />
              Send Invitation
            </Button>
          </>
        }
      >
            <div>
              <Label className="label-field">Email Address *</Label>
              <Input
                type="email"
                placeholder="user@acme.com"
                value={newInvite.email}
                onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
              />
            </div>

            <div>
              <Label className="label-field">Role *</Label>
              <Select
                value={newInvite.role}
                onValueChange={(value) => setNewInvite({ ...newInvite, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="site-manager">Site Manager</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newInvite.role !== 'vp' && (
              <div>
                <Label className="label-field">Site</Label>
                <Select
                  value={newInvite.siteId}
                  onValueChange={(value) => setNewInvite({ ...newInvite, siteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div style={{
              padding: 'var(--spacing-3)',
              backgroundColor: 'var(--color-info-light)',
              border: '1px solid var(--color-info)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-sm)',
            }}>
              <p style={{ color: 'var(--color-info)', margin: 0 }}>
                {newInvite.role === 'executive'
                  ? 'Executives have access to all sites and can manage system-wide dashboards.'
                  : newInvite.role === 'site-manager'
                  ? 'Site Managers can manage dashboards and data for their assigned site. Requires Executive approval.'
                  : 'Supervisors can view dashboards and enter data for their site. Requires Executive approval.'}
              </p>
            </div>
      </SlideOut>
    </div>
  );
}