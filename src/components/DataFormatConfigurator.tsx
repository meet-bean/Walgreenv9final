import { useState, useEffect } from 'react';
import { Card, CardTitle } from './design-system/Card';
import { Button } from './design-system/Button';
import { Input } from './design-system/Input';
import { Label } from './design-system/Label';
import { Alert, AlertDescription } from './design-system/Alert';
import { SettingRow } from './SettingRow';
import { SettingsSection } from './SettingsSection';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  GripVertical,
  Edit2,
  Database,
  Calculator,
  Upload
} from 'lucide-react';
import { toast } from './design-system/Toast';
import { 
  FieldDefinition,
  getAllFields,
  getCustomFields,
  saveCustomFields,
  CORE_FIELDS,
  FieldSourceType,
  FieldCategory,
  FieldFormat
} from '../lib/unifiedFieldSchema';
import { VALIDATION_RULES } from '../lib/dataImportConfig';
import { FormulaBuilder } from './FormulaBuilder';
import { FormulaElement } from '../lib/formulaEngine';

interface StoredConfig {
  customFields: FieldDefinition[];
  validationRules: {
    allowNegativeNumbers: boolean;
    warnOnZeroValues: boolean;
    validateCalculatedHours: boolean;
    calculatedHoursTolerance: number;
    minimumRows: number;
    maximumRows: number;
  };
}

const STORAGE_KEY = 'dataImportConfig';

// Build default configuration
function getDefaultConfig(): StoredConfig {
  return {
    customFields: [],
    validationRules: VALIDATION_RULES,
  };
}

