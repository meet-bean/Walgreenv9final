/**
 * Unified Field Schema
 * 
 * Single source of truth for all fields in the system:
 * - Import fields (from Excel/CSV/API)
 * - Calculated fields (formulas)
 * - System fields (hardcoded in DailyMetrics)
 * 
 * All fields eventually map to or extend the DailyMetrics interface
 */

import { FormulaElement } from './formulaEngine';

export type FieldSourceType = 'import' | 'calculated' | 'system';
export type FieldDataType = 'string' | 'number' | 'date' | 'boolean';
export type FieldFormat = 'number' | 'percentage' | 'currency' | 'decimal' | 'text' | 'date';
export type FieldCategory = 
  | 'identifiers'      // siteId, jobFunctionId, taskId, date
  | 'budget'           // budgetedVolume, budgetedRate, budgetedHours
  | 'forecast'         // forecastedVolume, expectedHours
  | 'actual'           // actualVolume, actualHours (manual input or import)
  | 'performance'      // performance, budgetedOT, totalHours
  | 'custom';          // user-defined calculated fields

export interface FieldDefinition {
  // Core properties
  field: string;                    // Internal field name (maps to DailyMetrics property)
  displayName: string;              // UI display name
  description: string;              // Description for users
  sourceType: FieldSourceType;      // Where this field comes from
  category: FieldCategory;          // Logical grouping
  
  // Data type and validation
  type: FieldDataType;              // Data type
  required: boolean;                // Is this field required?
  
  // For import fields (sourceType: 'import')
  matchKeywords?: string[];         // Keywords for auto-detection during import
  columnHint?: string;              // Hint for expected column (e.g., "Column A")
  
  // For calculated fields (sourceType: 'calculated')
  formula?: FormulaElement[];       // Parsed formula structure
  formulaString?: string;           // Human-readable formula string
  
  // Display formatting
  format: FieldFormat;              // How to display the value
  decimals?: number;                // Number of decimal places
  
  // Metadata
  isCore: boolean;                  // Is this a core DailyMetrics field?
  isEditable: boolean;              // Can users edit this in forms?
  showInImport: boolean;            // Show in import mapping interface?
  showInForms: boolean;             // Show in manual data entry forms?
}

/**
 * Core Fields - Map directly to DailyMetrics interface
 * These fields are essential and cannot be removed
 */
