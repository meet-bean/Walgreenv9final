/**
 * USER-SPECIFIC SETTINGS & PREFERENCES
 * 
 * This file manages individual user preferences and settings that can be
 * customized per user while respecting system-wide defaults.
 */

import { UserRole, NotificationMethod } from './mockData';
import { DEFAULT_NOTIFICATION_PREFERENCES } from './config';

// ============================================================================
// USER SETTINGS INTERFACES
// ============================================================================

export interface UserNotificationPreferences {
  inApp: boolean;
  email: {
    critical: boolean;
    warning: boolean;
    info: boolean;
  };
  sms: {
    critical: boolean;
    warning: boolean;
    info: boolean;
    phoneNumber?: string;
    verified?: boolean;
  };
  digest: {
    daily: boolean;
    dailyTime?: string; // HH:MM format
    weekly: boolean;
    weeklyDay?: string; // monday, tuesday, etc.
  };
  quiet_hours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

export interface UserDashboardPreferences {
  defaultDashboard?: string; // Dashboard ID to load on login
  favoriteIds: string[]; // Favorite dashboard IDs
  layout: {
    compactMode: boolean;
    showDescriptions: boolean;
    cardsPerRow?: number;
  };
  filters: {
    rememberLastUsed: boolean;
    defaultDateRange?: string; // 'today' | 'last-7-days' | etc.
    defaultSite?: string; // Site ID
  };
}

export interface UserDataEntryPreferences {
  defaultView: 'desktop' | 'mobile';
  showCalculations: boolean;
  autoAdvanceFields: boolean;
  confirmBeforeSubmit: boolean;
  saveNotesAsDraft: boolean;
  prefillYesterdayData: boolean;
}

export interface UserDisplayPreferences {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
  colorBlindMode: boolean;
  highContrastMode: boolean;
  reduceMotion: boolean;
  language: 'en' | 'es'; // English, Spanish
}

export interface UserSettings {
  userId: string;
  role: UserRole;
  siteId: string;
  jobFunctionId?: string; // For supervisors
  
  // Preferences
  notifications: UserNotificationPreferences;
  dashboard: UserDashboardPreferences;
  dataEntry: UserDataEntryPreferences;
  display: UserDisplayPreferences;
  
