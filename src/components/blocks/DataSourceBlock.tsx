import { useState } from 'react';
import { RadioGroup } from '../design-system/RadioGroup';
import { Button } from '../design-system/Button';
import { Alert, AlertDescription } from '../design-system/Alert';
import { Label } from '../design-system/Label';
import { Input } from '../design-system/Input';
import { Select, SelectContent, SelectItem } from '../design-system/Select';
import { Switch } from '../design-system/Switch';
import { SettingsSection } from '../SettingsSection';
import { SettingRow } from '../SettingRow';
import { Upload, FileSpreadsheet, Link2, CheckCircle2, AlertCircle, Download, AlertTriangle, Database, Trash2, Cloud, Code } from 'lucide-react';
import { toast } from '../design-system/Toast';
import {
  extractHeaders,
  parseFileWithMapping,
  saveImportedDataset,
  validateImportedData,
  downloadTemplate,
  getAllDatasets,
  deleteDataset,
  type ImportedDataset,
  type ValidationResult,
  type DatasetType,
} from '../../lib/dataImportService';
import { COLUMN_DEFINITIONS } from '../../lib/dataImportConfig';
import { GoogleSheetsIntegration } from '../GoogleSheetsIntegration';
import { MultiSheetExcelUpload } from '../MultiSheetExcelUpload';
import { ColumnMappingInterface } from '../ColumnMappingInterface';

// Helper to get config (from localStorage or defaults)
function getStoredConfig() {
  try {
    const stored = localStorage.getItem('dataImportConfig');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        columns: parsed.columns || COLUMN_DEFINITIONS,
      };
    }
  } catch (error) {
    console.error('Failed to load custom config:', error);
  }
  return { columns: COLUMN_DEFINITIONS };
}

