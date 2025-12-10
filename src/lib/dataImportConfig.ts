/**
 * Data Import Configuration
 * 
 * This file now exports helpers that use the unified field schema.
 * For field definitions, see /lib/unifiedFieldSchema.ts
 */

import { getColumnDefinitionsForImport, getFieldByName } from './unifiedFieldSchema';

/**
 * DEPRECATED: Use getColumnDefinitionsForImport() from unifiedFieldSchema instead
 * Kept for backwards compatibility
 */
export interface ColumnDefinition {
  /** Internal field name in the data structure */
  field: string;
  /** Display name shown in UI */
  displayName: string;
  /** Description shown to users */
  description: string;
  /** Column letter/position hint (e.g., "Column A") */
  columnHint?: string;
  /** Is this field required? */
  required: boolean;
  /** Data type */
  type: 'string' | 'number' | 'date';
  /** Keywords to match when auto-detecting columns (lowercase) */
  matchKeywords: string[];
}

/**
 * Column definitions for import - uses unified schema
 */
export const COLUMN_DEFINITIONS: ColumnDefinition[] = getColumnDefinitionsForImport();

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  /** Allow negative numbers in volume/rate/hours? */
  allowNegativeNumbers: false,
  
  /** Show warning when volume or rate is zero? */
  warnOnZeroValues: true,
  
  /** Validate calculated hours (volume / rate ≈ hours)? */
  validateCalculatedHours: true,
  
  /** Maximum difference allowed between calculated and budgeted hours */
  calculatedHoursTolerance: 0.1,
  
  /** Minimum number of rows required in upload */
  minimumRows: 1,
  
  /** Maximum number of rows allowed (0 = unlimited) */
  maximumRows: 0,
};

/**
 * Template sample data - Budget/Forecast data
 */
export const TEMPLATE_SAMPLE_DATA = [
  {
    taskId: 'receive-unload',
    budgetedVolume: 5000,
    budgetedRate: 250,
    budgetedHours: 20,
    forecastedVolume: 5200,
    siteId: 'DC-001',
    jobFunctionId: 'receiving',
    date: '2024-11-19',
  },
  {
    taskId: 'putaway-bulk',
    budgetedVolume: 4500,
    budgetedRate: 200,
    budgetedHours: 22.5,
    forecastedVolume: 4600,
    siteId: 'DC-001',
    jobFunctionId: 'putaway',
    date: '2024-11-19',
  },
  {
    taskId: 'pick-cases',
    budgetedVolume: 8000,
    budgetedRate: 300,
    budgetedHours: 26.67,
    forecastedVolume: 8200,
    siteId: 'DC-001',
    jobFunctionId: 'picking',
    date: '2024-11-19',
  },
  {
    taskId: 'stage-orders',
    budgetedVolume: 7500,
    budgetedRate: 275,
    budgetedHours: 27.27,
    forecastedVolume: 7600,
    siteId: 'DC-001',
    jobFunctionId: 'staging',
    date: '2024-11-19',
  },
  {
    taskId: 'load-trucks',
    budgetedVolume: 6000,
    budgetedRate: 350,
    budgetedHours: 17.14,
    forecastedVolume: 6100,
    siteId: 'DC-001',
    jobFunctionId: 'loading',
    date: '2024-11-19',
  },
];

/**
 * Template sample data - Actual/Historical data
 */
