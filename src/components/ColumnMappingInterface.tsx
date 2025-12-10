import { useState, useEffect } from 'react';
import { Button } from './design-system/Button';
import { Label } from './design-system/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { CheckCircle2, AlertCircle, HelpCircle, Save } from 'lucide-react';
import { getColumnDefinitionsForImport, getAllFieldsWithCustom } from '../lib/unifiedFieldSchema';

export interface ColumnMapping {
  userColumn: string;
  systemField: string | null;
  confidence: 'high' | 'medium' | 'low' | 'none';
  isRequired: boolean;
}

interface ColumnMappingInterfaceProps {
  userColumns: string[];
  onConfirm: (mappings: Record<string, string>) => void;
  onCancel: () => void;
  fileName: string;
}

// Auto-detection logic with confidence scoring
function autoDetectMapping(userColumn: string, systemField: string): { confidence: 'high' | 'medium' | 'low' | 'none', score: number } {
  const userLower = userColumn.toLowerCase().trim();
  const allFields = getColumnDefinitionsForImport();
  const systemDef = allFields.find(col => col.field === systemField);
  
  if (!systemDef || !systemDef.displayName) return { confidence: 'none', score: 0 };
  
  // Get match keywords from the unified schema
  const matchKeywords = systemDef.matchKeywords || [];
  
  // Exact match keywords - include field name, display name, and schema keywords
  const exactKeywords = [
    systemDef.field.toLowerCase(),
    systemDef.displayName.toLowerCase(),
    ...matchKeywords,
    ...(systemDef.columnHint ? [systemDef.columnHint.toLowerCase()] : [])
  ].filter(Boolean);
  
  // Check exact match
  for (const keyword of exactKeywords) {
    if (userLower === keyword) {
      return { confidence: 'high', score: 100 };
    }
  }
  
  // Check if user column contains exact keyword
  for (const keyword of exactKeywords) {
    if (userLower.includes(keyword) || keyword.includes(userLower)) {
      return { confidence: 'high', score: 90 };
    }
  }
  
  // Check partial word matches from matchKeywords
  let matchCount = 0;
  for (const keyword of matchKeywords) {
    const keywordWords = keyword.split(' ');
    for (const word of keywordWords) {
      if (userLower.includes(word) && word.length > 2) {
        matchCount++;
      }
    }
  }
  
  if (matchCount >= 2) {
    return { confidence: 'medium', score: 60 };
  } else if (matchCount === 1) {
    return { confidence: 'low', score: 30 };
  }
  
  return { confidence: 'none', score: 0 };
}

// Find best match for each user column
function detectMappings(userColumns: string[]): ColumnMapping[] {
  const allFields = getColumnDefinitionsForImport();
  const systemFields = allFields.map(col => col.field);
  const mappings: ColumnMapping[] = [];
  const usedSystemFields = new Set<string>();
  
  // First pass: assign high confidence matches
  for (const userCol of userColumns) {
    let bestMatch: { field: string | null; confidence: 'high' | 'medium' | 'low' | 'none'; score: number } = {
      field: null,
      confidence: 'none',
      score: 0
    };
    
    for (const systemField of systemFields) {
      if (usedSystemFields.has(systemField)) continue;
      
      const result = autoDetectMapping(userCol, systemField);
      if (result.score > bestMatch.score) {
        bestMatch = { field: systemField, confidence: result.confidence, score: result.score };
      }
    }
    
    // Only auto-assign if confidence is high or medium
    if (bestMatch.field && (bestMatch.confidence === 'high' || bestMatch.confidence === 'medium')) {
      usedSystemFields.add(bestMatch.field);
      const systemDef = allFields.find(col => col.field === bestMatch.field);
      mappings.push({
        userColumn: userCol,
        systemField: bestMatch.field,
        confidence: bestMatch.confidence,
        isRequired: systemDef?.required || false
      });
    } else {
      // Always show unmapped columns so user can manually map them
      mappings.push({
        userColumn: userCol,
        systemField: null,
        confidence: 'none',
        isRequired: false
      });
    }
  }
  
  return mappings;
}

