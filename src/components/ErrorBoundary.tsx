import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './design-system/Button';
import { Card } from './design-system/Card';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You could send error reports to a logging service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleClearCache = () => {
    // Clear potentially corrupted data from localStorage
    const keysToKeep = ['theme', 'language']; // Preserve user preferences
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error('Failed to clear localStorage key:', key, e);
        }
      }
    });

    // Reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-8 bg-background"
        >
          <Card className="w-full max-w-2xl border-destructive">
            <div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="ds-card-title text-2xl">
                    {this.props.fallbackTitle || 'Something went wrong'}
                  </h3>
                  <p className="ds-card-description mt-2">
                    The application encountered an unexpected error. You can try the options below to recover.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <p 
                    className="text-sm mb-2"
                    style={{ 
                      fontFamily: 'var(--font-family-mono)',
                      color: 'var(--color-destructive)' 
                    }}
                  >
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        View stack trace
                      </summary>
                      <pre 
                        className="mt-2 text-xs overflow-auto max-h-64 p-3 bg-background rounded border border-border"
                        style={{ fontFamily: 'var(--font-family-mono)' }}
                      >
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Recovery Actions */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleReset}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleClearCache}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Clear Cache & Reload
                </Button>

                <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                  size="lg"
                  variant="ghost"
                >
                  Return to Home
                </Button>
              </div>

              {/* Help Text */}
              <div 
                className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground"
              >
                <p className="mb-2">
                  <strong>What happened?</strong>
                </p>
                <p className="mb-3">
                  A component in the application crashed. This might be due to corrupted data, a network issue, or an unexpected condition.
                </p>
                <p className="mb-2">
                  <strong>What to try:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Click "Try Again" to reset the current view</li>
                  <li>Click "Clear Cache & Reload" if the problem persists</li>
                  <li>Contact support if neither option works</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}