  // Feature opt-ins
  betaFeatures: boolean;
  usageAnalytics: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// ============================================================================
// MOCK USER SETTINGS
// ============================================================================

export const userSettings: UserSettings[] = [
  // VPs
  {
    userId: 'user-vp-michael',
    role: 'executive',
    siteId: 'DC-001', // Philadelphia (HQ)
    notifications: {
      ...DEFAULT_NOTIFICATION_PREFERENCES.executive,
      sms: {
        critical: true,
        warning: false,
        info: false,
        phoneNumber: '+1-555-0101',
        verified: true,
      },
    },
    dashboard: {
      defaultDashboard: 'system-executive-dashboard',
      favoriteIds: ['system-executive-dashboard'],
      layout: {
        compactMode: false,
        showDescriptions: true,
      },
      filters: {
        rememberLastUsed: true,
        defaultDateRange: 'last-7-days',
      },
    },
    dataEntry: {
      defaultView: 'desktop',
      showCalculations: true,
      autoAdvanceFields: true,
      confirmBeforeSubmit: true,
      saveNotesAsDraft: true,
      prefillYesterdayData: false,
    },
    display: {
      theme: 'light',
      density: 'comfortable',
      fontSize: 'medium',
      colorBlindMode: false,
      highContrastMode: false,
      reduceMotion: false,
      language: 'en',
    },
    betaFeatures: true,
    usageAnalytics: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-11-02T00:00:00Z',
    lastLoginAt: '2025-11-02T08:30:00Z',
  },
  {
    userId: 'user-vp-sarah',
    role: 'executive',
    siteId: 'DC-002', // Boston
    notifications: {
      ...DEFAULT_NOTIFICATION_PREFERENCES.executive,
      email: {
        critical: true,
        warning: true,
        info: true,
      },
      digest: {
        daily: true,
        dailyTime: '06:00',
        weekly: false,
      },
    },
    dashboard: {
      defaultDashboard: 'system-executive-dashboard',
      favoriteIds: ['system-executive-dashboard'],
      layout: {
        compactMode: true,
        showDescriptions: false,
      },
      filters: {
        rememberLastUsed: true,
        defaultDateRange: 'last-30-days',
      },
    },
    dataEntry: {
      defaultView: 'desktop',
      showCalculations: true,
      autoAdvanceFields: false,
      confirmBeforeSubmit: false,
      saveNotesAsDraft: true,
      prefillYesterdayData: false,
    },
    display: {
      theme: 'dark',
      density: 'compact',
      fontSize: 'small',
      colorBlindMode: false,
      highContrastMode: false,
      reduceMotion: false,
      language: 'en',
    },
    betaFeatures: true,
    usageAnalytics: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
    lastLoginAt: '2025-11-02T07:15:00Z',
  },
  {
    userId: 'user-vp-david',
    role: 'executive',
    siteId: 'DC-003', // Atlanta
    notifications: DEFAULT_NOTIFICATION_PREFERENCES.executive,
    dashboard: {
      defaultDashboard: 'system-executive-dashboard',
      favoriteIds: ['system-executive-dashboard'],
      layout: {
        compactMode: false,
        showDescriptions: true,
      },
      filters: {
        rememberLastUsed: true,
        defaultDateRange: 'last-7-days',
      },
    },
    dataEntry: {
      defaultView: 'desktop',
      showCalculations: true,
      autoAdvanceFields: true,
      confirmBeforeSubmit: true,
      saveNotesAsDraft: true,
      prefillYesterdayData: false,
    },
    display: {
      theme: 'system',
      density: 'comfortable',
      fontSize: 'medium',
      colorBlindMode: false,
      highContrastMode: false,
      reduceMotion: false,
      language: 'en',
    },
    betaFeatures: false,
    usageAnalytics: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-10-28T00:00:00Z',
    lastLoginAt: '2025-11-01T09:00:00Z',
  },
  
  // Site Managers
  {
    userId: 'user-sm-philly',
    role: 'site-manager',
    siteId: 'DC-001',
    notifications: {
      ...DEFAULT_NOTIFICATION_PREFERENCES['site-manager'],
      digest: {
        daily: true,
        dailyTime: '07:00',
        weekly: false,
      },
    },
    dashboard: {
      defaultDashboard: 'system-sitemanager-dashboard',
      favoriteIds: ['system-sitemanager-dashboard', 'custom-philly-operations'],
      layout: {
        compactMode: false,
        showDescriptions: true,
      },
      filters: {
        rememberLastUsed: true,
        defaultDateRange: 'last-7-days',
      },
    },
    dataEntry: {
      defaultView: 'desktop',
      showCalculations: true,
      autoAdvanceFields: true,
      confirmBeforeSubmit: true,
      saveNotesAsDraft: true,
      prefillYesterdayData: false,
    },
    display: {
      theme: 'light',
      density: 'comfortable',
      fontSize: 'medium',
      colorBlindMode: false,
      highContrastMode: false,
      reduceMotion: false,
      language: 'en',
    },
    betaFeatures: true,
    usageAnalytics: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-11-02T00:00:00Z',
    lastLoginAt: '2025-11-02T06:45:00Z',
  },
  
  // Supervisors
  {
    userId: 'user-sup-mike',
    role: 'supervisor',
    siteId: 'DC-001',
    jobFunctionId: 'receiving',
    notifications: {
      ...DEFAULT_NOTIFICATION_PREFERENCES.supervisor,
      digest: {
        daily: true,
        dailyTime: '06:00', // Before shift
        weekly: false,
      },
    },
    dashboard: {
      defaultDashboard: 'system-supervisor-dashboard',
      favoriteIds: ['system-supervisor-dashboard'],
      layout: {
        compactMode: false,
        showDescriptions: false,
      },
      filters: {
        rememberLastUsed: true,
        defaultDateRange: 'today',
      },
    },
    dataEntry: {
      defaultView: 'mobile',
      showCalculations: false,
      autoAdvanceFields: true,
      confirmBeforeSubmit: false,
      saveNotesAsDraft: true,
      prefillYesterdayData: true, // Helpful for supervisors
    },
    display: {
      theme: 'light',
      density: 'comfortable',
      fontSize: 'large', // Easier to read on mobile
      colorBlindMode: false,
      highContrastMode: false,
      reduceMotion: false,
      language: 'en',
    },
    betaFeatures: false,
    usageAnalytics: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-10-15T00:00:00Z',
    lastLoginAt: '2025-11-02T05:30:00Z',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user settings by user ID
 */
export function getUserSettings(userId: string): UserSettings | undefined {
  return userSettings.find(s => s.userId === userId);
}

/**
 * Get default settings for a role
 */
export function getDefaultSettingsForRole(role: UserRole, siteId: string, jobFunctionId?: string): UserSettings {
  return {
    userId: `temp-${Date.now()}`,
    role,
    siteId,
    jobFunctionId,
    notifications: DEFAULT_NOTIFICATION_PREFERENCES[role],
    dashboard: {
      favoriteIds: [],
      layout: {
        compactMode: false,
        showDescriptions: true,
      },
      filters: {
        rememberLastUsed: true,
      },
    },
    dataEntry: {
      defaultView: role === 'supervisor' ? 'mobile' : 'desktop',
      showCalculations: true,
      autoAdvanceFields: true,
      confirmBeforeSubmit: true,
      saveNotesAsDraft: true,
      prefillYesterdayData: role === 'supervisor',
    },
    display: {
      theme: 'light',
      density: 'comfortable',
      fontSize: role === 'supervisor' ? 'large' : 'medium',
      colorBlindMode: false,
      highContrastMode: false,
      reduceMotion: false,
      language: 'en',
    },
    betaFeatures: false,
    usageAnalytics: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update user settings
 */
export function updateUserSettings(userId: string, updates: Partial<UserSettings>): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index] = {
      ...userSettings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Update notification preferences
 */
export function updateNotificationPreferences(
  userId: string,
  preferences: Partial<UserNotificationPreferences>
): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index].notifications = {
      ...userSettings[index].notifications,
      ...preferences,
    };
    userSettings[index].updatedAt = new Date().toISOString();
  }
}

/**
 * Update dashboard preferences
 */
export function updateDashboardPreferences(
  userId: string,
  preferences: Partial<UserDashboardPreferences>
): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index].dashboard = {
      ...userSettings[index].dashboard,
      ...preferences,
    };
    userSettings[index].updatedAt = new Date().toISOString();
  }
}

