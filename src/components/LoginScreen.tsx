import { Card, CardDescription, CardTitle } from './design-system/Card';
import { Button } from './design-system/Button';
import { Building2, User, LogIn } from 'lucide-react';
import { UserRole } from '../App';

interface LoginScreenProps {
  onLogin: (role: UserRole, name: string, siteId?: string, jobFunctionId?: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#ffffff' 
    }}>
      <div style={{ width: '100%', maxWidth: '448px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', marginBottom: 'var(--spacing-4)', color: 'var(--foreground)' }}>Acme Inc.</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {/* SSO Login */}
          <Button
            style={{ width: '100%', justifyContent: 'center' }}
            size="lg"
            onClick={() => onLogin('executive', 'Alex Johnson')}
          >
            <LogIn style={{ marginRight: 'var(--spacing-2)', height: '20px', width: '20px' }} />
            Sign in with SSO
          </Button>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.3)' }} />
            </div>
            <div style={{ 
              position: 'relative', 
              display: 'flex', 
              justifyContent: 'center', 
              fontSize: 'var(--text-xs)', 
              textTransform: 'uppercase' 
            }}>
              <span style={{ 
                backgroundColor: 'transparent', 
                padding: '0 var(--spacing-2)', 
                color: 'var(--muted-foreground)'
              }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Demo Logins */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Button
              style={{ width: '100%', justifyContent: 'flex-start' }}
              variant="outline"
              size="lg"
              onClick={() => onLogin('executive', 'Alex Johnson')}
            >
              <User style={{ marginRight: 'var(--spacing-2)', height: '20px', width: '20px' }} />
              Sign in as Executive (DVP)
            </Button>
            <Button
              style={{ width: '100%', justifyContent: 'flex-start' }}
              variant="outline"
              size="lg"
              onClick={() => onLogin('site-manager', 'Sarah Chen', 'DC-001')}
            >
              <Building2 style={{ marginRight: 'var(--spacing-2)', height: '20px', width: '20px' }} />
              Sign in as Site Manager
            </Button>
            <Button
              style={{ width: '100%', justifyContent: 'flex-start' }}
              variant="outline"
              size="lg"
              onClick={() => onLogin('supervisor', 'Mike Rodriguez', 'DC-001', 'receiving')}
            >
              <User style={{ marginRight: 'var(--spacing-2)', height: '20px', width: '20px' }} />
              Sign in as Supervisor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}