// Load saved mappings from localStorage
function loadSavedMappings(fileName: string): Record<string, string> | null {
  try {
    const saved = localStorage.getItem('columnMappings');
    if (saved) {
      const allMappings = JSON.parse(saved);
      const mappings = allMappings[fileName] || null;
      
      // Migrate old field names to new unified schema field names
      if (mappings) {
        const migratedMappings: Record<string, string> = {};
        const fieldMigrations: Record<string, string> = {
          'task': 'taskId',
          'jobFunction': 'jobFunctionId',
          'dc': 'siteId',
          'site': 'siteId',
        };
        
        for (const [userCol, systemField] of Object.entries(mappings)) {
          // Check if this field needs migration
          const migratedField = fieldMigrations[systemField as string] || systemField;
          migratedMappings[userCol] = migratedField as string;
        }
        
        return migratedMappings;
      }
      return null;
    }
  } catch (error) {
    console.error('Failed to load saved mappings:', error);
  }
  return null;
}

// Save mappings to localStorage
function saveMappings(fileName: string, mappings: Record<string, string>) {
  try {
    const saved = localStorage.getItem('columnMappings');
    const allMappings = saved ? JSON.parse(saved) : {};
    allMappings[fileName] = mappings;
    localStorage.setItem('columnMappings', JSON.stringify(allMappings));
  } catch (error) {
    console.error('Failed to save mappings:', error);
  }
}

