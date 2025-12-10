import { useState, useEffect } from 'react';
import { Card, CardTitle } from './design-system/Card';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Alert, AlertDescription } from './design-system/Alert';
import { Badge } from './design-system/Badge';
import { 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2,
  FileSpreadsheet,
  PlayCircle,
  Clock,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { toast } from './design-system/Toast';
import {
  getAllGoogleSheetsConnections,
  saveGoogleSheetsConnection,
  deleteGoogleSheetsConnection,
  syncGoogleSheet,
  fetchSpreadsheetMetadata,
  extractSpreadsheetId,
  isValidGoogleSheetsUrl,
  type GoogleSheetsConnection,
  type DatasetType,
} from '../lib/googleSheetsService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';

interface GoogleSheetsIntegrationProps {
  datasetType: DatasetType;
}

export function GoogleSheetsIntegration({ datasetType }: GoogleSheetsIntegrationProps) {
  const [connections, setConnections] = useState<GoogleSheetsConnection[]>([]);
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    spreadsheetUrl: '',
    sheetName: '',
    syncFrequency: 'manual' as 'manual' | 'hourly' | '6hours' | 'daily',
  });
  const [availableSheets, setAvailableSheets] = useState<Array<{ name: string; rowCount: number; columnCount: number }>>([]);
  const [isFetchingSheets, setIsFetchingSheets] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = () => {
    const allConnections = getAllGoogleSheetsConnections();
    setConnections(allConnections);
  };

  const handleFetchSheets = async () => {
    const spreadsheetId = extractSpreadsheetId(newConnection.spreadsheetUrl);
    
    if (!spreadsheetId) {
      toast.error('Invalid Google Sheets URL');
      setTestResult({ success: false, message: 'Invalid Google Sheets URL format' });
      return;
    }

    setIsFetchingSheets(true);
    setTestResult(null);
    
    try {
      const metadata = await fetchSpreadsheetMetadata(spreadsheetId);
      setAvailableSheets(metadata.sheets);
      setTestResult({ 
        success: true, 
        message: `Connected to "${metadata.name}" with ${metadata.sheets.length} sheets` 
      });
      toast.success('Successfully connected to Google Sheet!');
    } catch (error: any) {
      console.error('Failed to fetch sheets:', error);
      setTestResult({ success: false, message: error.message || 'Failed to connect to Google Sheet' });
      toast.error('Failed to connect to Google Sheet');
    } finally {
      setIsFetchingSheets(false);
    }
  };

  const handleAddConnection = async () => {
    const spreadsheetId = extractSpreadsheetId(newConnection.spreadsheetUrl);
    
    if (!spreadsheetId || !newConnection.sheetName) {
      toast.error('Please select a sheet to connect');
      return;
    }

    try {
      const metadata = await fetchSpreadsheetMetadata(spreadsheetId);
      const selectedSheet = metadata.sheets.find(s => s.name === newConnection.sheetName);
      
      const connection = saveGoogleSheetsConnection({
        name: `${metadata.name} - ${newConnection.sheetName}`,
        spreadsheetId,
        spreadsheetName: metadata.name,
        sheetName: newConnection.sheetName,
        spreadsheetUrl: newConnection.spreadsheetUrl,
        datasetType: datasetType,
        syncFrequency: newConnection.syncFrequency,
        isActive: true,
        rowCount: selectedSheet?.rowCount,
        columnCount: selectedSheet?.columnCount,
      });

      toast.success('Google Sheet connected successfully!');
      loadConnections();
      setIsAddingConnection(false);
      setNewConnection({
        spreadsheetUrl: '',
        sheetName: '',
        syncFrequency: 'manual',
      });
      setAvailableSheets([]);
      setTestResult(null);
    } catch (error: any) {
      console.error('Failed to add connection:', error);
      toast.error('Failed to connect Google Sheet');
    }
  };

  const handleSync = async (connectionId: string) => {
    setIsSyncing(connectionId);
    
    try {
      const result = await syncGoogleSheet(connectionId);
      
      if (result.success) {
        toast.success(`Synced ${result.rowCount} rows successfully!`);
        loadConnections();
      } else {
        toast.error(result.error || 'Sync failed');
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error('Failed to sync Google Sheet');
    } finally {
      setIsSyncing(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this Google Sheets connection?')) {
      deleteGoogleSheetsConnection(id);
      toast.success('Connection removed');
      loadConnections();
    }
  };

  const getSyncFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'hourly': return 'Every hour';
      case '6hours': return 'Every 6 hours';
      case 'daily': return 'Daily';
      case 'manual': return 'Manual only';
      default: return frequency;
    }
  };

  return (
    <>
      {/* Info Alert */}
      <Alert variant="default">
        <FileSpreadsheet style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
        <AlertDescription>
          <p style={{ margin: 0, marginBottom: 'var(--spacing-2)' }}>
            Connect your Google Sheets for automatic data synchronization. Your data stays in Google Sheets while syncing to the dashboard.
          </p>
          <ul className="integrations-feature-list">
            <li>✅ Real-time sync from Google Sheets</li>
            <li>✅ No file uploads needed</li>
            <li>✅ Supports budget, actual, and combined data</li>
            <li>✅ Scheduled automatic updates</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Add New Connection */}
      <Card>
        <div className="data-source-card-header-row">
          <div>
            <CardTitle>Connect Google Sheet</CardTitle>
            <p className="card-description">
              Link a Google Sheets spreadsheet to automatically import data
            </p>
          </div>
          {!isAddingConnection && (
            <Button onClick={() => setIsAddingConnection(true)}>
              <Link2 style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
              Add Connection
            </Button>
          )}
        </div>
        
        {isAddingConnection && (
          <div className="card-content-data-source">
            {/* Step 1: Enter URL */}
            <div className="form-field">
              <Label className="label-step">
                Step 1: Google Sheets URL
              </Label>
              <div className="form-field-row">
                <Input
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={newConnection.spreadsheetUrl}
                  onChange={(e) => setNewConnection({ ...newConnection, spreadsheetUrl: e.target.value })}
                  style={{ flex: 1 }}
                />
                <Button
                  onClick={handleFetchSheets}
                  disabled={!isValidGoogleSheetsUrl(newConnection.spreadsheetUrl) || isFetchingSheets}
                >
                  {isFetchingSheets ? (
                    <>
                      <RefreshCw style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)', animation: 'spin 1s linear infinite' }} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
                      Connect
                    </>
                  )}
                </Button>
              </div>
              <p className="field-hint">
                Paste the full URL from your browser's address bar
              </p>
            </div>

            {/* Test Result */}
            {testResult && (
              <Alert variant={testResult.success ? 'success' : 'destructive'}>
                {testResult.success ? (
                  <CheckCircle2 style={{ color: 'var(--chart-2)', height: '16px', width: '16px' }} />
                ) : (
                  <AlertCircle style={{ color: 'var(--destructive)', height: '16px', width: '16px' }} />
                )}
                <AlertDescription>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Step 2: Select Sheet */}
            {availableSheets.length > 0 && (
              <>
                <div className="form-field">
                  <Label className="label-step">
                    Step 2: Select Sheet/Tab
                  </Label>
                  <Select
                    value={newConnection.sheetName}
                    onValueChange={(value) => setNewConnection({ ...newConnection, sheetName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a sheet to sync..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSheets.map((sheet) => (
                        <SelectItem key={sheet.name} value={sheet.name}>
                          {sheet.name} ({sheet.rowCount} rows × {sheet.columnCount} columns)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 3: Sync Frequency */}
                <div className="form-field">
                  <Label className="label-step">
                    Step 3: Sync Frequency
                  </Label>
                  <Select
                    value={newConnection.syncFrequency}
                    onValueChange={(value: any) => setNewConnection({ ...newConnection, syncFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual only (sync when you click)</SelectItem>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="6hours">Every 6 hours</SelectItem>
                      <SelectItem value="daily">Daily at midnight</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="field-hint">
                    Choose how often to automatically sync data from Google Sheets
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingConnection(false);
                      setNewConnection({ spreadsheetUrl: '', sheetName: '', syncFrequency: 'manual' });
                      setAvailableSheets([]);
                      setTestResult(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddConnection}
                    disabled={!newConnection.sheetName}
                  >
                    <CheckCircle2 style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
                    Connect Sheet
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Connected Sheets */}
      {connections.length > 0 && (
        <Card>
          <div className="data-source-card-header-row">
            <div>
              <CardTitle>Connected Google Sheets ({connections.length})</CardTitle>
              <p className="card-description">
                Manage your connected spreadsheets and sync data
              </p>
            </div>
          </div>
          <div className="card-content-data-source">
            {connections.map((connection) => (
              <div key={connection.id} className="connection-card">
                <div className="connection-card-header">
                  <div className="connection-card-info">
                    <div className="connection-card-title-row">
                      <FileSpreadsheet style={{ color: 'var(--primary)', height: '16px', width: '16px' }} />
                      <p className="connection-card-name">
                        {connection.spreadsheetName}
                      </p>
                      <Badge variant="outline">
                        {connection.sheetName}
                      </Badge>
                      <Badge variant="outline" style={{
                        backgroundColor: connection.datasetType === 'budget' ? 'rgba(59, 130, 246, 0.1)' :
                                       connection.datasetType === 'actual' ? 'rgba(16, 185, 129, 0.1)' :
                                       'rgba(168, 85, 247, 0.1)',
                        borderColor: connection.datasetType === 'budget' ? 'var(--chart-1)' :
                                   connection.datasetType === 'actual' ? 'var(--chart-2)' :
                                   'var(--chart-3)'
                      }}>
                        {connection.datasetType === 'budget' ? '📊 Budget' :
                         connection.datasetType === 'actual' ? '✅ Actual' :
                         '📈 Combined'}
                      </Badge>
                    </div>
                    <div className="connection-card-meta">
                      <p className="connection-meta-item">
                        <Clock style={{ height: '12px', width: '12px' }} />
                        {getSyncFrequencyLabel(connection.syncFrequency)}
                      </p>
                      {connection.lastSync && (
                        <p className="connection-meta-item">
                          Last synced: {new Date(connection.lastSync).toLocaleString()}
                        </p>
                      )}
                      {connection.rowCount && (
                        <p className="connection-meta-item">
                          {connection.rowCount} rows × {connection.columnCount} columns
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="connection-card-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(connection.spreadsheetUrl, '_blank')}
                    >
                      <ExternalLink style={{ height: '16px', width: '16px' }} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(connection.id)}
                      disabled={isSyncing === connection.id}
                    >
                      {isSyncing === connection.id ? (
                        <RefreshCw style={{ height: '16px', width: '16px', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <PlayCircle style={{ height: '16px', width: '16px' }} />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(connection.id)}
                    >
                      <Trash2 style={{ height: '16px', width: '16px' }} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Setup Instructions */}
      <Alert variant="warning">
        <AlertTriangle style={{ color: 'var(--chart-3)', height: '16px', width: '16px' }} />
        <AlertDescription>
          <p style={{ margin: 0, marginBottom: 'var(--spacing-2)' }}>
            <strong>Note:</strong> This is a demo implementation. In production, you'll need to:
          </p>
          <ol className="integrations-setup-list">
            <li>Create a Google Cloud Project and enable Google Sheets API</li>
            <li>Set up OAuth 2.0 credentials</li>
            <li>Configure authorized redirect URIs</li>
            <li>Implement proper authentication flow</li>
            <li>Store credentials securely (use Supabase, not localStorage)</li>
          </ol>
          <p style={{ margin: 0, marginTop: 'var(--spacing-2)', fontSize: 'var(--text-label)' }}>
            See <code>/lib/googleSheetsService.ts</code> for detailed setup instructions.
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
}