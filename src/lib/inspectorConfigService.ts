/**
 * Inspector Configuration Service
 * Manages saving and loading element modifications made through the ElementInspector
 */

export interface ElementModification {
  // Selector to identify the element
  selector: string;
  // Original tag name
  originalTag: string;
  // New tag name (if changed)
  newTag?: string;
  // Timestamp of modification
  timestamp: number;
  // Optional description
  description?: string;
}

export interface InspectorConfiguration {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  modifications: ElementModification[];
}

const STORAGE_KEY = 'inspector_configurations';

/**
 * Get a unique CSS selector for an element
 */
export function getUniqueSelector(element: HTMLElement): string {
  // Try ID first
  if (element.id) {
    return `#${element.id}`;
  }
  
  // Build a path using nth-child selectors for uniqueness
  const path: string[] = [];
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.className) {
      const classNameValue = typeof current.className === 'string' 
        ? current.className 
        : (current.className as any).baseVal || '';
      const classes = classNameValue.split(' ').filter((c: string) => c.trim());
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    // Add nth-child to make it unique
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children);
      const index = siblings.indexOf(current) + 1;
      selector += `:nth-child(${index})`;
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

/**
 * Load all saved configurations
 */
export function loadConfigurations(): InspectorConfiguration[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load inspector configurations:', error);
    return [];
  }
}

/**
 * Save a configuration
 */
export function saveConfiguration(config: Omit<InspectorConfiguration, 'id' | 'createdAt' | 'updatedAt'>): InspectorConfiguration {
  const configurations = loadConfigurations();
  
  const newConfig: InspectorConfiguration = {
    ...config,
    id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  configurations.push(newConfig);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configurations));
  } catch (error) {
    console.error('Failed to save inspector configuration:', error);
  }
  
  return newConfig;
}

/**
 * Update an existing configuration
 */
export function updateConfiguration(id: string, updates: Partial<InspectorConfiguration>): boolean {
  const configurations = loadConfigurations();
  const index = configurations.findIndex(c => c.id === id);
  
  if (index === -1) return false;
  
  configurations[index] = {
    ...configurations[index],
    ...updates,
    id: configurations[index].id, // Preserve ID
    createdAt: configurations[index].createdAt, // Preserve creation time
    updatedAt: Date.now(),
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configurations));
    return true;
  } catch (error) {
    console.error('Failed to update inspector configuration:', error);
    return false;
  }
}

/**
 * Delete a configuration
 */
export function deleteConfiguration(id: string): boolean {
  const configurations = loadConfigurations();
  const filtered = configurations.filter(c => c.id !== id);
  
  if (filtered.length === configurations.length) return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete inspector configuration:', error);
    return false;
  }
}

/**
 * Apply a configuration to the current page
 */
export function applyConfiguration(config: InspectorConfiguration): {
  success: number;
  failed: number;
  errors: string[];
} {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };
  
  config.modifications.forEach(mod => {
    try {
      const element = document.querySelector(mod.selector) as HTMLElement;
      
      if (!element) {
        results.failed++;
        results.errors.push(`Element not found: ${mod.selector}`);
        return;
      }
      
      // Apply tag change if specified
      if (mod.newTag && mod.newTag !== element.tagName.toLowerCase()) {
        const newElement = document.createElement(mod.newTag);
        
        // Copy all attributes
        Array.from(element.attributes).forEach(attr => {
          newElement.setAttribute(attr.name, attr.value);
        });
        
        // Copy all children
        while (element.firstChild) {
          newElement.appendChild(element.firstChild);
        }
        
        // Replace in DOM
        element.parentNode?.replaceChild(newElement, element);
      }
      
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`Failed to apply modification to ${mod.selector}: ${error}`);
    }
  });
  
  return results;
}

/**
 * Get a configuration by ID
 */
export function getConfiguration(id: string): InspectorConfiguration | null {
  const configurations = loadConfigurations();
  return configurations.find(c => c.id === id) || null;
}

/**
 * Export configurations as JSON
 */
export function exportConfigurations(): string {
  const configurations = loadConfigurations();
  return JSON.stringify(configurations, null, 2);
}

/**
 * Import configurations from JSON
 */
export function importConfigurations(json: string): boolean {
  try {
    const imported = JSON.parse(json) as InspectorConfiguration[];
    const existing = loadConfigurations();
    
    // Merge, avoiding duplicates
    const merged = [...existing];
    imported.forEach(imp => {
      if (!merged.find(m => m.id === imp.id)) {
        merged.push(imp);
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return true;
  } catch (error) {
    console.error('Failed to import configurations:', error);
    return false;
  }
}