export function DataFormatConfigurator() {
  const [config, setConfig] = useState<StoredConfig>(getDefaultConfig());
  const [editingField, setEditingField] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | FieldCategory>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<'all' | FieldSourceType>('all');

  // All fields = core + custom
  const allFields = [...CORE_FIELDS, ...config.customFields];

  // Filter fields
  const filteredFields = allFields.filter(field => {
    if (selectedCategory !== 'all' && field.category !== selectedCategory) return false;
    if (selectedSourceType !== 'all' && field.sourceType !== selectedSourceType) return false;
    return true;
  });

  // Load config from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig(parsed);
      } catch (error) {
        console.error('Failed to load config:', error);
        setConfig(getDefaultConfig());
      }
    } else {
      setConfig(getDefaultConfig());
    }
  }, []);

  const addField = () => {
    const newField: FieldDefinition = {
      field: 'customField',
      displayName: 'Custom Field',
      description: 'Description of this field',
      sourceType: 'calculated',
      category: 'custom',
      type: 'number',
      required: false,
      format: 'number',
      isCore: false,
      isEditable: false,
      showInImport: false,
      showInForms: false,
      formulaString: '',
      formula: []
    };
    setConfig({
      ...config,
      customFields: [...config.customFields, newField],
    });
    // Edit the newly added field (index is CORE_FIELDS.length + current custom fields length)
    setEditingField(CORE_FIELDS.length + config.customFields.length);
  };

  const updateField = (index: number, updates: Partial<FieldDefinition>) => {
    // Check if this is a core field or custom field
    if (index < CORE_FIELDS.length) {
      // Can't edit core fields (except maybe some properties)
      toast.error('Core fields cannot be modified. Create a custom field instead.');
      return;
    }
    
    const customIndex = index - CORE_FIELDS.length;
    const newCustomFields = [...config.customFields];
    newCustomFields[customIndex] = { ...newCustomFields[customIndex], ...updates };
    setConfig({ ...config, customFields: newCustomFields });
  };

  const deleteField = (index: number) => {
    if (index < CORE_FIELDS.length) {
      toast.error('Core fields cannot be deleted.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this custom field?')) {
      const customIndex = index - CORE_FIELDS.length;
      const newCustomFields = config.customFields.filter((_, i) => i !== customIndex);
      setConfig({ ...config, customFields: newCustomFields });
      setEditingField(null);
    }
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    // Only allow moving custom fields
    if (index < CORE_FIELDS.length || index - CORE_FIELDS.length >= config.customFields.length) {
      return;
    }
    
    const customIndex = index - CORE_FIELDS.length;
    if (
      (direction === 'up' && customIndex === 0) ||
      (direction === 'down' && customIndex === config.customFields.length - 1)
    ) {
      return;
    }

    const newCustomFields = [...config.customFields];
    const targetIndex = direction === 'up' ? customIndex - 1 : customIndex + 1;
    [newCustomFields[customIndex], newCustomFields[targetIndex]] = [newCustomFields[targetIndex], newCustomFields[customIndex]];
    setConfig({ ...config, customFields: newCustomFields });
  };

  const getSourceTypeIcon = (sourceType: FieldSourceType) => {
    switch (sourceType) {
      case 'import': return <Upload style={{ height: '16px', width: '16px' }} />;
      case 'calculated': return <Calculator style={{ height: '16px', width: '16px' }} />;
      case 'system': return <Database style={{ height: '16px', width: '16px' }} />;
    }
  };

  const getSourceTypeBadge = (sourceType: FieldSourceType) => {
    const colors = {
      import: 'var(--chart-1)',
      calculated: 'var(--chart-2)',
      system: 'var(--chart-3)'
    };
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        padding: '2px 8px',
        borderRadius: 'var(--radius)',
        backgroundColor: colors[sourceType] + '20',
        color: colors[sourceType],
        fontFamily: 'var(--font-family-inter)',
        fontSize: 'var(--text-label)',
        fontWeight: 'var(--font-weight-medium)'
      }}>
        {getSourceTypeIcon(sourceType)}
        {sourceType}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <SettingsSection
        title="Field Definitions"
        description="Core fields from DailyMetrics and custom calculated fields"
      >
        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-3)', 
          marginTop: 'var(--spacing-4)',
          paddingBottom: 'var(--spacing-4)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ flex: 1 }}>
            <Label>Source Type</Label>
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value as any)}
              style={{
                width: '100%',
                padding: 'var(--spacing-2)',
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)'
              }}
            >
              <option value="all">All Sources</option>
              <option value="import">Import Fields</option>
              <option value="calculated">Calculated Fields</option>
              <option value="system">System Fields</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <Label>Category</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              style={{
                width: '100%',
                padding: 'var(--spacing-2)',
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--input-background)',
                color: 'var(--foreground)'
              }}
            >
              <option value="all">All Categories</option>
              <option value="identifiers">Identifiers</option>
              <option value="budget">Budget Data</option>
              <option value="forecast">Forecast Data</option>
              <option value="actual">Actual Data</option>
              <option value="performance">Performance Metrics</option>
              <option value="custom">Custom Fields</option>
            </select>
          </div>
        </div>

        <div className="card-content-flex-col-gap-large" style={{ marginTop: 'var(--spacing-4)' }}>
          {filteredFields.map((field, index) => {
            const globalIndex = allFields.indexOf(field);
            const isCore = globalIndex < CORE_FIELDS.length;
            
            return (
              <div
                key={globalIndex}
                className="setting-row"
                style={{
                  backgroundColor: editingField === globalIndex ? 'var(--secondary)' : 'var(--card)',
                  opacity: isCore && editingField !== globalIndex ? 0.8 : 1
                }}
              >
                {editingField === globalIndex && !isCore ? (
                  // Edit mode (only for custom fields)
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
                      <div>
                        <Label>Field Name (code)</Label>
                        <Input
                          value={field.field}
                          onChange={(e) => updateField(globalIndex, { field: e.target.value })}
                          placeholder="e.g., customMetric"
                        />
                      </div>
                      <div>
                        <Label>Display Name (UI)</Label>
                        <Input
                          value={field.displayName}
                          onChange={(e) => updateField(globalIndex, { displayName: e.target.value })}
                          placeholder="e.g., Custom Metric"
                        />
                      </div>
                      <div>
                        <Label>Source Type</Label>
                        <select
                          value={field.sourceType}
                          onChange={(e) => updateField(globalIndex, { sourceType: e.target.value as FieldSourceType })}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-family-inter)',
                            fontSize: 'var(--text-base)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: 'var(--input-background)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <option value="import">Import (from Excel/CSV)</option>
                          <option value="calculated">Calculated (formula)</option>
                          <option value="system">System (hardcoded)</option>
                        </select>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <select
                          value={field.category}
                          onChange={(e) => updateField(globalIndex, { category: e.target.value as FieldCategory })}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-family-inter)',
                            fontSize: 'var(--text-base)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: 'var(--input-background)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <option value="custom">Custom</option>
                          <option value="performance">Performance</option>
                          <option value="budget">Budget</option>
                          <option value="forecast">Forecast</option>
                          <option value="actual">Actual</option>
                        </select>
                      </div>
                      <div>
                        <Label>Data Format</Label>
                        <select
                          value={field.format}
                          onChange={(e) => updateField(globalIndex, { format: e.target.value as FieldFormat })}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-family-inter)',
                            fontSize: 'var(--text-base)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: 'var(--input-background)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <option value="number">Number</option>
                          <option value="percentage">Percentage</option>
                          <option value="currency">Currency</option>
                          <option value="decimal">Decimal</option>
                          <option value="text">Text</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                      <div>
                        <Label>Data Type</Label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(globalIndex, { type: e.target.value as any })}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            fontFamily: 'var(--font-family-inter)',
                            fontSize: 'var(--text-base)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: 'var(--input-background)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <option value="number">Number</option>
                          <option value="string">String</option>
                          <option value="date">Date</option>
                          <option value="boolean">Boolean</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        value={field.description}
                        onChange={(e) => updateField(globalIndex, { description: e.target.value })}
                        placeholder="Help text shown to users"
                      />
                    </div>

                    {field.sourceType === 'calculated' && (
                      <div>
                        <Label>Formula</Label>
                        <FormulaBuilder
                          availableMetrics={CORE_FIELDS
                            .filter(f => ['import', 'system', 'actual', 'budget', 'forecast'].includes(f.category as string))
                            .map(f => ({
                              id: f.field,
                              name: f.displayName,
                              dataType: f.type === 'number' ? 'number' : 'string'
                            }))}
                          initialFormula={field.formula || []}
                          onChange={(formula: FormulaElement[], formulaString: string) => {
                            updateField(globalIndex, { 
                              formula,
                              formulaString 
                            });
                          }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(null)}
                      >
                        Done
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteField(globalIndex)}
                      >
                        <Trash2 style={{ height: '16px', width: '16px' }} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flex: 1 }}>
                      {!isCore && (
                        <div style={{ cursor: 'grab', color: 'var(--muted-foreground)' }}>
                          <GripVertical style={{ height: '20px', width: '20px' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                          <p style={{
                            fontFamily: 'var(--font-family-inter)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--foreground)',
                            margin: 0
                          }}>
                            {field.displayName}
                          </p>
                          {getSourceTypeBadge(field.sourceType)}
                          {isCore && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 'var(--radius)',
                              backgroundColor: 'var(--muted)',
                              color: 'var(--muted-foreground)',
                              fontFamily: 'var(--font-family-inter)',
                              fontSize: 'var(--text-label)',
                              fontWeight: 'var(--font-weight-medium)'
                            }}>
                              Core
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontFamily: 'var(--font-family-inter)',
                          fontSize: 'var(--text-label)',
                          color: 'var(--muted-foreground)',
                          margin: 0
                        }}>
                          {field.description} • Format: {field.format} • Category: {field.category}
                          {field.formulaString && ` • Formula: ${field.formulaString}`}
                        </p>
                      </div>
                    </div>
                    {!isCore && (
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveField(globalIndex, 'up')}
                          disabled={globalIndex === CORE_FIELDS.length}
                          title="Move up"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveField(globalIndex, 'down')}
                          disabled={globalIndex === allFields.length - 1}
                          title="Move down"
                        >
                          ↓
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingField(globalIndex)}
                        >
                          <Edit2 style={{ height: '16px', width: '16px' }} />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFields.length === 0 && (
            <div style={{
              padding: 'var(--spacing-8)',
              textAlign: 'center',
              color: 'var(--muted-foreground)'
            }}>
              <p style={{ fontFamily: 'var(--font-family-inter)' }}>
                No fields match the selected filters.
              </p>
            </div>
          )}

          {/* Add Field Button at Bottom */}
          <div 
            className="setting-row"
            style={{ 
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'stretch'
            }}
          >
            <Button onClick={addField} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus style={{ marginRight: 'var(--spacing-2)', height: '16px', width: '16px' }} />
              Add Custom Field
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <Alert variant="default" style={{ marginTop: 'var(--spacing-4)' }}>
          <CheckCircle2 style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
          <AlertDescription>
            <strong>Field Types:</strong><br/>
            • <strong>Import:</strong> Data from Excel/CSV files or integrations<br/>
            • <strong>Calculated:</strong> Computed using formulas from other fields<br/>
            • <strong>System:</strong> Core DailyMetrics fields with hardcoded logic<br/>
            <br/>
            Core fields cannot be edited or deleted. Create custom fields for additional metrics.
          </AlertDescription>
        </Alert>
      </SettingsSection>

      {/* Help Text */}
      <Alert variant="default">
        <CheckCircle2 style={{ color: 'var(--chart-1)', height: '16px', width: '16px' }} />
        <AlertDescription>
          <strong>Note:</strong> After saving changes, you may need to reload the page for the new configuration to take effect in the Data Integration Hub.
        </AlertDescription>
      </Alert>
    </div>
  );
}