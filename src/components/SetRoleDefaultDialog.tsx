import React, { useState, useEffect } from 'react';
import { SlideOut } from './design-system/SlideOut';
import { Button } from './design-system/Button';
import { Checkbox } from './design-system/Checkbox';
import { Label } from './design-system/Label';
import { UserRole } from '../lib/mockData';
import { Star, Users, Briefcase, UserCog } from 'lucide-react';

interface SetRoleDefaultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardName: string;
  currentRoles: UserRole[];
  onConfirm: (selectedRoles: UserRole[]) => void;
}

const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; description: string }> = {
  'executive': {
    label: 'Executives',
    icon: <Briefcase size={18} style={{ color: 'var(--color-info)' }} />,
    description: 'VPs and senior leadership'
  },
  'site-manager': {
    label: 'Site Managers',
    icon: <UserCog size={18} style={{ color: 'var(--color-success)' }} />,
    description: 'Managers overseeing site operations'
  },
  'supervisor': {
    label: 'Supervisors',
    icon: <Users size={18} style={{ color: 'var(--color-warning)' }} />,
    description: 'Team leads and supervisors'
  }
};

export function SetRoleDefaultDialog({
  isOpen,
  onClose,
  dashboardName,
  currentRoles,
  onConfirm
}: SetRoleDefaultDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(currentRoles);

  // Reset selected roles when dialog opens or currentRoles changes
  useEffect(() => {
    if (isOpen) {
      setSelectedRoles(currentRoles);
    }
  }, [isOpen, currentRoles]);

  const handleToggleRole = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedRoles);
    onClose();
  };

  const handleClear = () => {
    onConfirm([]);
    onClose();
  };

  return (
    <SlideOut
      open={isOpen}
      onClose={onClose}
      title="Set Default Dashboard"
      description={
        <>
          Choose which roles should see <strong>"{dashboardName}"</strong> as their default dashboard on login.
        </>
      }
      icon={<Star size={18} style={{ color: 'var(--color-warning)' }} fill="var(--color-warning)" />}
      footer={
        <>
          {currentRoles.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClear}
            >
              Clear Default
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={selectedRoles.length === 0}
            style={{
              backgroundColor: selectedRoles.length > 0 ? 'var(--color-warning)' : undefined,
              borderColor: selectedRoles.length > 0 ? 'var(--color-warning)' : undefined
            }}
          >
            <Star size={16} style={{ marginRight: 'var(--spacing-2)' }} />
            Set as Default
          </Button>
        </>
      }
    >

        {/* Role Selection */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-6)'
        }}>
          {(Object.keys(roleLabels) as UserRole[]).map(role => {
            const { label, icon, description } = roleLabels[role];
            const isChecked = selectedRoles.includes(role);
            
            return (
              <div 
                key={role}
                onClick={() => handleToggleRole(role)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-3)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius)',
                  border: `2px solid ${isChecked ? 'var(--color-warning)' : 'var(--border)'}`,
                  backgroundColor: isChecked ? 'var(--color-warning-light)' : 'var(--background)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-default)'
                }}
                onMouseEnter={(e) => {
                  if (!isChecked) {
                    e.currentTarget.style.borderColor = 'var(--muted-foreground)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isChecked) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
              >
                <Checkbox
                  id={`role-${role}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggleRole(role)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div style={{ flex: 1 }}>
                  <Label
                    htmlFor={`role-${role}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      cursor: 'pointer',
                      marginBottom: 'var(--spacing-1)'
                    }}
                  >
                    {icon}
                    <span style={{
                      fontFamily: 'var(--font-family-inter)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--foreground)'
                    }}>
                      {label}
                    </span>
                  </Label>
                  <p style={{
                    fontFamily: 'var(--font-family-inter)',
                    fontSize: 'var(--text-label)',
                    color: 'var(--muted-foreground)',
                    margin: 0
                  }}>
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        <div 
          style={{
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--muted)',
            marginBottom: 'var(--spacing-6)'
          }}
        >
          <p style={{
            fontFamily: 'var(--font-family-inter)',
            fontSize: 'var(--text-label)',
            color: 'var(--muted-foreground)',
            margin: 0,
            lineHeight: 1.5
          }}>
            <strong>Note:</strong> Users with these roles will see this dashboard first when they log in. This setting applies to all users with the selected roles.
          </p>
        </div>
    </SlideOut>
  );
}