export function ColumnMappingInterface({ userColumns, onConfirm, onCancel, fileName }: ColumnMappingInterfaceProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [showSaveOption, setShowSaveOption] = useState(false);
  
  useEffect(() => {
    const allFields = getAllFieldsWithCustom(); // Get all fields from unified schema inside useEffect
    
    // Check for saved mappings first
    const savedMappings = loadSavedMappings(fileName);
    
    if (savedMappings) {
      // Use saved mappings
      const restoredMappings: ColumnMapping[] = userColumns.map(userCol => {
        const systemField = savedMappings[userCol] || null;
        const systemDef = allFields.find(col => col.field === systemField);
        return {
          userColumn: userCol,
          systemField,
          confidence: systemField ? 'high' : 'none',
          isRequired: systemDef?.required || false
        };
      });
      setMappings(restoredMappings);
    } else {
      // Auto-detect mappings
      const detected = detectMappings(userColumns);
      setMappings(detected);
      setShowSaveOption(true);
    }
  }, [userColumns, fileName]);
  
  const handleMappingChange = (userColumn: string, newSystemField: string | null) => {
    const allFields = getAllFieldsWithCustom();
    setMappings(prev => prev.map(mapping => {
      if (mapping.userColumn === userColumn) {
        const systemDef = allFields.find(col => col.field === newSystemField);
        return {
          ...mapping,
          systemField: newSystemField,
          confidence: newSystemField ? 'high' : 'none',
          isRequired: systemDef?.required || false
        };
      }
      return mapping;
    }));
    setShowSaveOption(true);
  };
  
  const handleConfirm = () => {
    const mappingDict: Record<string, string> = {};
    mappings.forEach(m => {
      if (m.systemField) {
        mappingDict[m.userColumn] = m.systemField;
      }
    });
    
    if (showSaveOption) {
      saveMappings(fileName, mappingDict);
    }
    
    onConfirm(mappingDict);
  };
  
  const allFields = getAllFieldsWithCustom(); // Get for render
  
  console.log('All fields for mapping:', allFields);
  console.log('Number of fields:', allFields.length);
  console.log('Current mappings state:', mappings);
  console.log('Mappings with values:', mappings.map(m => ({ userColumn: m.userColumn, systemField: m.systemField })));
  
  // Check if all required fields are mapped
  const requiredFields = allFields.filter(col => col.required).map(col => col.field);
  const mappedFields = mappings.filter(m => m.systemField).map(m => m.systemField);
  const missingRequired = requiredFields.filter(field => !mappedFields.includes(field));
  const canConfirm = missingRequired.length === 0;
  
  // Get confidence stats
  const highConfidence = mappings.filter(m => m.confidence === 'high').length;
  const mediumConfidence = mappings.filter(m => m.confidence === 'medium').length;
  const lowConfidence = mappings.filter(m => m.confidence === 'low').length;
  const unmapped = mappings.filter(m => m.systemField === null).length;
  
  return (
    <div className="column-mapping-container">
      <div className="column-mapping-header">
        <div>
          <h3 className="column-mapping-title">Map Your Columns</h3>
          <p className="column-mapping-description">
            We've automatically detected column mappings. Review and adjust as needed.
          </p>
        </div>
        <div className="column-mapping-stats">
          <div className="mapping-stat" style={{ color: 'var(--chart-2)' }}>
            <CheckCircle2 size={16} />
            <span>{highConfidence} high confidence</span>
          </div>
          {mediumConfidence > 0 && (
            <div className="mapping-stat" style={{ color: 'var(--chart-3)' }}>
              <HelpCircle size={16} />
              <span>{mediumConfidence} medium confidence</span>
            </div>
          )}
          {unmapped > 0 && (
            <div className="mapping-stat" style={{ color: 'var(--color-muted-foreground)' }}>
              <AlertCircle size={16} />
              <span>{unmapped} unmapped</span>
            </div>
          )}
        </div>
      </div>
      
      {missingRequired.length > 0 && (
        <div className="column-mapping-warning">
          <AlertCircle size={16} />
          <span>
            Missing required fields: {missingRequired.map(field => 
              allFields.find(col => col.field === field)?.displayName
            ).join(', ')}
          </span>
        </div>
      )}
      
      <div className="column-mapping-list">
        {mappings.map((mapping) => {
          const systemDef = allFields.find(col => col.field === mapping.systemField);
          
          return (
            <div key={mapping.userColumn} className="column-mapping-row">
              <div className="column-mapping-row-content">
                <div className="column-mapping-user-column">
                  <div 
                    className="confidence-indicator"
                    style={{
                      backgroundColor: 
                        mapping.confidence === 'high' ? 'var(--chart-2)' :
                        mapping.confidence === 'medium' ? 'var(--chart-3)' :
                        'var(--color-muted-foreground)'
                    }}
                  />
                  <div>
                    <p className="user-column-name">{mapping.userColumn}</p>
                    <p className="user-column-subtitle">From your file</p>
                  </div>
                </div>
                
                <div className="column-mapping-arrow">→</div>
                
                <div className="column-mapping-system-field">
                  <Select
                    size="sm"
                    value={mapping.systemField || 'unmapped'}
                    onValueChange={(value) => handleMappingChange(mapping.userColumn, value === 'unmapped' ? null : value)}
                  >
                    <SelectTrigger className="column-mapping-select">
                      <SelectValue placeholder="Select field..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unmapped">
                        Don't import
                      </SelectItem>
                      {allFields.map(field => {
                        console.log('Rendering field option:', field.field, field.displayName);
                        return (
                          <SelectItem key={field.field} value={field.field}>
                            {field.displayName}{field.required ? ' *' : ''}{!field.isCore ? ' (custom)' : ''}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {systemDef && systemDef.description && (
                    <p className="system-field-description">{systemDef.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="column-mapping-footer">
        <div className="column-mapping-footer-actions">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            {showSaveOption && <Save size={16} style={{ marginRight: 'var(--spacing-2)' }} />}
            Confirm & Import
          </Button>
        </div>
        {showSaveOption && (
          <p className="column-mapping-footer-note">
            This mapping will be saved and automatically applied to future uploads with similar structure
          </p>
        )}
      </div>
    </div>
  );
}