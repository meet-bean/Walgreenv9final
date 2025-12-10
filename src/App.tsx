import { useState, useEffect } from 'react';
import { Toaster } from './components/design-system/Toast';
import { LoginScreen } from './components/LoginScreen';
import { MainApp } from './components/MainApp';
import { ErrorBoundary } from './components/ErrorBoundary';

export type UserRole = 'executive' | 'site-manager' | 'supervisor' | null;

export interface User {
  id: string;
  role: UserRole;
  name: string;
  siteId?: string;
  jobFunctionId?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Expose a reset function for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetDashboards = () => {
        localStorage.removeItem('customDashboards');
        console.log('🔄 localStorage cleared. Refreshing page...');
        window.location.reload();
      };
      console.log('💡 Debug utility loaded. Run resetDashboards() to clear and reset all dashboards.');
    }
  }, []);

  // Suppress CSS access errors from external stylesheets (e.g., Google Fonts)
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if this is the CSS rules access error
      if (
        event.message?.includes('cssRules') ||
        event.message?.includes('CSSStyleSheet')
      ) {
        // Suppress this specific error as it's a known CORS limitation with external stylesheets
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Handle unhandled promise rejections to prevent silent crashes
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent default behavior (console error)
      event.preventDefault();
      
      // You could show a toast notification here
      // toast.error('An unexpected error occurred');
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  const handleLogin = (role: UserRole, name: string, siteId?: string, jobFunctionId?: string) => {
    setUser({ id: `user-${Date.now()}`, role, name, siteId, jobFunctionId });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ErrorBoundary fallbackTitle="Dashboard Application Error">
      <Toaster />
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainApp user={user} onLogout={handleLogout} />
      )}
    </ErrorBoundary>
  );
}