export const TEMPLATE_SAMPLE_DATA_ACTUAL = [
  {
    taskId: 'receive-unload',
    budgetedVolume: 5000,
    budgetedRate: 250,
    budgetedHours: 20,
    actualVolume: 4950,
    actualHours: 20.6,
    siteId: 'DC-001',
    jobFunctionId: 'receiving',
    date: '2024-11-18',
  },
  {
    taskId: 'putaway-bulk',
    budgetedVolume: 4500,
    budgetedRate: 200,
    budgetedHours: 22.5,
    actualVolume: 4600,
    actualHours: 21.9,
    siteId: 'DC-001',
    jobFunctionId: 'putaway',
    date: '2024-11-18',
  },
  {
    taskId: 'pick-cases',
    budgetedVolume: 8000,
    budgetedRate: 300,
    budgetedHours: 26.67,
    actualVolume: 8200,
    actualHours: 26.0,
    siteId: 'DC-001',
    jobFunctionId: 'picking',
    date: '2024-11-18',
  },
  {
    taskId: 'stage-orders',
    budgetedVolume: 7500,
    budgetedRate: 275,
    budgetedHours: 27.27,
    actualVolume: 7400,
    actualHours: 27.4,
    siteId: 'DC-001',
    jobFunctionId: 'staging',
    date: '2024-11-18',
  },
  {
    taskId: 'load-trucks',
    budgetedVolume: 6000,
    budgetedRate: 350,
    budgetedHours: 17.14,
    actualVolume: 6100,
    actualHours: 16.9,
    siteId: 'DC-001',
    jobFunctionId: 'loading',
    date: '2024-11-18',
  },
];

/**
 * UI Text
 */
export const UI_TEXT = {
  pageTitle: 'Data Integration Hub',
  pageDescription: 'Upload Excel files or connect to SharePoint for automated data synchronization',
  
  uploadTab: {
    title: 'File Upload',
    cardTitle: 'Upload Budget Data',
    cardDescription: 'Upload your Excel file containing budgeted volumes, rates, and hours for all distribution centers',
    dragDropText: 'Click to upload or drag and drop',
    fileTypeText: 'Excel files (.xlsx, .xls, .csv) up to 10MB',
    processingText: 'Processing file... Please wait.',
    successPrefix: 'File uploaded successfully:',
    templateSectionTitle: 'Need a template?',
    templateSectionDescription: 'Download our Excel template to get started',
    templateButtonText: 'Download Template',
    expectedFormatTitle: 'Expected Data Format',
    expectedFormatDescription: 'Your Excel file should include the following columns',
    datasetsTitle: 'Imported Datasets',
    datasetsDescription: 'Manage your uploaded data files',
  },
  
  integrationTab: {
    title: 'SharePoint / Excel Integration',
    cardTitle: 'SharePoint / Excel Online Integration',
    cardDescription: 'Connect to your SharePoint Excel file for automatic data synchronization',
    requiresSupabaseNote: 'This feature requires Supabase integration for secure API key storage and data synchronization.',
    comingSoonNote: 'SharePoint integration requires Microsoft Graph API setup and Supabase for secure credential storage. Contact your IT administrator to enable this feature.',
    siteUrlLabel: 'SharePoint Site URL',
    siteUrlPlaceholder: 'https://yourcompany.sharepoint.com/sites/SupplyChain',
    filePathLabel: 'Excel File Path',
    filePathPlaceholder: '/Shared Documents/Budget_Data.xlsx',
    syncFrequencyLabel: 'Sync Frequency',
    connectButtonText: 'Connect to SharePoint (Coming Soon)',
    benefitsTitle: 'Integration Benefits',
  },
};

/**
 * Helper function to get required columns
 */
export function getRequiredColumns(): ColumnDefinition[] {
  return COLUMN_DEFINITIONS.filter(col => col.required);
}

/**
 * Helper function to get optional columns
 */
export function getOptionalColumns(): ColumnDefinition[] {
  return COLUMN_DEFINITIONS.filter(col => !col.required);
}

/**
 * Helper function to find column by field name
 */
export function getColumnDefinition(fieldName: string): ColumnDefinition | undefined {
  return COLUMN_DEFINITIONS.find(col => col.field === fieldName);
}

/**
 * Helper function to match header to column definition
 */
export function matchHeaderToColumn(header: string): ColumnDefinition | null {
  const headerLower = header.toLowerCase().trim();
  
  for (const column of COLUMN_DEFINITIONS) {
    for (const keyword of column.matchKeywords) {
      if (headerLower.includes(keyword)) {
        return column;
      }
    }
  }
  
  return null;
}
