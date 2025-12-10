import { read, utils } from 'xlsx';
import {
  COLUMN_DEFINITIONS,
  VALIDATION_RULES,
  TEMPLATE_SAMPLE_DATA,
  matchHeaderToColumn,
} from './dataImportConfig';

// Function to get configuration (from localStorage or defaults)
function getConfig() {
  try {
    const stored = localStorage.getItem('dataImportConfig');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        columns: parsed.columns || COLUMN_DEFINITIONS,
        validationRules: parsed.validationRules || VALIDATION_RULES,
        templateSampleData: parsed.templateSampleData || TEMPLATE_SAMPLE_DATA,
      };
    }
  } catch (error) {
    console.error('Failed to load custom config:', error);
  }
  
  return {
    columns: COLUMN_DEFINITIONS,
    validationRules: VALIDATION_RULES,
    templateSampleData: TEMPLATE_SAMPLE_DATA,
  };
}

// Helper to match header using stored config
function matchHeaderWithConfig(header: string) {
  const config = getConfig();
  const headerLower = header.toLowerCase().trim();
  
  for (const column of config.columns) {
    for (const keyword of column.matchKeywords) {
      if (headerLower.includes(keyword)) {
        return column;
      }
    }
  }
  
  return null;
}

// Import data types
export interface ImportedDataRow {
  taskId: string;
  budgetedVolume: number;
  budgetedRate: number;
  budgetedHours: number;
  forecastedVolume?: number;
  siteId?: string;
  jobFunctionId?: string;
  date?: string;
  // Actual/Historical data fields
  actualVolume?: number;
  actualRate?: number;
  actualHours?: number;
  variance?: number;
  efficiency?: number;
  [key: string]: any; // Allow additional metadata
}

export type DatasetType = 'budget' | 'actual' | 'combined';

export interface ImportedDataset {
  id: string;
  name: string;
  uploadDate: Date;
  source: 'file' | 'sharepoint';
  datasetType?: DatasetType; // Type of data: budget, actual, or combined
  fileName?: string;
  sharepointUrl?: string;
  syncFrequency?: 'hourly' | '6hours' | 'daily' | 'manual';
  lastSync?: Date;
  rowCount: number;
  columnCount: number;
  data: ImportedDataRow[];
  metadata: {
    distributionCenters?: string[];
    jobFunctions?: string[];
    dateRange?: { start: string; end: string };
  };
}

export interface SharePointConnection {
  id: string;
  name: string;
  siteUrl: string;
  filePath: string;
  syncFrequency: 'hourly' | '6hours' | 'daily' | 'manual';
  isActive: boolean;
  lastSync?: Date;
  credentials: {
    clientId?: string;
    tenantId?: string;
    // Note: In production, credentials should be stored in Supabase, not localStorage
  };
}

const STORAGE_KEYS = {
  DATASETS: 'imported_datasets',
  SHAREPOINT_CONNECTIONS: 'sharepoint_connections',
};

// Sheet metadata interface
export interface SheetMetadata {
  name: string;
  index: number;
  rowCount: number;
  columnCount: number;
}

