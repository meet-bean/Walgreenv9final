/**
 * Google Sheets Integration Service
 * 
 * This service handles connecting to Google Sheets, fetching data,
 * and syncing with the data import system.
 * 
 * PRODUCTION SETUP:
 * 1. Create a Google Cloud Project
 * 2. Enable Google Sheets API
 * 3. Create OAuth 2.0 credentials
 * 4. Add authorized redirect URIs
 * 5. Store credentials securely (use Supabase in production)
 */

import { parseFile, saveImportedDataset, type ImportedDataRow, type DatasetType } from './dataImportService';

export interface GoogleSheetsConnection {
  id: string;
  name: string;
  spreadsheetId: string;
  spreadsheetName: string;
  sheetName: string; // Specific sheet/tab name
  spreadsheetUrl: string;
  datasetType: DatasetType;
  syncFrequency: 'manual' | 'hourly' | '6hours' | 'daily';
  isActive: boolean;
  lastSync?: Date;
  rowCount?: number;
  columnCount?: number;
  createdAt: Date;
  credentials?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };
}

const STORAGE_KEY = 'google_sheets_connections';

// Google Sheets API configuration (placeholder - replace with real values)
const GOOGLE_SHEETS_CONFIG = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  apiKey: 'YOUR_GOOGLE_API_KEY',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
};

/**
 * Extract spreadsheet ID from Google Sheets URL
 */
export function extractSpreadsheetId(url: string): string | null {
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Validate Google Sheets URL format
 */
export function isValidGoogleSheetsUrl(url: string): boolean {
  return /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/.test(url);
}

/**
 * Get all Google Sheets connections
 */
export function getAllGoogleSheetsConnections(): GoogleSheetsConnection[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const connections = JSON.parse(stored);
    // Convert date strings back to Date objects
    return connections.map((conn: any) => ({
      ...conn,
      createdAt: new Date(conn.createdAt),
      lastSync: conn.lastSync ? new Date(conn.lastSync) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load Google Sheets connections:', error);
    return [];
  }
}

/**
 * Save Google Sheets connection
 */
export function saveGoogleSheetsConnection(connection: Omit<GoogleSheetsConnection, 'id' | 'createdAt'>): GoogleSheetsConnection {
  const connections = getAllGoogleSheetsConnections();
  
  const newConnection: GoogleSheetsConnection = {
    ...connection,
    id: `gsheet_${Date.now()}`,
    createdAt: new Date(),
  };
  
  connections.push(newConnection);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  
  return newConnection;
}

/**
 * Update Google Sheets connection
 */
export function updateGoogleSheetsConnection(id: string, updates: Partial<GoogleSheetsConnection>): void {
  const connections = getAllGoogleSheetsConnections();
  const index = connections.findIndex(conn => conn.id === id);
  
  if (index !== -1) {
    connections[index] = { ...connections[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }
}

/**
 * Delete Google Sheets connection
 */
export function deleteGoogleSheetsConnection(id: string): void {
  const connections = getAllGoogleSheetsConnections();
  const filtered = connections.filter(conn => conn.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Get connection by ID
 */
export function getGoogleSheetsConnectionById(id: string): GoogleSheetsConnection | null {
  const connections = getAllGoogleSheetsConnections();
  return connections.find(conn => conn.id === id) || null;
}

/**
 * MOCK: Authenticate with Google
 * 
 * In production, this would:
 * 1. Open OAuth popup
 * 2. Request user consent
 * 3. Receive authorization code
 * 4. Exchange for access/refresh tokens
 * 5. Store tokens securely
 */
export async function authenticateWithGoogle(): Promise<{ success: boolean; error?: string }> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful authentication
      resolve({ success: true });
    }, 1500);
  });
}

/**
 * MOCK: Fetch spreadsheet metadata
 * 
 * In production, this would call:
 * GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}
 */
export async function fetchSpreadsheetMetadata(spreadsheetId: string): Promise<{
  name: string;
  sheets: Array<{ name: string; sheetId: number; rowCount: number; columnCount: number }>;
}> {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Budget Data 2025',
        sheets: [
          { name: 'January', sheetId: 0, rowCount: 50, columnCount: 8 },
          { name: 'February', sheetId: 1, rowCount: 48, columnCount: 8 },
          { name: 'Q1 Summary', sheetId: 2, rowCount: 150, columnCount: 10 },
          { name: 'Actuals', sheetId: 3, rowCount: 120, columnCount: 13 },
        ],
      });
    }, 1000);
  });
}

/**
 * MOCK: Fetch data from Google Sheet
 * 
 * In production, this would call:
 * GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}
 */
