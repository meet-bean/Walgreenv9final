import React, { useState } from 'react';
import { SlideOut } from './design-system/SlideOut';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { Alert, AlertDescription } from './design-system/Alert';
import { Badge } from './design-system/Badge';
import { Textarea } from './design-system/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './design-system/Tabs';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Download,
  AlertCircle,
  CheckCircle2,
  Info,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from './design-system/Toast';

export type DataType = 'number' | 'percentage' | 'currency' | 'text';

export interface CustomDataRow {
  id: string;
  label: string;
  value: string | number;
}

export interface CustomDataConfig {
  type: 'manual' | 'file';
  dataType: DataType;
  fieldName: string;
  unit?: string;
  data: CustomDataRow[];
  fileName?: string;
}

interface CustomDataEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: CustomDataConfig) => void;
  initialData?: CustomDataConfig;
  tileName?: string;
}

export function CustomDataEntryDialog({ 
  open, 
  onClose, 
  onSave, 
  initialData,
  tileName 
}: CustomDataEntryDialogProps) {
  const [entryMethod, setEntryMethod] = useState<'manual' | 'csv'>('manual');
  const [dataType, setDataType] = useState<DataType>(initialData?.dataType || 'number');
  const [fieldName, setFieldName] = useState(initialData?.fieldName || 'Value');
  const [unit, setUnit] = useState(initialData?.unit || '');
  const [rows, setRows] = useState<CustomDataRow[]>(
    initialData?.data || [
      { id: '1', label: 'Item 1', value: '' },
      { id: '2', label: 'Item 2', value: '' },
      { id: '3', label: 'Item 3', value: '' },
    ]
  );
  const [csvText, setCsvText] = useState('');

  const addRow = () => {
    const newId = (Math.max(...rows.map(r => parseInt(r.id)), 0) + 1).toString();
    setRows([...rows, { id: newId, label: `Item ${newId}`, value: '' }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    } else {
      toast.error('Cannot remove last row', {
        description: 'At least one data row is required'
      });
    }
  };

  const updateRow = (id: string, field: 'label' | 'value', newValue: string | number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: newValue } : r));
  };

  const parseCSV = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length === 0) {
        toast.error('Empty CSV', {
          description: 'Please enter some data'
        });
        return;
      }

      const newRows: CustomDataRow[] = [];
      let startIndex = 0;

      // Check if first line is a header
      const firstLine = lines[0].split(',');
      if (firstLine.length === 2 && isNaN(Number(firstLine[1].trim()))) {
        startIndex = 1;
        // Use headers if provided
        if (firstLine[0].trim()) {
          // Could use first column as field name, but keeping it simple for now
        }
      }

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 2) {
          const label = parts[0].trim();
          const value = parts[1].trim();
          
          if (label && value) {
            newRows.push({
              id: (i + 1).toString(),
              label,
              value: dataType === 'text' ? value : (parseFloat(value) || 0)
            });
          }
        }
      }

      if (newRows.length === 0) {
        toast.error('No valid data found', {
          description: 'CSV format should be: Label, Value'
        });
        return;
      }

      setRows(newRows);
      toast.success(`Imported ${newRows.length} rows`, {
        description: 'Switch to Manual Entry tab to review'
      });
    } catch (error) {
      toast.error('Failed to parse CSV', {
        description: 'Please check your CSV format'
      });
    }
  };

  const exportToCSV = () => {
    const header = 'Label,Value\n';
    const data = rows.map(r => `${r.label},${r.value}`).join('\n');
    const csv = header + data;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tileName || 'data'}_export.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV exported', {
      description: 'File downloaded to your device'
    });
  };

  const handleSave = () => {
    // Validate
    if (!fieldName.trim()) {
      toast.error('Field name required', {
        description: 'Please enter a name for this data field'
      });
      return;
    }

    const validRows = rows.filter(r => r.label.trim() && r.value !== '');
    
    if (validRows.length === 0) {
      toast.error('No data entered', {
        description: 'Please enter at least one row of data'
      });
      return;
    }

    // Convert values to appropriate type
    const processedRows = validRows.map(r => ({
      ...r,
      value: dataType === 'text' ? r.value : Number(r.value)
    }));

    const config: CustomDataConfig = {
      type: 'manual',
      dataType,
      fieldName: fieldName.trim(),
      unit: unit.trim() || undefined,
      data: processedRows,
    };

    onSave(config);
    toast.success('Custom data saved', {
      description: `${processedRows.length} rows configured`
    });
  };

  const formatValue = (value: string | number) => {
    if (value === '' || value === null) return '';
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    
    switch (dataType) {
      case 'percentage':
        return `${numValue.toFixed(1)}%`;
      case 'currency':
        return `$${numValue.toLocaleString()}`;
      case 'number':
        return numValue.toLocaleString();
      case 'text':
        return value.toString();
      default:
        return value;
    }
  };

  return (
    <SlideOut
      open={open}
      onClose={onClose}
      title="Custom Data Entry"
      description={tileName ? `Configure data for: ${tileName}` : 'Enter custom data for your tile'}
      icon={<Database size={18} />}
      resizable
      defaultWidth={600}
      minWidth={500}
      maxWidth={900}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle2 style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
            Save Custom Data
          </Button>
        </>
      }
    >
          {/* Data Configuration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Field Name *</Label>
              <Input
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g., Sales, Performance, Score"
              />
              <p style={{ 
                fontSize: 'var(--text-label)', 
                color: 'var(--muted-foreground)',
                margin: 0
              }}>
                What does this data represent?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Data Type *</Label>
              <Select value={dataType} onValueChange={(v: DataType) => setDataType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number (1,234)</SelectItem>
                  <SelectItem value="percentage">Percentage (95.5%)</SelectItem>
                  <SelectItem value="currency">Currency ($1,234)</SelectItem>
                  <SelectItem value="text">Text (Any text)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {dataType !== 'text' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label>Unit (Optional)</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., units, hours, cases"
              />
              <p style={{ 
                fontSize: 'var(--text-label)', 
                color: 'var(--muted-foreground)',
                margin: 0
              }}>
                Additional unit to display with the value
              </p>
            </div>
          )}

          {/* Entry Method Tabs */}
          <Tabs value={entryMethod} onValueChange={(v: any) => setEntryMethod(v)}>
            <TabsList className="ds-tabs-list-grid-2">
              <TabsTrigger value="manual" className="ds-tabs-trigger-with-icon">
                <Database style={{ height: '16px', width: '16px' }} />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="csv" className="ds-tabs-trigger-with-icon">
                <FileSpreadsheet style={{ height: '16px', width: '16px' }} />
                CSV Import
              </TabsTrigger>
            </TabsList>

            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="ds-tabs-flex-col">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ 
                    fontSize: 'var(--text-base)',
                    margin: 0,
                    marginBottom: 'var(--spacing-1)'
                  }}>Data Rows</h4>
                  <p style={{ 
                    fontSize: 'var(--text-label)', 
                    color: 'var(--muted-foreground)',
                    margin: 0
                  }}>
                    Enter labels and values for your data
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                  >
                    <Download style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                  >
                    <Plus style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
                    Add Row
                  </Button>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="table-head-narrow">#</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="table-head-medium">Preview</TableHead>
                      <TableHead className="table-head-narrow"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell className="table-cell-muted">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={row.label}
                            onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                            placeholder="Label"
                            style={{ height: '32px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type={dataType === 'text' ? 'text' : 'number'}
                            step={dataType === 'percentage' ? '0.1' : dataType === 'currency' ? '0.01' : '1'}
                            value={row.value}
                            onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                            placeholder={dataType === 'text' ? 'Text' : '0'}
                            className="input-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="badge-small">
                            {formatValue(row.value)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(row.id)}
                          >
                            <Trash2 style={{ height: '16px', width: '16px', color: 'rgb(220, 38, 38)' }} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {rows.filter(r => r.label && r.value !== '').length > 0 && (
                <Alert>
                  <CheckCircle2 style={{ height: '16px', width: '16px' }} />
                  <AlertDescription>
                    <strong>{rows.filter(r => r.label && r.value !== '').length} valid rows</strong> ready to save
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* CSV Import Tab */}
            <TabsContent value="csv" className="ds-tabs-flex-col">
              <Alert>
                <Info style={{ height: '16px', width: '16px' }} />
                <AlertDescription>
                  <p style={{ 
                    fontSize: 'var(--text-base)',
                    marginBottom: 'var(--spacing-2)'
                  }}><strong>CSV Format:</strong></p>
                  <code style={{ 
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 'var(--text-label)', 
                    backgroundColor: 'var(--secondary)', 
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius)',
                    display: 'block'
                  }}>
                    Label,Value<br />
                    Store A,95.5<br />
                    Store B,87.2<br />
                    Store C,92.8
                  </code>
                </AlertDescription>
              </Alert>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Label>Paste CSV Data</Label>
                <Textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Label,Value&#10;Store A,95.5&#10;Store B,87.2&#10;Store C,92.8"
                  rows={10}
                  className="textarea-mono"
                />
              </div>

              <Button
                onClick={parseCSV}
                className="full-width"
              >
                <Upload style={{ height: '16px', width: '16px', marginRight: 'var(--spacing-2)' }} />
                Import CSV Data
              </Button>

              {rows.length > 0 && (
                <Alert>
                  <CheckCircle2 style={{ height: '16px', width: '16px' }} />
                  <AlertDescription>
                    Current data has <strong>{rows.length} rows</strong>. Import will replace them.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
    </SlideOut>
  );
}