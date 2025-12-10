/**
 * Safe localStorage utility that prevents crashes from:
 * - JSON.parse errors (corrupted data)
 * - QuotaExceededError (storage full)
 * - Null/undefined access
 * - Browser compatibility issues
 */

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Safely get and parse data from localStorage
 */
export function safeGetItem<T = any>(key: string, defaultValue?: T): StorageResult<T> {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        success: false,
        error: 'localStorage not available',
        data: defaultValue,
      };
    }

    const item = localStorage.getItem(key);
    
    // Return default if item doesn't exist
    if (item === null) {
      return {
        success: true,
        data: defaultValue,
      };
    }

    // Try to parse JSON
    try {
      const parsed = JSON.parse(item);
      return {
        success: true,
        data: parsed as T,
      };
    } catch (parseError) {
      console.warn(`Failed to parse localStorage item "${key}":`, parseError);
      
      // Auto-clear corrupted data
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        console.error(`Failed to remove corrupted item "${key}":`, removeError);
      }
      
      return {
        success: false,
        error: 'Failed to parse stored data',
        data: defaultValue,
      };
    }
  } catch (error) {
    console.error(`Error accessing localStorage for key "${key}":`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: defaultValue,
    };
  }
}

/**
 * Safely set data to localStorage with JSON stringification
 */
export function safeSetItem<T = any>(key: string, value: T): StorageResult<T> {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        success: false,
        error: 'localStorage not available',
      };
    }

    // Try to stringify and save
    try {
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
      
      return {
        success: true,
        data: value,
      };
    } catch (stringifyError) {
      console.error(`Failed to stringify value for key "${key}":`, stringifyError);
      return {
        success: false,
        error: 'Failed to stringify data',
      };
    }
  } catch (error) {
    // Handle QuotaExceededError
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('localStorage quota exceeded. Attempting to clear old data...');
      
      // Try to free up space by clearing non-essential data
      const result = clearOldData(key, value);
      if (result.success) {
        return result;
      }
      
      return {
        success: false,
        error: 'Storage quota exceeded. Please clear some data.',
      };
    }

    console.error(`Error setting localStorage for key "${key}":`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Safely remove an item from localStorage
 */
export function safeRemoveItem(key: string): StorageResult<void> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        success: false,
        error: 'localStorage not available',
      };
    }

    localStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Clear old/large data to make room for new data
 */
function clearOldData<T>(currentKey: string, currentValue: T): StorageResult<T> {
  try {
    // Keys to never delete (user preferences)
    const protectedKeys = ['theme', 'language', 'user-preferences'];
    
    // Get all keys and their sizes
    const items: Array<{ key: string; size: number }> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !protectedKeys.includes(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          items.push({
            key,
            size: new Blob([value]).size,
          });
        }
      }
    }
    
    // Sort by size (largest first)
    items.sort((a, b) => b.size - a.size);
    
    // Remove largest non-protected items until we can save
    for (const item of items) {
      try {
        localStorage.removeItem(item.key);
        console.log(`Removed "${item.key}" to free space (${item.size} bytes)`);
        
        // Try to save again
        try {
          const stringified = JSON.stringify(currentValue);
          localStorage.setItem(currentKey, stringified);
          
          console.log(`Successfully saved "${currentKey}" after clearing space`);
          return {
            success: true,
            data: currentValue,
          };
        } catch (retryError) {
          // Continue trying to clear more space
          continue;
        }
      } catch (removeError) {
        console.error(`Failed to remove item "${item.key}":`, removeError);
      }
    }
    
    return {
      success: false,
      error: 'Could not free enough space',
    };
  } catch (error) {
    console.error('Error clearing old data:', error);
    return {
      success: false,
      error: 'Failed to clear old data',
    };
  }
}

/**
 * Check if localStorage is available and working
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get approximate storage usage info
 */
export function getStorageInfo(): {
  used: number;
  available: boolean;
  itemCount: number;
} {
  try {
    if (!isLocalStorageAvailable()) {
      return { used: 0, available: false, itemCount: 0 };
    }

    let totalSize = 0;
    let itemCount = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += new Blob([key, value]).size;
          itemCount++;
        }
      }
    }

    return {
      used: totalSize,
      available: true,
      itemCount,
    };
  } catch {
    return { used: 0, available: false, itemCount: 0 };
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