export const CORE_FIELDS: FieldDefinition[] = [
  // === IDENTIFIERS ===
  {
    field: 'date',
    displayName: 'Date',
    description: 'The date for this data entry',
    sourceType: 'system',
    category: 'identifiers',
    type: 'date',
    required: true,
    format: 'date',
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  {
    field: 'siteId',
    displayName: 'Site ID',
    description: 'Distribution center identifier',
    sourceType: 'system',
    category: 'identifiers',
    type: 'string',
    required: true,
    format: 'text',
    matchKeywords: ['site', 'site id', 'dc', 'location', 'facility'],
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  {
    field: 'jobFunctionId',
    displayName: 'Job Function',
    description: 'Job function or department',
    sourceType: 'system',
    category: 'identifiers',
    type: 'string',
    required: true,
    format: 'text',
    matchKeywords: ['job function', 'department', 'function', 'area'],
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  {
    field: 'taskId',
    displayName: 'Task',
    description: 'Specific task or activity',
    sourceType: 'import',
    category: 'identifiers',
    type: 'string',
    required: true,
    format: 'text',
    matchKeywords: ['task', 'tasks', 'task name', 'activity', 'task id'],
    columnHint: 'Column A',
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: true,
  },
  
  // === BUDGET DATA ===
  {
    field: 'budgetedVolume',
    displayName: 'Budgeted Volume',
    description: 'Planned/budgeted volume of units',
    sourceType: 'import',
    category: 'budget',
    type: 'number',
    required: true,
    format: 'number',
    decimals: 0,
    matchKeywords: ['budget volume', 'budgeted volume', 'planned volume', 'target volume'],
    columnHint: 'Column B',
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  {
    field: 'budgetedRate',
    displayName: 'Budgeted Rate (UPH)',
    description: 'Budgeted units per hour rate',
    sourceType: 'import',
    category: 'budget',
    type: 'number',
    required: true,
    format: 'decimal',
    decimals: 2,
    matchKeywords: ['budget rate', 'budgeted rate', 'uph', 'rate', 'units per hour'],
    columnHint: 'Column C',
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  {
    field: 'budgetedHours',
    displayName: 'Budgeted Hours',
    description: 'Budgeted labor hours',
    sourceType: 'import',
    category: 'budget',
    type: 'number',
    required: true,
    format: 'decimal',
    decimals: 2,
    matchKeywords: ['budget hour', 'budgeted hour', 'planned hour', 'hours'],
    columnHint: 'Column D',
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  
  // === FORECAST DATA ===
  {
    field: 'forecastedVolume',
    displayName: 'Forecasted Volume',
    description: 'Updated daily volume forecast',
    sourceType: 'import',
    category: 'forecast',
    type: 'number',
    required: false,
    format: 'number',
    decimals: 0,
    matchKeywords: ['forecast volume', 'forecasted volume', 'forecast', 'expected volume'],
    columnHint: 'Column E',
    isCore: true,
    isEditable: false,
    showInImport: true,
    showInForms: false,
  },
  {
    field: 'expectedHours',
    displayName: 'Expected Hours',
    description: 'Expected labor hours based on forecast',
    sourceType: 'calculated',
    category: 'forecast',
    type: 'number',
    required: false,
    format: 'decimal',
    decimals: 2,
    formulaString: 'forecastedVolume / budgetedRate',
    isCore: true,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
  
  // === ACTUAL DATA (Manual Input or Import) ===
  {
    field: 'actualVolume',
    displayName: 'Actual Volume',
    description: 'Actual units processed (manual entry or import)',
    sourceType: 'import',
    category: 'actual',
    type: 'number',
    required: false,
    format: 'number',
    decimals: 0,
    matchKeywords: ['actual volume', 'volume', 'actual', 'completed volume'],
    isCore: true,
    isEditable: true,  // Can be manually entered
    showInImport: true,
    showInForms: true,
  },
  {
    field: 'actualHours',
    displayName: 'Actual Hours',
    description: 'Actual labor hours worked (manual entry or import)',
    sourceType: 'import',
    category: 'actual',
    type: 'number',
    required: false,
    format: 'decimal',
    decimals: 2,
    matchKeywords: ['actual hours', 'hours worked', 'actual', 'labor hours'],
    isCore: true,
    isEditable: true,  // Can be manually entered
    showInImport: true,
    showInForms: true,
  },
  
  // === PERFORMANCE METRICS (Calculated) ===
  {
    field: 'budgetedOT',
    displayName: 'Budgeted OT',
    description: 'Budgeted overtime hours',
    sourceType: 'system',
    category: 'performance',
    type: 'number',
    required: false,
    format: 'decimal',
    decimals: 2,
    isCore: true,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
  {
    field: 'totalHours',
    displayName: 'Total Hours',
    description: 'Total hours including overtime',
    sourceType: 'calculated',
    category: 'performance',
    type: 'number',
    required: false,
    format: 'decimal',
    decimals: 2,
    formulaString: 'expectedHours + budgetedOT',
    isCore: true,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
  {
    field: 'performance',
    displayName: 'Performance %',
    description: 'Performance percentage (expectedHours / actualHours * 100)',
    sourceType: 'calculated',
    category: 'performance',
    type: 'number',
    required: false,
    format: 'percentage',
    decimals: 1,
    formulaString: '(expectedHours / actualHours) * 100',
    isCore: true,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
];

/**
 * Example Custom Calculated Fields
 * These can be added by users through the DataFormatConfigurator
 */
export const EXAMPLE_CUSTOM_FIELDS: FieldDefinition[] = [
  {
    field: 'variance',
    displayName: 'Volume Variance',
    description: 'Difference between forecast and actual volume',
    sourceType: 'calculated',
    category: 'custom',
    type: 'number',
    required: false,
    format: 'number',
    decimals: 0,
    formulaString: 'actualVolume - forecastedVolume',
    isCore: false,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
  {
    field: 'efficiencyRate',
    displayName: 'Efficiency Rate',
    description: 'Actual UPH (actualVolume / actualHours)',
    sourceType: 'calculated',
    category: 'custom',
    type: 'number',
    required: false,
    format: 'decimal',
    decimals: 2,
    formulaString: 'actualVolume / actualHours',
    isCore: false,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
  {
    field: 'laborCost',
    displayName: 'Labor Cost',
    description: 'Total labor cost (actualHours * hourlyRate)',
    sourceType: 'calculated',
    category: 'custom',
    type: 'number',
    required: false,
    format: 'currency',
    decimals: 2,
    formulaString: 'actualHours * 25',  // Assuming $25/hour
    isCore: false,
    isEditable: false,
    showInImport: false,
    showInForms: false,
  },
];

/**
 * Helper Functions
 */

export function getAllFields(): FieldDefinition[] {
  return [...CORE_FIELDS];
}

export function getFieldsBySourceType(sourceType: FieldSourceType): FieldDefinition[] {
  return CORE_FIELDS.filter(f => f.sourceType === sourceType);
}

export function getFieldsByCategory(category: FieldCategory): FieldDefinition[] {
  return CORE_FIELDS.filter(f => f.category === category);
}

export function getImportableFields(): FieldDefinition[] {
  return CORE_FIELDS.filter(f => f.showInImport);
}

export function getEditableFields(): FieldDefinition[] {
  return CORE_FIELDS.filter(f => f.isEditable);
}

export function getCalculatedFields(): FieldDefinition[] {
  return CORE_FIELDS.filter(f => f.sourceType === 'calculated');
}

export function getFieldByName(fieldName: string): FieldDefinition | undefined {
  return CORE_FIELDS.find(f => f.field === fieldName);
}

/**
 * Get field definitions for column mapping during import
 * These are the fields users can map from their Excel/CSV files
 */
export function getColumnDefinitionsForImport() {
  return CORE_FIELDS.filter(f => f.showInImport).map(f => ({
    field: f.field,
    displayName: f.displayName,
    description: f.description,
    columnHint: f.columnHint,
    required: f.required,
    type: f.type,
    matchKeywords: f.matchKeywords || [],
  }));
}

/**
 * Storage key for custom fields
 */
export const CUSTOM_FIELDS_STORAGE_KEY = 'app-custom-fields';

/**
 * Get custom fields from localStorage
 */
export function getCustomFields(): FieldDefinition[] {
  try {
    const stored = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading custom fields:', e);
  }
  return [];
}

/**
 * Save custom fields to localStorage
 */
export function saveCustomFields(fields: FieldDefinition[]): void {
  try {
    localStorage.setItem(CUSTOM_FIELDS_STORAGE_KEY, JSON.stringify(fields));
  } catch (e) {
    console.error('Error saving custom fields:', e);
  }
}

/**
 * Get all fields including custom fields
 */
export function getAllFieldsWithCustom(): FieldDefinition[] {
  return [...CORE_FIELDS, ...getCustomFields()];
}