/**
 * Add favorite dashboard
 */
export function addFavoriteDashboard(userId: string, dashboardId: string): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0 && !userSettings[index].dashboard.favoriteIds.includes(dashboardId)) {
    userSettings[index].dashboard.favoriteIds.push(dashboardId);
    userSettings[index].updatedAt = new Date().toISOString();
  }
}

/**
 * Remove favorite dashboard
 */
export function removeFavoriteDashboard(userId: string, dashboardId: string): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index].dashboard.favoriteIds = userSettings[index].dashboard.favoriteIds.filter(
      id => id !== dashboardId
    );
    userSettings[index].updatedAt = new Date().toISOString();
  }
}

/**
 * Set default dashboard
 */
export function setDefaultDashboard(userId: string, dashboardId: string | undefined): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index].dashboard.defaultDashboard = dashboardId;
    userSettings[index].updatedAt = new Date().toISOString();
  }
}

/**
 * Update display preferences
 */
export function updateDisplayPreferences(
  userId: string,
  preferences: Partial<UserDisplayPreferences>
): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index].display = {
      ...userSettings[index].display,
      ...preferences,
    };
    userSettings[index].updatedAt = new Date().toISOString();
  }
}

/**
 * Record user login
 */
export function recordLogin(userId: string): void {
  const index = userSettings.findIndex(s => s.userId === userId);
  if (index >= 0) {
    userSettings[index].lastLoginAt = new Date().toISOString();
  }
}