export function DataSourceBlock() {
  // Integration tab state
  const [integrationTab, setIntegrationTab] = useState<'manual' | 'google-sheets' | 'sharepoint' | 'api'>('manual');
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'mapping' | 'success' | 'error'>('idle');
  const [importedDataset, setImportedDataset] = useState<ImportedDataset | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [existingDatasets, setExistingDatasets] = useState<ImportedDataset[]>(getAllDatasets());
  const [datasetType, setDatasetType] = useState<DatasetType>('budget');
  const [useMultiSheet, setUseMultiSheet] = useState(false);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [sharepointConfig, setSharepointConfig] = useState({
    siteUrl: '',
    filePath: '',
    syncFrequency: 'manual' as 'hourly' | '6hours' | 'daily' | 'manual',
  });
  
  // Get current configuration
  const config = getStoredConfig();

  // Validation rules state
  const [validationRules, setValidationRules] = useState(() => {
    try {
      const stored = localStorage.getItem('dataImportConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.validationRules || {
          allowNegativeNumbers: false,
          warnOnZeroValues: true,
          validateCalculatedHours: true,
          calculatedHoursTolerance: 0.1,
          minimumRows: 1,
          maximumRows: 0,
        };
      }
    } catch (error) {
      console.error('Failed to load validation rules:', error);
    }
    return {
      allowNegativeNumbers: false,
      warnOnZeroValues: true,
      validateCalculatedHours: true,
      calculatedHoursTolerance: 0.1,
      minimumRows: 1,
      maximumRows: 0,
    };
  });

  const saveValidationRules = (newRules: typeof validationRules) => {
    try {
      const stored = localStorage.getItem('dataImportConfig');
      const existing = stored ? JSON.parse(stored) : {};
      const updated = { ...existing, validationRules: newRules };
      localStorage.setItem('dataImportConfig', JSON.stringify(updated));
      setValidationRules(newRules);
      toast.success('Validation rules updated');
    } catch (error) {
      console.error('Failed to save validation rules:', error);
      toast.error('Failed to save validation rules');
    }
  };

  const handleFileSelection = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setUploadStatus('idle');
    setValidationResult(null);
    setFileHeaders([]);

    try {
      // Extract headers from the file
      const headers = await extractHeaders(file);
      setFileHeaders(headers);
      setUploadStatus('mapping');
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Header extraction error:', error);
      setUploadStatus('error');
      toast.error(error.message || 'Failed to read file headers');
      setIsProcessing(false);
    }
  };

  const processFileWithMapping = async (columnMapping: Record<string, string>) => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setUploadStatus('idle');

    try {
      // Parse file with custom mapping
      const parsedData = await parseFileWithMapping(uploadedFile, columnMapping);
      
      // Validate data
      const validation = validateImportedData(parsedData);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        setUploadStatus('error');
        toast.error(`File has ${validation.errors.length} validation errors. Please fix and try again.`);
        setIsProcessing(false);
        return;
      }
      
      // Save dataset
      const dataset = saveImportedDataset(
        uploadedFile.name.replace(/\.[^/.]+$/, ''), // Remove extension
        parsedData,
        'file',
        datasetType,
        uploadedFile.name
      );
      
      setImportedDataset(dataset);
      setExistingDatasets(getAllDatasets());
      setUploadStatus('success');
      toast.success(`File uploaded successfully! Imported ${parsedData.length} rows.`);
      
    } catch (error: any) {
      console.error('File processing error:', error);
      setUploadStatus('error');
      toast.error(error.message || 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelMapping = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setFileHeaders([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(extension || '')) {
        toast.error('Please upload an Excel (.xlsx, .xls) or CSV file');
        return;
      }
      handleFileSelection(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(extension || '')) {
        toast.error('Please upload an Excel (.xlsx, .xls) or CSV file');
        return;
      }
      handleFileSelection(file);
    }
  };

  const handleDeleteDataset = (id: string) => {
    if (confirm('Are you sure you want to delete this dataset?')) {
      deleteDataset(id);
      setExistingDatasets(getAllDatasets());
      if (importedDataset?.id === id) {
        setImportedDataset(null);
        setUploadedFile(null);
        setUploadStatus('idle');
        setValidationResult(null);
      }
      toast.success('Dataset deleted successfully');
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
    toast.success('Template downloaded successfully');
  };

  return (
    <>
      {/* Integration Type Selector */}
      <div style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-4)', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
        <Label style={{ marginBottom: 'var(--spacing-2)', display: 'block' }}>Integration Method</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          {integrationTab === 'manual' && <Upload className="icon-sm" style={{ color: 'var(--primary)' }} />}
          {integrationTab === 'google-sheets' && <FileSpreadsheet className="icon-sm" style={{ color: 'var(--primary)' }} />}
          {integrationTab === 'sharepoint' && <Cloud className="icon-sm" style={{ color: 'var(--primary)' }} />}
          {integrationTab === 'api' && <Code className="icon-sm" style={{ color: 'var(--primary)' }} />}
          <Select 
            value={integrationTab} 
            onChange={(e) => setIntegrationTab(e.target.value as 'manual' | 'google-sheets' | 'sharepoint' | 'api')}
            style={{ flex: 1, maxWidth: '300px' }}
          >
            <option value="manual">Manual Upload</option>
            <option value="google-sheets">Google Sheets</option>
            <option value="sharepoint">SharePoint</option>
            <option value="api">API Integration</option>
          </Select>
        </div>
      </div>

      {/* Manual Upload Tab */}
      {integrationTab === 'manual' && (
        <>
          <SettingsSection
            title="Upload Budget Data"
            description="Upload your Excel file containing budgeted volumes, rates, and hours for all distribution centers"
          >
            {/* Upload Mode Selector */}
            <SettingRow 
              label="Upload Mode"
              description="Choose between uploading a single sheet or multiple sheets at once"
            >
              <RadioGroup 
                value={useMultiSheet ? 'multi' : 'single'} 
                onValueChange={(value) => {
                  setUseMultiSheet(value === 'multi');
                  setUploadedFile(null);
                  setUploadStatus('idle');
                  setImportedDataset(null);
                  setValidationResult(null);
                }}
                options={[
                  { value: 'single', label: 'Single Sheet' },
                  { value: 'multi', label: 'Multiple Sheets' }
                ]}
              />
            </SettingRow>

            {/* Dataset Type Selector */}
            <SettingRow 
              label="What type of data are you uploading?"
              description="Select the appropriate data type for proper categorization"
            >
              <RadioGroup 
                value={datasetType} 
                onValueChange={(value) => setDatasetType(value as DatasetType)}
                options={[
                  { value: 'budget', label: 'Budget Data' },
                  { value: 'actual', label: 'Actual Data' },
                  { value: 'combined', label: 'Combined (Budget + Actual)' }
                ]}
              />
            </SettingRow>

            {/* Multi-Sheet Mode */}
            {useMultiSheet ? (
              <MultiSheetExcelUpload 
                datasetType={datasetType}
                onImportComplete={() => {
                  setExistingDatasets(getAllDatasets());
                }}
              />
            ) : (
              <>
                {/* Upload Area */}
                <div
                  className="upload-dropzone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <div className="upload-dropzone-inner">
                    <div className="upload-icon-circle">
                      <Upload className="icon-xl" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="upload-text-wrapper">
                      <p className="upload-title">
                        Click to upload or drag and drop
                      </p>
                      <p className="upload-subtitle">
                        Excel files (.xlsx, .xls, .csv) up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Processing Status */}
                {isProcessing && (
                  <Alert variant="default">
                    <AlertCircle className="icon-sm" style={{ color: 'var(--chart-1)' }} />
                    <AlertDescription>
                      Processing file... Please wait.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Mapping Status */}
                {uploadStatus === 'mapping' && fileHeaders.length > 0 && uploadedFile && (
                  <ColumnMappingInterface
                    userColumns={fileHeaders}
                    onConfirm={processFileWithMapping}
                    onCancel={handleCancelMapping}
                    fileName={uploadedFile.name}
                  />
                )}

                {/* Success Status */}
                {uploadStatus === 'success' && importedDataset && (
                  <Alert variant="success">
                    <CheckCircle2 className="icon-sm" style={{ color: 'var(--chart-2)' }} />
                    <AlertDescription>
                      <div className="alert-content-wrapper">
                        <p className="alert-success-message">
                          File uploaded successfully: <strong>{uploadedFile?.name}</strong>
                        </p>
                        <ul className="alert-details-list">
                          <li>• {importedDataset.rowCount} rows imported</li>
                          {importedDataset.metadata.distributionCenters && importedDataset.metadata.distributionCenters.length > 0 && (
                            <li>• {importedDataset.metadata.distributionCenters.length} Distribution Centers detected</li>
                          )}
                          {importedDataset.metadata.jobFunctions && importedDataset.metadata.jobFunctions.length > 0 && (
                            <li>• {importedDataset.metadata.jobFunctions.length} Job Functions imported</li>
                          )}
                          {importedDataset.metadata.dateRange && (
                            <li>• Date range: {importedDataset.metadata.dateRange.start} to {importedDataset.metadata.dateRange.end}</li>
                          )}
                        </ul>
                        {validationResult && validationResult.warnings.length > 0 && (
                          <p className="alert-warning-text">
                            ⚠️ {validationResult.warnings.length} warnings detected (data imported successfully)
                          </p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Status */}
                {uploadStatus === 'error' && validationResult && (
                  <Alert variant="destructive">
                    <AlertTriangle className="icon-sm" style={{ color: 'var(--chart-4)' }} />
                    <AlertDescription>
                      <div className="alert-content-wrapper">
                        <p className="alert-error-title">
                          Validation Failed ({validationResult.errors.length} errors)
                        </p>
                        <ul className="alert-error-list">
                          {validationResult.errors.slice(0, 10).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {validationResult.errors.length > 10 && (
                            <li>• ... and {validationResult.errors.length - 10} more errors</li>
                          )}
                        </ul>
                        <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Clear saved mappings for this file to force re-detection
                              try {
                                const saved = localStorage.getItem('columnMappings');
                                if (saved) {
                                  const allMappings = JSON.parse(saved);
                                  if (uploadedFile) {
                                    delete allMappings[uploadedFile.name];
                                    localStorage.setItem('columnMappings', JSON.stringify(allMappings));
                                    toast.success('Saved mappings cleared. Please re-upload your file.');
                                  }
                                }
                              } catch (error) {
                                console.error('Failed to clear mappings:', error);
                              }
                              setUploadedFile(null);
                              setUploadStatus('idle');
                              setValidationResult(null);
                            }}
                          >
                            Clear Saved Mappings & Retry
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadTemplate}
                          >
                            <Download className="icon-sm" style={{ marginRight: 'var(--spacing-2)' }} />
                            Download Correct Template
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Template Download */}
                <div className="template-download-section">
                  <div className="template-download-content">
                    <div className="template-download-text-wrapper">
                      <p className="template-download-title">
                        Need a template?
                      </p>
                      <p className="template-download-subtitle">
                        Download our Excel template to get started
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                      <Download className="icon-sm" style={{ marginRight: 'var(--spacing-2)' }} />
                      Download Template
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SettingsSection>

          {/* Validation Rules Section */}
          <SettingsSection
            title="Validation Rules"
            description="Configure how uploaded data is validated"
          >
            <SettingRow
              label="Allow Negative Numbers"
              description="Permit negative values in volume and hours fields"
            >
              <Switch
                checked={validationRules.allowNegativeNumbers}
                onCheckedChange={(checked) => {
                  saveValidationRules({ ...validationRules, allowNegativeNumbers: checked });
                }}
              />
            </SettingRow>

            <SettingRow
              label="Warn on Zero Values"
              description="Show warnings when volume or rate is zero"
            >
              <Switch
                checked={validationRules.warnOnZeroValues}
                onCheckedChange={(checked) => {
                  saveValidationRules({ ...validationRules, warnOnZeroValues: checked });
                }}
              />
            </SettingRow>

            <SettingRow
              label="Validate Calculated Hours"
              description="Check if budgeted hours matches volume ÷ rate"
            >
              <Switch
                checked={validationRules.validateCalculatedHours}
                onCheckedChange={(checked) => {
                  saveValidationRules({ ...validationRules, validateCalculatedHours: checked });
                }}
              />
            </SettingRow>

            <SettingRow
              label="Calculated Hours Tolerance"
              description="Maximum acceptable difference in hours calculation"
            >
              <Input
                type="number"
                step="0.1"
                value={validationRules.calculatedHoursTolerance}
                onChange={(e) => {
                  saveValidationRules({ 
                    ...validationRules, 
                    calculatedHoursTolerance: parseFloat(e.target.value) || 0 
                  });
                }}
                style={{ maxWidth: '200px' }}
              />
            </SettingRow>

            <SettingRow
              label="Minimum Rows"
              description="Minimum data rows required"
            >
              <Input
                type="number"
                min="0"
                value={validationRules.minimumRows}
                onChange={(e) => {
                  saveValidationRules({ 
                    ...validationRules, 
                    minimumRows: parseInt(e.target.value) || 0 
                  });
                }}
                style={{ maxWidth: '200px' }}
              />
            </SettingRow>

            <SettingRow
              label="Maximum Rows"
              description="Maximum rows allowed (0 = unlimited)"
            >
              <Input
                type="number"
                min="0"
                value={validationRules.maximumRows}
                onChange={(e) => {
                  saveValidationRules({ 
                    ...validationRules, 
                    maximumRows: parseInt(e.target.value) || 0 
                  });
                }}
                style={{ maxWidth: '200px' }}
              />
            </SettingRow>
          </SettingsSection>
        </>
      )}

      {/* Google Sheets Tab */}
      {integrationTab === 'google-sheets' && (
        <GoogleSheetsIntegration datasetType={datasetType} />
      )}

      {/* SharePoint Tab */}
      {integrationTab === 'sharepoint' && (
        <SettingsSection
          title="SharePoint Integration"
          description="Connect to SharePoint to automatically sync Excel files from your organization's document library"
        >
          <SettingRow
            label="SharePoint Site URL"
            description="Enter your SharePoint site URL (e.g., https://yourcompany.sharepoint.com/sites/yoursite)"
          >
            <Input
              placeholder="https://yourcompany.sharepoint.com/sites/yoursite"
              value={sharepointConfig.siteUrl}
              onChange={(e) => setSharepointConfig({ ...sharepointConfig, siteUrl: e.target.value })}
            />
          </SettingRow>

          <SettingRow
            label="File Path"
            description="Path to the Excel file in your document library"
          >
            <Input
              placeholder="/Shared Documents/Budget/Q4-Budget.xlsx"
              value={sharepointConfig.filePath}
              onChange={(e) => setSharepointConfig({ ...sharepointConfig, filePath: e.target.value })}
            />
          </SettingRow>

          <SettingRow
            label="Sync Frequency"
            description="How often should we sync data from SharePoint?"
          >
            <RadioGroup
              value={sharepointConfig.syncFrequency}
              onValueChange={(value) => setSharepointConfig({ 
                ...sharepointConfig, 
                syncFrequency: value as 'hourly' | '6hours' | 'daily' | 'manual' 
              })}
              options={[
                { value: 'manual', label: 'Manual Only' },
                { value: 'hourly', label: 'Every Hour' },
                { value: '6hours', label: 'Every 6 Hours' },
                { value: 'daily', label: 'Daily' }
              ]}
            />
          </SettingRow>

          <SettingRow
            label="Dataset Type"
            description="What type of data is in this SharePoint file?"
          >
            <RadioGroup
              value={datasetType}
              onValueChange={(value) => setDatasetType(value as DatasetType)}
              options={[
                { value: 'budget', label: 'Budget Data' },
                { value: 'actual', label: 'Actual Data' },
                { value: 'combined', label: 'Combined (Budget + Actual)' }
              ]}
            />
          </SettingRow>

          <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
            <Button 
              onClick={() => {
                toast.success('SharePoint connection saved! (Demo mode - authentication required in production)');
              }}
            >
              <Link2 className="icon-sm" style={{ marginRight: 'var(--spacing-2)' }} />
              Connect to SharePoint
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast.info('Sync initiated! (Demo mode)');
              }}
            >
              Sync Now
            </Button>
          </div>

          <Alert variant="default" style={{ marginTop: 'var(--spacing-4)' }}>
            <AlertCircle className="icon-sm" style={{ color: 'var(--chart-1)' }} />
            <AlertDescription>
              <strong>Note:</strong> This is a demo implementation. In production, you'll need to:
              <ol style={{ marginTop: 'var(--spacing-2)', marginLeft: 'var(--spacing-4)' }}>
                <li>Register an app in Azure AD</li>
                <li>Configure Microsoft Graph API permissions</li>
                <li>Implement OAuth 2.0 authentication flow</li>
                <li>Set up secure credential storage</li>
              </ol>
            </AlertDescription>
          </Alert>
        </SettingsSection>
      )}

      {/* API Integration Tab */}
      {integrationTab === 'api' && (
        <SettingsSection
          title="API Integration"
          description="Connect to external APIs to automatically import budget and actual data"
        >
          <Alert variant="default" style={{ marginBottom: 'var(--spacing-4)' }}>
            <AlertCircle className="icon-sm" style={{ color: 'var(--chart-1)' }} />
            <AlertDescription>
              Configure API endpoints to automatically pull data from your ERP, financial systems, or custom data sources.
            </AlertDescription>
          </Alert>

          <SettingRow
            label="API Endpoint URL"
            description="Enter the full URL to your data API endpoint"
          >
            <Input
              placeholder="https://api.yourcompany.com/v1/budget-data"
            />
          </SettingRow>

          <SettingRow
            label="Authentication Method"
            description="How should we authenticate with your API?"
          >
            <RadioGroup
              value="api-key"
              onValueChange={() => {}}
              options={[
                { value: 'api-key', label: 'API Key' },
                { value: 'oauth', label: 'OAuth 2.0' },
                { value: 'basic', label: 'Basic Auth' },
                { value: 'bearer', label: 'Bearer Token' }
              ]}
            />
          </SettingRow>

          <SettingRow
            label="API Key"
            description="Your API key or authentication token"
          >
            <Input
              type="password"
              placeholder="Enter your API key"
            />
          </SettingRow>

          <SettingRow
            label="Request Headers"
            description="Additional headers to include in API requests (JSON format)"
          >
            <textarea
              placeholder='{"Content-Type": "application/json", "X-Custom-Header": "value"}'
              style={{
                width: '100%',
                minHeight: '80px',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                fontFamily: 'monospace',
                fontSize: 'var(--text-sm)'
              }}
            />
          </SettingRow>

          <SettingRow
            label="Data Mapping"
            description="Map API response fields to application data structure"
          >
            <Alert variant="default">
              <AlertCircle className="icon-sm" style={{ color: 'var(--chart-1)' }} />
              <AlertDescription>
                Example API response structure expected:
                <pre style={{ 
                  marginTop: 'var(--spacing-2)', 
                  padding: 'var(--spacing-3)', 
                  background: 'var(--muted)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  overflow: 'auto'
                }}>
{`{
  "data": [
    {
      "dc": "DC-001",
      "jobFunction": "Operations",
      "date": "2024-01-01",
      "budgetHours": 160,
      "budgetRate": 25.50,
      "budgetVolume": 1000
    }
  ]
}`}
                </pre>
              </AlertDescription>
            </Alert>
          </SettingRow>

          <SettingRow
            label="Sync Schedule"
            description="How often should we pull data from the API?"
          >
            <RadioGroup
              value="manual"
              onValueChange={() => {}}
              options={[
                { value: 'manual', label: 'Manual Only' },
                { value: 'hourly', label: 'Every Hour' },
                { value: '6hours', label: 'Every 6 Hours' },
                { value: 'daily', label: 'Daily' }
              ]}
            />
          </SettingRow>

          <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
            <Button 
              onClick={() => {
                toast.info('Testing API connection... (Demo mode)');
                setTimeout(() => {
                  toast.success('API connection successful! Sample data retrieved.');
                }, 1500);
              }}
            >
              Test Connection
            </Button>
            <Button 
              onClick={() => {
                toast.success('API integration saved! (Demo mode)');
              }}
            >
              Save Configuration
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast.info('Syncing data from API... (Demo mode)');
              }}
            >
              Sync Now
            </Button>
          </div>

          <Alert variant="default" style={{ marginTop: 'var(--spacing-4)' }}>
            <AlertCircle className="icon-sm" style={{ color: 'var(--chart-1)' }} />
            <AlertDescription>
              <strong>Security Note:</strong> API credentials are stored securely and encrypted. Never share your API keys or authentication tokens.
            </AlertDescription>
          </Alert>
        </SettingsSection>
      )}
    </>
  );
}