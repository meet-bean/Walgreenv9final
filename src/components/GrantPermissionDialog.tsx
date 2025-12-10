import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './design-system/Dialog';
import { Button } from './design-system/Button';
import { Label } from './design-system/Label';
import { Textarea } from './design-system/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Checkbox } from './design-system/Checkbox';
import { Input } from './design-system/Input';
import { Badge } from './design-system/Badge';
import { Alert, AlertDescription } from './design-system/Alert';
import { UserCheck, Building2, Calendar, AlertCircle } from 'lucide-react';
import { grantDataInputPermission, UserRole, sites } from '../lib/mockData';
import { toast } from 'sonner';

interface GrantPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userName: string;
}

export function GrantPermissionDialog({ open, onClose, onSuccess, userName }: GrantPermissionDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [allSites, setAllSites] = useState(true);
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleReset = () => {
    setSelectedRole('');
    setSelectedSites([]);
    setAllSites(true);
    setHasExpiration(false);
    setExpirationDate('');
    setNotes('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const handleAllSitesToggle = (checked: boolean) => {
    setAllSites(checked);
    if (checked) {
      setSelectedSites([]);
    }
  };

  const handleGrant = () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    if (!allSites && selectedSites.length === 0) {
      toast.error('Please select at least one site or choose "All Sites"');
      return;
    }

    if (hasExpiration && !expirationDate) {
      toast.error('Please select an expiration date');
      return;
    }

    const permission = {
      grantedBy: userName,
      role: selectedRole as UserRole,
      siteIds: allSites ? [] : selectedSites,
      isActive: true,
      expiresAt: hasExpiration ? new Date(expirationDate).toISOString() : undefined,
      notes: notes.trim() || undefined,
    };

    grantDataInputPermission(permission);

    const roleName = {
      'site-manager': 'Site Managers',
      'supervisor': 'Supervisors',
      'executive': 'Executives',
    }[selectedRole as UserRole];

    toast.success('Permission granted successfully!', {
      description: `${roleName} can now input data ${allSites ? 'for all sites' : `for ${selectedSites.length} site${selectedSites.length !== 1 ? 's' : ''}`}.`,
    });

    handleReset();
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-info" />
            Grant Data Input Permission
          </DialogTitle>
          <DialogDescription>
            Allow a role to input daily actual volumes and performance data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Users with data input permission will see the "Data Input" option and can enter 
              actual volumes for their job functions. This permission can be revoked at any time.
            </AlertDescription>
          </Alert>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Select Role *
            </Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Choose which role to grant permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="site-manager">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-info-light border-info-light">
                      Site Manager
                    </Badge>
                    <span>Site Managers</span>
                  </div>
                </SelectItem>
                <SelectItem value="supervisor">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Supervisor
                    </Badge>
                    <span>Supervisors</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Note: Executives always have data input permission
            </p>
          </div>

          {/* Site Selection */}
          <div className="space-y-3">
            <Label>
              Sites *
            </Label>
            
            {/* All Sites Checkbox */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
              <Checkbox 
                id="all-sites" 
                checked={allSites}
                onCheckedChange={handleAllSitesToggle}
              />
              <label
                htmlFor="all-sites"
                className="flex-1 text-sm cursor-pointer flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">All Sites</span>
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              </label>
            </div>

            {/* Individual Sites */}
            {!allSites && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  Select specific sites (at least one required):
                </p>
                {sites.map((site) => (
                  <div key={site.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`site-${site.id}`}
                      checked={selectedSites.includes(site.id)}
                      onCheckedChange={() => handleSiteToggle(site.id)}
                    />
                    <label
                      htmlFor={`site-${site.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <span className="text-gray-900">{site.name}</span>
                      <span className="text-gray-500 ml-2">• {site.location}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-expiration"
                checked={hasExpiration}
                onCheckedChange={setHasExpiration}
              />
              <label
                htmlFor="has-expiration"
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Set expiration date (optional)</span>
              </label>
            </div>

            {hasExpiration && (
              <div className="pl-6">
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Permission will automatically expire on this date
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this permission (e.g., reason for granting, special conditions, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedRole && (
            <div className="p-4 bg-info-light border border-info-light rounded-lg space-y-2">
              <p className="text-sm text-gray-900">
                <strong>Summary:</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>
                  • <strong>
                    {selectedRole === 'site-manager' ? 'Site Managers' : 'Supervisors'}
                  </strong> will be able to input data
                </li>
                <li>
                  • Access: <strong>
                    {allSites ? 'All Sites' : `${selectedSites.length} selected site${selectedSites.length !== 1 ? 's' : ''}`}
                  </strong>
                </li>
                {hasExpiration && expirationDate && (
                  <li>
                    • Expires: <strong>{new Date(expirationDate).toLocaleDateString()}</strong>
                  </li>
                )}
                {!hasExpiration && (
                  <li>
                    • Duration: <strong>No expiration</strong>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleGrant}>
            Grant Permission
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
