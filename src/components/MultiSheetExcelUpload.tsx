import { useState } from 'react';
import { Card, CardTitle } from './design-system/Card';
import { Button } from './design-system/Button';
import { Alert, AlertDescription } from './design-system/Alert';
import { Badge } from './design-system/Badge';
import { Checkbox } from './design-system/Checkbox';
import { Label } from './design-system/Label';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Download
} from 'lucide-react';
import { toast } from './design-system/Toast';
import {
  getExcelSheets,
  parseExcelSheet,
  saveImportedDataset,
  validateImportedData,
  type SheetMetadata,
  type DatasetType,
  type ValidationResult,
} from '../lib/dataImportService';

interface MultiSheetExcelUploadProps {
  datasetType: DatasetType;
  onImportComplete?: () => void;
}

export function MultiSheetExcelUpload({ datasetType, onImportComplete }: MultiSheetExcelUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [availableSheets, setAvailableSheets] = useState<SheetMetadata[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [importResults, setImportResults] = useState<Array<{
    sheetName: string;
    success: boolean;
    rowCount?: number;
    error?: string;
  }>>([]);

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setAvailableSheets([]);
    setSelectedSheets(new Set());
    setImportResults([]);
    setIsAnalyzing(true);

    try {
      const sheets = await getExcelSheets(file);
      setAvailableSheets(sheets);
      
      // Auto-select first sheet
      if (sheets.length > 0) {
        setSelectedSheets(new Set([sheets[0].name]));
      }
      
      toast.success(`Found ${sheets.length} sheet${sheets.length !== 1 ? 's' : ''} in file`);
    } catch (error: any) {
      console.error('Failed to analyze file:', error);
      toast.error(error.message || 'Failed to analyze file');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls'].includes(extension || '')) {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls'].includes(extension || '')) {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      handleFileSelect(file);
    }
  };

  const toggleSheetSelection = (sheetName: string) => {
    const newSelection = new Set(selectedSheets);
    if (newSelection.has(sheetName)) {
      newSelection.delete(sheetName);
    } else {
      newSelection.add(sheetName);
    }
    setSelectedSheets(newSelection);
  };

  const selectAllSheets = () => {
    setSelectedSheets(new Set(availableSheets.map(s => s.name)));
  };

  const deselectAllSheets = () => {
    setSelectedSheets(new Set());
  };

  const handleImportSelected = async () => {
    if (!uploadedFile || selectedSheets.size === 0) {
      toast.error('Please select at least one sheet to import');
      return;
    }

    setIsProcessing(true);
    const results: Array<{
      sheetName: string;
      success: boolean;
      rowCount?: number;
      error?: string;
    }> = [];

    try {
      for (const sheetName of Array.from(selectedSheets)) {
        try {
          // Parse sheet
          const parsedData = await parseExcelSheet(uploadedFile, sheetName);
          
          // Validate data
          const validation = validateImportedData(parsedData);
          
          if (!validation.isValid) {
            results.push({
              sheetName,
              success: false,
              error: `Validation failed: ${validation.errors.length} errors`,
            });
            continue;
          }
          
          // Save dataset
          const datasetName = selectedSheets.size === 1 
            ? uploadedFile.name.replace(/\.[^/.]+$/, '')
            : `${uploadedFile.name.replace(/\.[^/.]+$/, '')} - ${sheetName}`;
          
          saveImportedDataset(
            datasetName,
            parsedData,
            'file',
            datasetType,
            `${sheetName}.xlsx`
          );
          
          results.push({
            sheetName,
            success: true,
            rowCount: parsedData.length,
          });
        } catch (error: any) {
          results.push({
            sheetName,
            success: false,
            error: error.message || 'Import failed',
          });
        }
      }

      setImportResults(results);
      
      const successCount = results.filter(r => r.success).length;
      const totalRows = results.filter(r => r.success).reduce((sum, r) => sum + (r.rowCount || 0), 0);
      
      if (successCount === results.length) {
        toast.success(`Successfully imported ${successCount} sheet${successCount !== 1 ? 's' : ''} with ${totalRows} total rows!`);
        if (onImportComplete) onImportComplete();
      } else if (successCount > 0) {
        toast.warning(`Imported ${successCount} of ${results.length} sheets. Check results below.`);
      } else {
        toast.error('Failed to import all sheets. Check results below.');
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error('Failed to import sheets');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* File Upload Area */}
      {!uploadedFile && (
        <div
          className="upload-dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('multi-sheet-upload')?.click()}
        >
          <input
            id="multi-sheet-upload"
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <div className="upload-dropzone-content">
            <div className="upload-icon-circle">
              <Upload style={{ width: '32px', height: '32px', color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="upload-title">
                Click to upload or drag and drop
              </p>
              <p className="upload-subtitle">
                Excel files (.xlsx, .xls) up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing File */}
      {isAnalyzing && (
        <Alert variant="default">
          <Layers style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
          <AlertDescription>
            Analyzing file and detecting sheets...
          </AlertDescription>
        </Alert>
      )}

      {/* Sheet Selection */}
      {uploadedFile && availableSheets.length > 0 && !isProcessing && importResults.length === 0 && (
        <>
          <Alert variant="default">
            <FileSpreadsheet style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
            <AlertDescription>
              <div className="file-info-container">
                <div className="file-info-text">
                  <p className="file-info-name">
                    <strong>{uploadedFile.name}</strong> contains {availableSheets.length} sheet{availableSheets.length !== 1 ? 's' : ''}
                  </p>
                  <p className="file-info-hint">
                    Select which sheets to import below
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedFile(null);
                    setAvailableSheets([]);
                    setSelectedSheets(new Set());
                  }}
                >
                  Choose Different File
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <div className="sheet-selection-wrapper">
            <div className="data-source-card-header-row">
              <div>
                <h3 style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: 600, 
                  color: 'var(--foreground)',
                  margin: 0,
                  marginBottom: 'var(--spacing-1)'
                }}>Select Sheets to Import</h3>
                <p className="card-description">
                  Choose one or more sheets from the Excel file
                </p>
              </div>
              <div className="settings-section-actions">
                <Button variant="outline" size="sm" onClick={selectAllSheets}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllSheets}>
                  Deselect All
                </Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {availableSheets.map((sheet) => (
                <div
                  key={sheet.name}
                  className={`sheet-selection-card ${selectedSheets.has(sheet.name) ? 'selected' : ''}`}
                  onClick={() => toggleSheetSelection(sheet.name)}
                >
                  <div className="sheet-selection-content">
                    <Checkbox
                      checked={selectedSheets.has(sheet.name)}
                      onCheckedChange={() => toggleSheetSelection(sheet.name)}
                    />
                    <div className="sheet-selection-info">
                      <div className="sheet-selection-title">
                        <Layers style={{ color: 'var(--primary)', height: '16px', width: '16px' }} />
                        <p className="sheet-name">
                          {sheet.name}
                        </p>
                      </div>
                      <p className="sheet-meta">
                        {sheet.rowCount} rows × {sheet.columnCount} columns
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <Button
              variant="outline"
              onClick={() => {
                setUploadedFile(null);
                setAvailableSheets([]);
                setSelectedSheets(new Set());
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportSelected}
              disabled={selectedSheets.size === 0}
            >
              <Download style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
              Import {selectedSheets.size} Sheet{selectedSheets.size !== 1 ? 's' : ''}
            </Button>
          </div>
        </>
      )}

      {/* Processing */}
      {isProcessing && (
        <Alert variant="default">
          <AlertCircle style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
          <AlertDescription>
            Importing {selectedSheets.size} sheet{selectedSheets.size !== 1 ? 's' : ''}... Please wait.
          </AlertDescription>
        </Alert>
      )}

      {/* Import Results */}
      {importResults.length > 0 && (
        <div className="import-results-wrapper">
          <div className="data-source-card-header-row">
            <div>
              <h3 style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 600, 
                color: 'var(--foreground)',
                margin: 0,
                marginBottom: 'var(--spacing-1)'
              }}>Import Results</h3>
              <p className="card-description">
                {importResults.filter(r => r.success).length} of {importResults.length} sheet{importResults.length !== 1 ? 's' : ''} imported successfully
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {importResults.map((result) => (
              <div
                key={result.sheetName}
                className={`import-result-card ${result.success ? 'success' : 'error'}`}
              >
                <div className="import-result-content">
                  {result.success ? (
                    <CheckCircle2 style={{ color: 'var(--chart-2)', height: '16px', width: '16px' }} />
                  ) : (
                    <AlertCircle style={{ color: 'var(--destructive)', height: '16px', width: '16px' }} />
                  )}
                  <div className="import-result-info">
                    <p className="import-result-name">
                      {result.sheetName}
                    </p>
                    {result.success ? (
                      <p className="import-result-detail">
                        Successfully imported {result.rowCount} rows
                      </p>
                    ) : (
                      <p className="import-result-error">
                        {result.error}
                      </p>
                    )}
                  </div>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="import-results-footer">
            <Button
              onClick={() => {
                setUploadedFile(null);
                setAvailableSheets([]);
                setSelectedSheets(new Set());
                setImportResults([]);
              }}
              style={{ width: '100%' }}
            >
              Import Another File
            </Button>
          </div>
        </div>
      )}
    </>
  );
}