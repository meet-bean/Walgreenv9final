import { useState, useEffect } from 'react';
import { Button } from './design-system/Button';
import { Badge } from './design-system/Badge';
import { Alert, AlertDescription } from './design-system/Alert';
import { SettingsSection } from './SettingsSection';
import { 
  Database, 
  Trash2, 
  Download, 
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getAllDatasets, deleteDataset, type ImportedDataset, type ImportedDataRow } from '../lib/dataImportService';
import { toast } from './design-system/Toast';

export function ImportedDataViewer() {
  const [datasets, setDatasets] = useState<ImportedDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [expandedDatasetId, setExpandedDatasetId] = useState<string | null>(null);

  // Load datasets
  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = () => {
    const allDatasets = getAllDatasets();
    // Sort by upload date, newest first
    allDatasets.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    setDatasets(allDatasets);
  };

  const handleDeleteDataset = (id: string) => {
    if (confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      deleteDataset(id);
      toast.success('Dataset deleted successfully');
      loadDatasets();
      if (selectedDatasetId === id) {
        setSelectedDatasetId(null);
      }
      if (expandedDatasetId === id) {
        setExpandedDatasetId(null);
      }
    }
  };

  const handleExportDataset = (dataset: ImportedDataset) => {
    // Export as CSV
    const headers = Object.keys(dataset.data[0] || {});
    const csvContent = [
      headers.join(','),
      ...dataset.data.map(row => 
        headers.map(header => {
          const value = (row as any)[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dataset.fileName.replace('.xlsx', '').replace('.csv', '')}_exported.csv`;
    link.click();
    
    toast.success('Dataset exported successfully');
  };

  const toggleExpand = (id: string) => {
    setExpandedDatasetId(expandedDatasetId === id ? null : id);
  };

  const selectedDataset = selectedDatasetId 
    ? datasets.find(ds => ds.id === selectedDatasetId) 
    : null;

  return (
    <SettingsSection
      title={datasets.length > 0 ? `Imported Datasets (${datasets.length})` : "View Imported Data"}
      description={datasets.length > 0 ? "Click on a dataset to view its contents" : "Review and verify your uploaded spreadsheet data"}
    >
      {datasets.length === 0 ? (
        <Alert variant="default">
          <Database style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
          <AlertDescription>
            No datasets imported yet. Upload a file in the "Data Upload" tab to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--spacing-4)'
              }}
            >
              {/* Dataset Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <FileSpreadsheet style={{ color: 'var(--primary)', height: '16px', width: '16px' }} />
                    <p style={{
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-base)',
                      color: 'var(--foreground)',
                      margin: 0
                    }}>
                      {dataset.fileName}
                    </p>
                    {dataset.datasetType && (
                      <Badge variant="outline" style={{
                        backgroundColor: dataset.datasetType === 'budget' ? 'rgba(59, 130, 246, 0.1)' :
                                         dataset.datasetType === 'actual' ? 'rgba(16, 185, 129, 0.1)' :
                                         'rgba(168, 85, 247, 0.1)',
                        borderColor: dataset.datasetType === 'budget' ? 'var(--chart-1)' :
                                   dataset.datasetType === 'actual' ? 'var(--chart-2)' :
                                   'var(--chart-3)'
                      }}>
                        {dataset.datasetType === 'budget' ? '📊 Budget' :
                         dataset.datasetType === 'actual' ? '✅ Actual' :
                         '📈 Combined'}
                      </Badge>
                    )}
                    <Badge variant={dataset.validationStatus === 'valid' ? 'default' : dataset.validationStatus === 'warnings' ? 'secondary' : 'destructive'}>
                      {dataset.validationStatus === 'valid' && <CheckCircle2 style={{ marginRight: 'var(--spacing-1)', height: '12px', width: '12px' }} />}
                      {dataset.validationStatus === 'warnings' && <AlertTriangle style={{ marginRight: 'var(--spacing-1)', height: '12px', width: '12px' }} />}
                      {dataset.validationStatus}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <p style={{
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-label)',
                      color: 'var(--muted-foreground)',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-1)'
                    }}>
                      <Calendar style={{ height: '12px', width: '12px' }} />
                      {new Date(dataset.uploadedAt).toLocaleString()}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-label)',
                      color: 'var(--muted-foreground)',
                      margin: 0
                    }}>
                      {dataset.rowCount} rows • {dataset.columnCount} columns
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(dataset.id)}
                  >
                    {expandedDatasetId === dataset.id ? (
                      <>
                        <ChevronUp style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-1)' }} />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-1)' }} />
                        View Data
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportDataset(dataset)}
                  >
                    <Download style={{ height: '16px', width: '16px' }} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDataset(dataset.id)}
                  >
                    <Trash2 style={{ height: '16px', width: '16px' }} />
                  </Button>
                </div>
              </div>

              {/* Metadata (if available) */}
              {dataset.metadata && Object.keys(dataset.metadata).length > 0 && (
                <div style={{
                  backgroundColor: 'var(--secondary)',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--spacing-3)',
                  marginBottom: expandedDatasetId === dataset.id ? 'var(--spacing-3)' : 0
                }}>
                  <p style={{
                    fontFamily: 'var(--font-family-inter)',
                    fontSize: 'var(--text-label)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--foreground)',
                    marginBottom: 'var(--spacing-2)'
                  }}>
                    Metadata:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
                    {Object.entries(dataset.metadata).map(([key, value]) => (
                      <div key={key}>
                        <span style={{
                          fontFamily: 'var(--font-family-inter)',
                          fontSize: 'var(--text-label)',
                          color: 'var(--muted-foreground)'
                        }}>
                          {key}:
                        </span>{' '}
                        <span style={{
                          fontFamily: 'var(--font-family-inter)',
                          fontSize: 'var(--text-label)',
                          color: 'var(--foreground)'
                        }}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Data View */}
              {expandedDatasetId === dataset.id && (
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    overflowX: 'auto',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-label)'
                    }}>
                      <thead style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'var(--secondary)',
                        zIndex: 1
                      }}>
                        <tr>
                          <th style={{
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            textAlign: 'left',
                            color: 'var(--muted-foreground)',
                            borderBottom: '1px solid var(--border)',
                            backgroundColor: 'var(--secondary)'
                          }}>
                            #
                          </th>
                          {dataset.data.length > 0 && Object.keys(dataset.data[0]).map((header) => (
                            <th key={header} style={{
                              padding: 'var(--spacing-2) var(--spacing-3)',
                              textAlign: 'left',
                              color: 'var(--foreground)',
                              borderBottom: '1px solid var(--border)',
                              backgroundColor: 'var(--secondary)',
                              whiteSpace: 'nowrap'
                            }}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.data.map((row, rowIndex) => (
                          <tr key={rowIndex} style={{
                            backgroundColor: rowIndex % 2 === 0 ? 'var(--card)' : 'var(--secondary)'
                          }}>
                            <td style={{
                              padding: 'var(--spacing-2) var(--spacing-3)',
                              color: 'var(--muted-foreground)',
                              borderBottom: '1px solid var(--border)'
                            }}>
                              {rowIndex + 1}
                            </td>
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex} style={{
                                padding: 'var(--spacing-2) var(--spacing-3)',
                                color: 'var(--foreground)',
                                borderBottom: '1px solid var(--border)',
                                whiteSpace: 'nowrap'
                              }}>
                                {value !== null && value !== undefined ? String(value) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Row count footer */}
                  <div style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    backgroundColor: 'var(--secondary)',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-label)',
                      color: 'var(--muted-foreground)',
                      margin: 0
                    }}>
                      Showing all {dataset.data.length} rows
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SettingsSection>
  );
}