/**
 * Check if user should receive notification based on preferences
 */
export function shouldReceiveNotification(
  userId: string,
  method: NotificationMethod,
  severity: 'critical' | 'warning' | 'info'
): boolean {
  const settings = getUserSettings(userId);
  if (!settings) return false;
  
  const prefs = settings.notifications;
  
  // Check quiet hours
  if (prefs.quiet_hours.enabled) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Simple time comparison (not handling midnight crossover)
    if (currentTime >= prefs.quiet_hours.start || currentTime <= prefs.quiet_hours.end) {
      // In quiet hours - only send critical in-app notifications
      if (severity !== 'critical' || method !== 'in-app') {
        return false;
      }
    }
  }
  
  // Check method preferences
  if (method === 'in-app') {
    return prefs.inApp;
  }
  
  if (method === 'email') {
    return prefs.email[severity];
  }
  
  if (method === 'sms') {
    return prefs.sms[severity] && prefs.sms.verified;
  }
  
  return false;
}

/**
 * Get all users with a specific role
 */
export function getUsersByRole(role: UserRole): UserSettings[] {
  return userSettings.filter(s => s.role === role);
}

/**
 * Get all users at a specific site
 */
export function getUsersBySite(siteId: string): UserSettings[] {
  return userSettings.filter(s => s.siteId === siteId);
}

/**
 * Get supervisors for a job function
 */
export function getSupervisorsForJobFunction(siteId: string, jobFunctionId: string): UserSettings[] {
  return userSettings.filter(
    s => s.role === 'supervisor' && s.siteId === siteId && s.jobFunctionId === jobFunctionId
  );
}

// ============================================================================
// ROLE-BASED DEFAULT DASHBOARDS
// ============================================================================

export interface RoleDefaultDashboard {
  dashboardId: string;
  roles: UserRole[];
  setBy: string; // User ID who set this default
  setAt: string; // ISO timestamp
}

// In-memory storage for role-based defaults
let roleBasedDefaults: RoleDefaultDashboard[] = [];

/**
 * Set a dashboard as default for specific roles
 */
export function setRoleBasedDefaultDashboard(
  dashboardId: string,
  roles: UserRole[],
  setByUserId: string
): void {
  // Remove any existing defaults for these roles
  roleBasedDefaults = roleBasedDefaults.filter(
    rbd => !roles.some(role => rbd.roles.includes(role))
  );
  
  // Add new default
  if (roles.length > 0) {
    roleBasedDefaults.push({
      dashboardId,
      roles,
      setBy: setByUserId,
      setAt: new Date().toISOString(),
    });
  }
}

/**
 * Get the default dashboard for a role (if any)
 */
export function getRoleBasedDefaultDashboard(role: UserRole): string | undefined {
  const defaults = roleBasedDefaults.find(rbd => rbd.roles.includes(role));
  return defaults?.dashboardId;
}

/**
 * Remove role-based default for a dashboard
 */
export function removeRoleBasedDefaultDashboard(dashboardId: string): void {
  roleBasedDefaults = roleBasedDefaults.filter(rbd => rbd.dashboardId !== dashboardId);
}

/**
 * Get all role-based defaults
 */
export function getAllRoleBasedDefaults(): RoleDefaultDashboard[] {
  return [...roleBasedDefaults];
}

/**
 * Get which roles have a specific dashboard as default
 */
export function getRolesForDefaultDashboard(dashboardId: string): UserRole[] {
  const defaults = roleBasedDefaults.find(rbd => rbd.dashboardId === dashboardId);
  return defaults?.roles || [];
}