// Get all sheets metadata from Excel file
export async function getExcelSheets(file: File): Promise<SheetMetadata[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        const sheets: SheetMetadata[] = workbook.SheetNames.map((name, index) => {
          const worksheet = workbook.Sheets[name];
          const jsonData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          return {
            name,
            index,
            rowCount: jsonData.length,
            columnCount: jsonData.length > 0 ? jsonData[0].length : 0,
          };
        });
        
        resolve(sheets);
      } catch (error) {
        reject(new Error(`Failed to read Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Parse specific sheet from Excel file
export async function parseExcelSheet(file: File, sheetName: string): Promise<ImportedDataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        // Check if sheet exists
        if (!workbook.SheetNames.includes(sheetName)) {
          reject(new Error(`Sheet "${sheetName}" not found in file`));
          return;
        }
        
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Parse headers and data
        if (jsonData.length < 2) {
          reject(new Error('Sheet must contain headers and at least one row of data'));
          return;
        }
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        
        // Map to ImportedDataRow
        const parsedData = rows
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .map((row, index) => {
            const dataRow: ImportedDataRow = {
              taskId: '',
              budgetedVolume: 0,
              budgetedRate: 0,
              budgetedHours: 0,
            };
            
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              const columnDef = matchHeaderWithConfig(String(header));
              
              if (columnDef) {
                // Use configuration-based mapping
                const field = columnDef.field;
                if (columnDef.type === 'number') {
                  (dataRow as any)[field] = Number(value) || 0;
                } else if (columnDef.type === 'date') {
                  (dataRow as any)[field] = String(value || '');
                } else {
                  (dataRow as any)[field] = String(value || '');
                }
              } else {
                // Fallback to legacy field mapping
                const normalizedHeader = String(header).toLowerCase();
                if (normalizedHeader.includes('task')) {
                  dataRow.taskId = String(value || '');
                } else if (normalizedHeader.includes('budget') && normalizedHeader.includes('volume')) {
                  dataRow.budgetedVolume = Number(value) || 0;
                } else if (normalizedHeader.includes('budget') && (normalizedHeader.includes('rate') || normalizedHeader.includes('uph'))) {
                  dataRow.budgetedRate = Number(value) || 0;
                } else if (normalizedHeader.includes('budget') && normalizedHeader.includes('hour')) {
                  dataRow.budgetedHours = Number(value) || 0;
                }
              }
            });
            
            return dataRow;
          });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Failed to parse sheet: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Parse Excel file (backwards compatibility - uses first sheet)
export async function parseExcelFile(file: File): Promise<ImportedDataRow[]> {
  return new Promise(async (resolve, reject) => {
    try {
      // Get all sheets
      const sheets = await getExcelSheets(file);
      
      if (sheets.length === 0) {
        reject(new Error('No sheets found in Excel file'));
        return;
      }
      
      // Parse first sheet
      const data = await parseExcelSheet(file, sheets[0].name);
      resolve(data);
    } catch (error: any) {
      reject(error);
    }
  });
}

// Legacy code (kept for reference, no longer used)
async function parseExcelFileLegacy(file: File): Promise<ImportedDataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Parse headers and data
        if (jsonData.length < 2) {
          reject(new Error('File must contain headers and at least one row of data'));
          return;
        }
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        
        // Map to ImportedDataRow
        const parsedData = rows
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .map((row, index) => {
            const dataRow: ImportedDataRow = {
              taskId: '',
              budgetedVolume: 0,
              budgetedRate: 0,
              budgetedHours: 0,
            };
            
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              const columnDef = matchHeaderWithConfig(String(header));
              
              if (columnDef) {
                // Use configuration-based mapping
                const field = columnDef.field;
                if (columnDef.type === 'number') {
                  (dataRow as any)[field] = Number(value) || 0;
                } else if (columnDef.type === 'date') {
                  (dataRow as any)[field] = String(value || '');
                } else {
                  (dataRow as any)[field] = String(value || '');
                }
              } else {
                // Store any additional columns not in configuration
                dataRow[header] = value;
              }
            });
            
            return dataRow;
          });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Parse CSV file
export async function parseCSVFile(file: File): Promise<ImportedDataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('File must contain headers and at least one row of data'));
          return;
        }
        
        // Parse CSV (simple parser - handles basic cases)
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          result.push(current.trim());
          return result;
        };
        
        const headers = parseCSVLine(lines[0]);
        const rows = lines.slice(1).map(line => parseCSVLine(line));
        
        // Map to ImportedDataRow
        const parsedData = rows
          .filter(row => row.some(cell => cell !== ''))
          .map(row => {
            const dataRow: ImportedDataRow = {
              taskId: '',
              budgetedVolume: 0,
              budgetedRate: 0,
              budgetedHours: 0,
            };
            
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              const columnDef = matchHeaderWithConfig(header);
              
              if (columnDef) {
                // Use configuration-based mapping
                const field = columnDef.field;
                if (columnDef.type === 'number') {
                  (dataRow as any)[field] = Number(value) || 0;
                } else if (columnDef.type === 'date') {
                  (dataRow as any)[field] = value || '';
                } else {
                  (dataRow as any)[field] = value || '';
                }
              } else {
                // Store any additional columns not in configuration
                dataRow[header] = value;
              }
            });
            
            return dataRow;
          });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Failed to parse CSV file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

// Parse file based on extension
export async function parseFile(file: File): Promise<ImportedDataRow[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    return parseCSVFile(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcelFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload .xlsx, .xls, or .csv files.');
  }
}

// Extract headers from file (for column mapping)
export async function extractHeaders(file: File): Promise<string[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (extension === 'csv') {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          if (lines.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          resolve(headers);
        } else if (extension === 'xlsx' || extension === 'xls') {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file is empty'));
            return;
          }
          
          const headers = (jsonData[0] as string[]).map(h => String(h || '').trim());
          resolve(headers);
        } else {
          reject(new Error('Unsupported file type'));
        }
      } catch (error) {
        reject(new Error(`Failed to extract headers: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (extension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

// Parse file with custom column mapping
export async function parseFileWithMapping(
  file: File,
  columnMapping: Record<string, string>
): Promise<ImportedDataRow[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let headers: string[] = [];
        let rows: any[][] = [];
        
        if (extension === 'csv') {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          if (lines.length < 2) {
            reject(new Error('File must contain headers and at least one row of data'));
            return;
          }
          
          headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        } else if (extension === 'xlsx' || extension === 'xls') {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            reject(new Error('File must contain headers and at least one row of data'));
            return;
          }
          
          headers = (jsonData[0] as string[]).map(h => String(h || '').trim());
          rows = jsonData.slice(1);
        } else {
          reject(new Error('Unsupported file type'));
          return;
        }
        
        // Map rows using the provided column mapping
        const parsedData = rows
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .map(row => {
            const dataRow: ImportedDataRow = {
              taskId: '',
              budgetedVolume: 0,
              budgetedRate: 0,
              budgetedHours: 0,
            };
            
            headers.forEach((userHeader, colIndex) => {
              const value = row[colIndex];
              const systemField = columnMapping[userHeader];
              
              if (systemField) {
                const columnDef = COLUMN_DEFINITIONS.find(col => col.field === systemField);
                
                if (columnDef) {
                  if (columnDef.type === 'number') {
                    (dataRow as any)[systemField] = Number(value) || 0;
                  } else if (columnDef.type === 'date') {
                    (dataRow as any)[systemField] = String(value || '');
                  } else {
                    (dataRow as any)[systemField] = String(value || '');
                  }
                }
              }
            });
            
            return dataRow;
          });
        
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    if (extension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

// Extract metadata from parsed data
function extractMetadata(data: ImportedDataRow[]) {
  const distributionCenters = new Set<string>();
  const jobFunctions = new Set<string>();
  let minDate: string | null = null;
  let maxDate: string | null = null;
  
  data.forEach(row => {
    if (row.siteId) distributionCenters.add(row.siteId);
    if (row.jobFunctionId) jobFunctions.add(row.jobFunctionId);
    if (row.date) {
      if (!minDate || row.date < minDate) minDate = row.date;
      if (!maxDate || row.date > maxDate) maxDate = row.date;
    }
  });
  
  return {
    distributionCenters: Array.from(distributionCenters),
    jobFunctions: Array.from(jobFunctions),
    dateRange: minDate && maxDate ? { start: minDate, end: maxDate } : undefined,
  };
}

// Save imported dataset
export function saveImportedDataset(
  name: string,
  data: ImportedDataRow[],
  source: 'file' | 'sharepoint',
  datasetType?: DatasetType,
  fileName?: string,
  sharepointUrl?: string
): ImportedDataset {
  const dataset: ImportedDataset = {
    id: `dataset_${Date.now()}`,
    name,
    uploadDate: new Date(),
    source,
    datasetType: datasetType || 'budget', // Default to budget if not specified
    fileName,
    sharepointUrl,
    lastSync: new Date(),
    rowCount: data.length,
    columnCount: data.length > 0 ? Object.keys(data[0]).length : 0,
    data,
    metadata: extractMetadata(data),
  };
  
  const datasets = getAllDatasets();
  datasets.push(dataset);
  localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
  
  return dataset;
}

// Get all datasets
export function getAllDatasets(): ImportedDataset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DATASETS);
    if (!stored) return [];
    
    const datasets = JSON.parse(stored);
    // Convert date strings back to Date objects
    return datasets.map((ds: any) => ({
      ...ds,
      uploadDate: new Date(ds.uploadDate),
      lastSync: ds.lastSync ? new Date(ds.lastSync) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load datasets:', error);
    return [];
  }
}

// Get dataset by ID
export function getDatasetById(id: string): ImportedDataset | null {
  const datasets = getAllDatasets();
  return datasets.find(ds => ds.id === id) || null;
}

// Delete dataset
export function deleteDataset(id: string): void {
  const datasets = getAllDatasets();
  const filtered = datasets.filter(ds => ds.id !== id);
  localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(filtered));
}

// SharePoint connection management
export function saveSharePointConnection(connection: Omit<SharePointConnection, 'id'>): SharePointConnection {
  const newConnection: SharePointConnection = {
    ...connection,
    id: `sp_${Date.now()}`,
  };
  
  const connections = getAllSharePointConnections();
  connections.push(newConnection);
  localStorage.setItem(STORAGE_KEYS.SHAREPOINT_CONNECTIONS, JSON.stringify(connections));
  
  return newConnection;
}

export function getAllSharePointConnections(): SharePointConnection[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SHAREPOINT_CONNECTIONS);
    if (!stored) return [];
    
    const connections = JSON.parse(stored);
    return connections.map((conn: any) => ({
      ...conn,
      lastSync: conn.lastSync ? new Date(conn.lastSync) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load SharePoint connections:', error);
    return [];
  }
}

export function deleteSharePointConnection(id: string): void {
  const connections = getAllSharePointConnections();
  const filtered = connections.filter(conn => conn.id !== id);
  localStorage.setItem(STORAGE_KEYS.SHAREPOINT_CONNECTIONS, JSON.stringify(filtered));
}

// Validate imported data
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
}

export function validateImportedData(data: ImportedDataRow[]): ValidationResult {
  const config = getConfig();
  const errors: string[] = [];
  const warnings: string[] = [];
  let validRows = 0;
  
  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 for header and 0-indexing
    
    // Required fields - check for taskId (not the old 'task' field)
    if (!row.taskId || (typeof row.taskId === 'string' && row.taskId.trim() === '')) {
      errors.push(`Row ${rowNum}: Task name is required`);
    } else {
      validRows++;
    }
    
    // Numeric validations (using configuration)
    if (!config.validationRules.allowNegativeNumbers) {
      if (row.budgetedVolume < 0) {
        errors.push(`Row ${rowNum}: Budgeted volume cannot be negative`);
      }
      if (row.budgetedRate < 0) {
        errors.push(`Row ${rowNum}: Budgeted rate cannot be negative`);
      }
      if (row.budgetedHours < 0) {
        errors.push(`Row ${rowNum}: Budgeted hours cannot be negative`);
      }
    }
    
    // Warnings (using configuration)
    if (config.validationRules.warnOnZeroValues) {
      if (row.budgetedVolume === 0) {
        warnings.push(`Row ${rowNum}: Budgeted volume is zero`);
      }
      if (row.budgetedRate === 0) {
        warnings.push(`Row ${rowNum}: Budgeted rate is zero`);
      }
    }
    
    // Calculated hours validation (using configuration)
    if (config.validationRules.validateCalculatedHours && row.budgetedVolume > 0 && row.budgetedRate > 0) {
      const calculatedHours = row.budgetedVolume / row.budgetedRate;
      const difference = Math.abs(calculatedHours - row.budgetedHours);
      if (difference > config.validationRules.calculatedHoursTolerance) {
        warnings.push(
          `Row ${rowNum}: Budgeted hours (${row.budgetedHours}) doesn't match calculated hours (${calculatedHours.toFixed(2)})`
        );
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalRows: data.length,
      validRows,
      invalidRows: data.length - validRows,
    },
  };
}

// Generate sample template data (using configuration)
export function generateTemplateData(): ImportedDataRow[] {
  const config = getConfig();
  return (config.templateSampleData || TEMPLATE_SAMPLE_DATA) as ImportedDataRow[];
}

// Export template as CSV (using configuration)
export function downloadTemplate(): void {
  const config = getConfig();
  const templateData = generateTemplateData();
  
  // Create CSV content using column definitions
  const headers = config.columns.map(col => col.displayName);
  
  const rows = templateData.map(row => 
    config.columns.map(col => {
      const value = (row as any)[col.field];
      return value !== undefined && value !== null ? value : '';
    })
  );
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'budget_data_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}