export async function fetchSheetData(
  spreadsheetId: string,
  sheetName: string
): Promise<ImportedDataRow[]> {
  // Mock implementation - returns sample data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample data that matches our import structure
      const mockData: ImportedDataRow[] = [
        {
          task: 'Receiving',
          budgetedVolume: 5000,
          budgetedRate: 250,
          budgetedHours: 20,
          forecastedVolume: 5200,
          actualVolume: 4950,
          actualRate: 240,
          actualHours: 20.6,
          efficiency: 99,
          siteId: 'DC-001',
          jobFunction: 'Inbound',
          date: '2024-11-14',
        },
        {
          task: 'Put Away',
          budgetedVolume: 4500,
          budgetedRate: 200,
          budgetedHours: 22.5,
          forecastedVolume: 4600,
          actualVolume: 4600,
          actualRate: 210,
          actualHours: 21.9,
          efficiency: 105,
          siteId: 'DC-001',
          jobFunction: 'Inbound',
          date: '2024-11-14',
        },
        {
          task: 'Picking',
          budgetedVolume: 8000,
          budgetedRate: 300,
          budgetedHours: 26.67,
          forecastedVolume: 8200,
          actualVolume: 8200,
          actualRate: 315,
          actualHours: 26.0,
          efficiency: 105,
          siteId: 'DC-001',
          jobFunction: 'Outbound',
          date: '2024-11-14',
        },
      ];
      
      resolve(mockData);
    }, 1500);
  });
}

/**
 * Sync Google Sheet and import data
 */
export async function syncGoogleSheet(connectionId: string): Promise<{
  success: boolean;
  rowCount?: number;
  error?: string;
}> {
  try {
    const connection = getGoogleSheetsConnectionById(connectionId);
    if (!connection) {
      return { success: false, error: 'Connection not found' };
    }
    
    // Fetch data from Google Sheet
    const data = await fetchSheetData(connection.spreadsheetId, connection.sheetName);
    
    // Save as imported dataset
    saveImportedDataset(
      `${connection.spreadsheetName} - ${connection.sheetName}`,
      data,
      'file', // Could add 'google-sheets' as a source type
      connection.datasetType,
      `${connection.sheetName}.xlsx`
    );
    
    // Update connection last sync time
    updateGoogleSheetsConnection(connectionId, {
      lastSync: new Date(),
      rowCount: data.length,
      columnCount: data.length > 0 ? Object.keys(data[0]).length : 0,
    });
    
    return { success: true, rowCount: data.length };
  } catch (error: any) {
    console.error('Sync error:', error);
    return { success: false, error: error.message || 'Failed to sync' };
  }
}

/**
 * Test connection to Google Sheet
 */
export async function testGoogleSheetConnection(spreadsheetId: string): Promise<{
  success: boolean;
  spreadsheetName?: string;
  error?: string;
}> {
  try {
    const metadata = await fetchSpreadsheetMetadata(spreadsheetId);
    return { success: true, spreadsheetName: metadata.name };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to connect' };
  }
}

/**
 * PRODUCTION SETUP GUIDE
 * 
 * Step 1: Create Google Cloud Project
 * - Go to https://console.cloud.google.com
 * - Create new project or select existing
 * - Enable Google Sheets API
 * 
 * Step 2: Create OAuth 2.0 Credentials
 * - Go to APIs & Services > Credentials
 * - Create OAuth client ID
 * - Application type: Web application
 * - Authorized JavaScript origins: https://yourdomain.com
 * - Authorized redirect URIs: https://yourdomain.com/oauth/callback
 * 
 * Step 3: Configure in Code
 * Replace GOOGLE_SHEETS_CONFIG with real values:
 * - clientId: Your OAuth 2.0 Client ID
 * - apiKey: Your API key (if using API key authentication)
 * 
 * Step 4: Implement OAuth Flow
 * - Use gapi.auth2 library for authentication
 * - Store tokens in Supabase (not localStorage)
 * - Implement token refresh logic
 * 
 * Step 5: Security
 * - Never expose client secret in frontend
 * - Use Supabase Edge Functions for sensitive operations
 * - Implement proper CORS configuration
 * - Add rate limiting
 * 
 * Example OAuth Flow:
 * ```typescript
 * const auth2 = gapi.auth2.init({
 *   client_id: GOOGLE_SHEETS_CONFIG.clientId,
 *   scope: GOOGLE_SHEETS_CONFIG.scopes
 * });
 * 
 * const googleUser = await auth2.signIn();
 * const authResponse = googleUser.getAuthResponse();
 * const accessToken = authResponse.access_token;
 * ```
 * 
 * Example API Call:
 * ```typescript
 * const response = await fetch(
 *   `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
 *   {
 *     headers: {
 *       'Authorization': `Bearer ${accessToken}`
 *     }
 *   }
 * );
 * const data = await response.json();
 * ```
 */
