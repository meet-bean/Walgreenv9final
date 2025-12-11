/**
 * ACME INC. SUPPLY CHAIN PERFORMANCE MANAGEMENT SYSTEM
 * COMPREHENSIVE SYSTEM CONFIGURATION
 * 
 * This file contains all system-wide configuration settings based on
 * the recommended rollout strategy and best practices.
 */

import { UserRole, AlertSeverity, NotificationMethod, NotificationFrequency } from './mockData';

// ============================================================================
// SYSTEM INFORMATION
// ============================================================================

export const SYSTEM_CONFIG = {
  name: 'Acme Inc. Supply Chain Performance Management',
  version: '1.0.0',
  environment: 'production', // 'development' | 'staging' | 'production'
  timezone: 'America/New_York', // Eastern Time (Philadelphia HQ)
  currentPhase: 'full-rollout', // 'vp-pilot' | 'site-manager-pilot' | 'supervisor-pilot' | 'full-rollout' | 'optimization'
} as const;

// ============================================================================
// ROLE-BASED FEATURE ACCESS MATRIX
// ============================================================================

export const FEATURE_ACCESS = {
  viewPublishedDashboards: {
    vp: { enabled: true, scope: 'all-sites' },
    'site-manager': { enabled: true, scope: 'own-site' },
    supervisor: { enabled: true, scope: 'own-function' },
  },
  createDashboards: {
    vp: { enabled: true },
    'site-manager': { enabled: true },
    supervisor: { enabled: false },
  },
  editSystemDashboards: {
    vp: { enabled: true },
    'site-manager': { enabled: false },
    supervisor: { enabled: false },
  },
  publishDashboards: {
    vp: { enabled: true, scope: 'all-sites' },
    'site-manager': { enabled: true, scope: 'own-site-only' },
    supervisor: { enabled: false },
  },
  promoteDashboards: {
    vp: { enabled: true, canPromote: true },
    'site-manager': { enabled: true, canPromote: false, canRequest: true },
    supervisor: { enabled: false },
  },
  grantDataInputPermissions: {
    vp: { enabled: true },
    'site-manager': { enabled: false },
    supervisor: { enabled: false },
  },
  enterData: {
    vp: { enabled: true, requiresPermission: false }, // Override capability
    'site-manager': { enabled: true, requiresPermission: true },
    supervisor: { enabled: true, requiresPermission: true },
  },
  manageAlerts: {
    vp: { enabled: true, canCreate: true, canEdit: true, canDelete: true },
    'site-manager': { enabled: true, canCreate: false, canEdit: false, canDelete: false, canRequest: true },
    supervisor: { enabled: true, canCreate: false, canEdit: false, canDelete: false },
  },
  acknowledgeAlerts: {
    vp: { enabled: true },
    'site-manager': { enabled: true },
    supervisor: { enabled: true },
  },
  exportReports: {
    vp: { enabled: true, scope: 'all-sites' },
    'site-manager': { enabled: true, scope: 'own-site' },
    supervisor: { enabled: true, scope: 'own-function' },
  },
  accessDataSource: {
    vp: { enabled: true },
    'site-manager': { enabled: false },
    supervisor: { enabled: false },
  },
  managePermissions: {
    vp: { enabled: true, canModify: true },
    'site-manager': { enabled: true, canModify: false, viewOnly: true },
    supervisor: { enabled: true, canModify: false, viewOnly: true },
  },
} as const;

// ============================================================================
// HISTORICAL DATA & DATE RANGE SETTINGS
// ============================================================================

export const DATE_RANGE_CONFIG = {
  dataRetention: {
    liveData: 0, // Current day
    editableWithSupervisor: 7, // Last 7 days
    editableWithSiteManager: 30, // Last 30 days
    editableWithVP: 90, // Last 90 days
    readOnlyArchive: 180, // 90+ days
  },
  maxDateRangeByRole: {
    vp: 180, // days
    'site-manager': 90, // days
    supervisor: 30, // days
  },
  defaultDateRange: {
    executive: 7, // Last 7 days
    'site-manager': 7, // Last 7 days
    supervisor: 0, // Today only
  },
  quickRanges: {
    vp: ['today', 'yesterday', 'last-7-days', 'last-30-days', 'last-90-days', 'custom'],
    'site-manager': ['today', 'yesterday', 'last-7-days', 'last-30-days', 'custom'],
    supervisor: ['today', 'yesterday', 'this-week', 'custom'],
  },
  comparisonModes: {
    executive: ['previous-period', 'week-over-week', 'month-over-month'],
    'site-manager': ['day-over-day', 'week-over-week'],
    supervisor: ['yesterday'],
  },
} as const;

// ============================================================================
// DASHBOARD CONFIGURATION
// ============================================================================

export const DASHBOARD_CONFIG = {
  autoRefresh: {
    executive: 5 * 60 * 1000, // 5 minutes in milliseconds
    'site-manager': 10 * 60 * 1000, // 10 minutes
    supervisor: 15 * 60 * 1000, // 15 minutes
    dataEntryForm: 30 * 1000, // 30 seconds (draft save)
    alertsPanel: 2 * 60 * 1000, // 2 minutes
    reportsPage: 0, // Manual refresh only
  },
  layout: {
    executive: {
      columns: 4,
      enableDrillDown: true,
      showAlerts: true,
      alertSeverityFilter: ['critical'], // Only show critical alerts
    },
    'site-manager': {
      columns: 3,
      enableDrillDown: true,
      showAlerts: true,
      alertSeverityFilter: ['critical', 'warning'],
    },
    supervisor: {
      columns: 2,
      enableDrillDown: false,
      showAlerts: true,
      alertSeverityFilter: ['critical', 'warning'],
    },
  },
  publishing: {
    executive: {
      canPublishTo: ['executive', 'site-manager', 'supervisor'] as UserRole[],
      canPublishToSites: 'all',
      defaultOrder: 10,
      requiresApproval: false,
    },
    'site-manager': {
      canPublishTo: ['site-manager', 'supervisor'] as UserRole[],
      canPublishToSites: 'own-site-only',
      defaultOrder: 100,
      requiresApproval: false,
    },
  },
  promotion: {
    approvalRequired: true,
    minTestingPeriod: 14, // days
    approvers: ['executive'] as UserRole[],
    postPromotionNotifications: true,
  },
  systemDashboards: {
    canUnpublish: false, // System dashboards can only be deactivated
    changeNotifications: true,
    versionHistory: 90, // days
    requireChangeDescription: true,
  },
} as const;

// ============================================================================
// DATA INPUT CONFIGURATION
// ============================================================================

export const DATA_INPUT_CONFIG = {
  defaultPermissions: {
    supervisor: {
      granted: true,
      allSites: true,
      expires: null,
      notes: 'Default system permission for supervisors',
    },
    'site-manager': {
      granted: false,
      requiresVPApproval: true,
    },
    vp: {
      granted: true, // Override capability
      implicit: true,
    },
  },
  submissionRules: {
    allowPartialSubmission: false, // Must complete all tasks
    requireNotesWhen: {
      enabled: true,
      varianceThreshold: 30, // Require notes if >30% variance
    },
    duplicatePrevention: true,
    editWindow: 24, // hours - can edit within 24 hours
    editAfterWindowRequires: 'vp-approval',
  },
  validation: {
    hardStops: {
      negativeValues: true,
      nullRequiredFields: true,
      futureDates: true,
      duplicateDates: true,
      logicalErrors: true, // e.g., Volume=0 but Hours>0
    },
    warnings: {
      performanceOutliers: {
        enabled: true,
        minThreshold: 50, // %
        maxThreshold: 150, // %
      },
      volumeVariance: {
        enabled: true,
        threshold: 50, // % from forecast
      },
      hoursVariance: {
        enabled: true,
        threshold: 200, // % of expected
      },
      weekendEntryOnWeekday: true,
      lateEntry: {
        enabled: true,
        threshold: 3, // days
      },
    },
  },
  desktop: {
    layout: 'grid', // Show all tasks in grid
    autoSave: 30 * 1000, // 30 seconds
    validationTiming: 'real-time',
  },
  mobile: {
    layout: 'cards', // Single task cards (swipe)
    autoSave: 'after-each-task',
    offlineMode: true,
    photoAttachment: true,
    voiceNotes: true,
    hapticFeedback: true,
  },
} as const;

// ============================================================================
// ALERT CONFIGURATION
// ============================================================================

export const ALERT_CONFIG = {
  defaultRules: [
    {
      id: 'default-critical-performance',
      name: 'Critical Performance Drop',
      enabled: true,
      threshold: 90,
      metric: 'performance' as const,
      condition: 'below' as const,
      scope: 'task' as const,
      severity: 'critical' as AlertSeverity,
      recipients: ['executive', 'site-manager'] as UserRole[],
      methods: ['in-app', 'email'] as NotificationMethod[],
      frequency: 'immediate' as NotificationFrequency,
    },
    {
      id: 'default-site-warning',
      name: 'Site Performance Warning',
      enabled: true,
      threshold: 96,
      metric: 'performance' as const,
      condition: 'below' as const,
      scope: 'site' as const,
      severity: 'warning' as AlertSeverity,
      recipients: ['executive', 'site-manager'] as UserRole[],
      methods: ['in-app'] as NotificationMethod[],
      frequency: 'immediate' as NotificationFrequency,
    },
  ],
  creation: {
    allowedRoles: ['executive'] as UserRole[],
    requestProcess: {
      enabled: true,
      requestors: ['site-manager', 'supervisor'] as UserRole[],
      approvers: ['executive'] as UserRole[],
    },
  },
  delivery: {
    inApp: {
      alwaysEnabled: true,
      canDisable: false,
    },
    email: {
      optIn: true,
      defaultEnabled: {
        vp: ['critical'],
        'site-manager': ['critical'],
        supervisor: [],
      },
    },
    sms: {
      optIn: true,
      requiresVerification: true,
      defaultEnabled: {
        vp: [],
        'site-manager': [],
        supervisor: [],
      },
    },
    digest: {
      daily: {
        enabled: true,
        time: '07:00', // 7am ET
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        includeSeverities: ['warning', 'info'],
      },
      weekly: {
        enabled: true,
        day: 'monday',
        time: '08:00', // 8am ET
        includeSeverities: ['info'],
      },
    },
  },
  thresholds: {
    critical: 90, // % performance
    warning: 95, // % performance
    info: 105, // % performance (excellence)
  },
  fatiguePrevention: {
    maxPerUserPerDay: {
      critical: 10,
      warning: 20,
      info: 50,
    },
    suppressDuplicates: {
      enabled: true,
      windowHours: 4,
    },
    autoResolve: {
      enabled: true,
      condition: 'next-data-entry-fixes',
    },
    monthlyReview: {
      enabled: true,
      reviewer: 'executive',
    },
  },
  sla: {
    critical: {
      acknowledgeWithin: 15, // minutes
      resolveWithin: 120, // minutes (2 hours)
      escalateAfter: 30, // minutes if unacknowledged
    },
    warning: {
      acknowledgeWithin: 60, // minutes
      resolveWithin: 1440, // minutes (24 hours)
      escalateAfter: 1440, // minutes
    },
    info: {
      acknowledgeWithin: null, // Optional
      resolveWithin: 10080, // minutes (1 week)
      escalateAfter: null,
    },
  },
} as const;

// ============================================================================
// NOTIFICATION PREFERENCES (User-Configurable)
// ============================================================================

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  vp: {
    inApp: true,
    email: {
      critical: true,
      warning: true,
      info: false,
    },
    sms: {
      critical: false, // opt-in
      warning: false,
      info: false,
    },
    digest: {
      daily: false,
      weekly: true,
    },
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  },
  'site-manager': {
    inApp: true,
    email: {
      critical: true,
      warning: false,
      info: false,
    },
    sms: {
      critical: false,
      warning: false,
      info: false,
    },
    digest: {
      daily: true,
      weekly: false,
    },
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  },
  supervisor: {
    inApp: true,
    email: {
      critical: false,
      warning: false,
      info: false,
    },
    sms: {
      critical: false,
      warning: false,
      info: false,
    },
    digest: {
      daily: true,
      weekly: false,
    },
    quiet_hours: {
      enabled: true,
      start: '18:00', // After shift
      end: '06:00', // Before shift
    },
  },
} as const;

// ============================================================================
// MOBILE & RESPONSIVE CONFIGURATION
// ============================================================================

export const RESPONSIVE_CONFIG = {
  breakpoints: {
    mobile: 768, // px
    tablet: 1024, // px
    desktop: 1920, // px
  },
  mobile: {
    navigation: 'bottom-tabs',
    dashboard: {
      columns: 1,
      tilesStacked: true,
      tablesScrollHorizontal: true,
      chartsSimplified: true,
    },
    dataEntry: {
      layout: 'cards',
      swipeNavigation: true,
      touchTargetSize: 44, // px (minimum)
      hapticFeedback: true,
    },
    offline: {
      enabled: true,
      syncOnConnection: true,
      conflictResolution: 'server-wins',
      showStatus: true,
    },
    camera: {
      enabled: true,
      photoCompression: true,
      maxFileSize: 5, // MB
    },
  },
  tablet: {
    navigation: 'side-rail-collapsible',
    dashboard: {
      columns: 2,
    },
    dataEntry: {
      layout: 'hybrid',
    },
  },
  desktop: {
    navigation: 'header-tabs',
    dashboard: {
      columns: 4,
    },
    dataEntry: {
      layout: 'spreadsheet',
    },
  },
} as const;

// ============================================================================
// PERFORMANCE & OPTIMIZATION
// ============================================================================

export const PERFORMANCE_CONFIG = {
  caching: {
    dashboardData: 5 * 60, // 5 minutes
    staticData: 60 * 60, // 1 hour (sites, job functions, tasks)
    userPreferences: 15 * 60, // 15 minutes
  },
  pagination: {
    defaultPageSize: 50,
    maxPageSize: 200,
  },
  queryLimits: {
    maxDateRange: 180, // days
    maxRecordsReturned: 10000,
  },
  lazyLoading: {
    enabled: true,
    threshold: 100, // records
  },
} as const;

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

export const FORMAT_CONFIG = {
  performance: {
    decimals: 1,
    suffix: '%',
    locale: 'en-US',
  },
  volume: {
    decimals: 0,
    useGrouping: true, // Comma separators
    locale: 'en-US',
  },
  hours: {
    decimals: 1,
    useGrouping: true,
    locale: 'en-US',
  },
  currency: {
    decimals: 2,
    currency: 'USD',
    locale: 'en-US',
  },
  date: {
    short: 'MMM d, yyyy', // Nov 2, 2025
    long: 'MMMM d, yyyy', // November 2, 2025
    dateTime: 'MMM d, yyyy h:mm a', // Nov 2, 2025 2:30 PM
  },
  time: {
    format: '12h', // '12h' | '24h'
    locale: 'en-US',
  },
} as const;

// ============================================================================
// BRANDING & THEME
// ============================================================================

export const THEME_CONFIG = {
  colors: {
    performance: {
      critical: '#DC2626', // Red (0-89%)
      warning: '#F59E0B', // Amber (90-94%)
      caution: '#FCD34D', // Yellow (95-99%)
      good: '#10B981', // Green (100-104%)
      excellent: '#059669', // Dark Green (105%+)
    },
    brand: {
      primary: '#0052CC', // Brand Blue
      secondary: '#E31837', // Brand Red
      accent: '#F59E0B', // Alert Amber
    },
  },
  accessibility: {
    wcagLevel: 'AA', // WCAG 2.1 Level AA compliance
    highContrastMode: true,
    colorblindFriendly: true, // Use patterns + colors
    focusIndicators: true,
    keyboardNavigation: true,
  },
} as const;

// ============================================================================
// SECURITY & AUTHENTICATION
// ============================================================================

export const SECURITY_CONFIG = {
  session: {
    timeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    warningBefore: 5 * 60 * 1000, // 5 minutes warning
    extendOnActivity: true,
  },
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    expirationDays: 90,
    preventReuse: 5, // Last 5 passwords
    lockoutAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
  },
  mfa: {
    required: {
      vp: true,
      'site-manager': false,
      supervisor: false,
    },
    methods: ['totp', 'sms', 'email'],
  },
  audit: {
    logDataModifications: true,
    logPermissionChanges: true,
    logDashboardPublications: true,
    logAlertChanges: true,
    logAuthentication: true,
    retentionDays: 365,
  },
} as const;

// ============================================================================
// BACKUP & RECOVERY
// ============================================================================

export const BACKUP_CONFIG = {
  schedule: {
    realtime: true, // Database replication
    incremental: 60, // minutes
    full: 'daily', // midnight ET
    offsite: 'weekly',
  },
  retention: {
    incremental: 7, // days
    daily: 30, // days
    weekly: 90, // days
    monthly: 365, // days
  },
  recovery: {
    rpo: 60, // minutes (Recovery Point Objective)
    rto: 240, // minutes (Recovery Time Objective - 4 hours)
    pointInTimeRecovery: 24, // hours
  },
} as const;

// ============================================================================
// MONITORING & HEALTH CHECKS
// ============================================================================

export const MONITORING_CONFIG = {
  healthChecks: {
    interval: 60, // seconds
    endpoints: [
      '/api/health',
      '/api/database',
      '/api/cache',
    ],
  },
  alerts: {
    apiResponseTime: {
      warning: 2000, // ms
      critical: 5000, // ms
    },
    databaseCpu: {
      warning: 70, // %
      critical: 90, // %
    },
    diskSpace: {
      warning: 20, // % free
      critical: 10, // % free
    },
    errorRate: {
      warning: 1, // %
      critical: 5, // %
    },
    uptime: {
      target: 99.9, // %
    },
  },
  logging: {
    level: 'info', // 'debug' | 'info' | 'warn' | 'error'
    retention: 90, // days
    includeStackTraces: true,
  },
} as const;

// ============================================================================
// ROLLOUT PHASES
// ============================================================================

export const ROLLOUT_CONFIG = {
  phases: {
    'vp-pilot': {
      duration: 14, // days
      participants: {
        vp: ['all'],
        'site-manager': [],
        supervisor: [],
      },
      features: {
        viewDashboards: true,
        createDashboards: true,
        publishDashboards: false,
        dataInput: true,
        alerts: false,
        permissions: false,
      },
      successCriteria: {
        dailyLogins: 100, // %
        criticalBugs: 0,
        dataAccuracy: 100, // % match with Excel
      },
    },
    'site-manager-pilot': {
      duration: 14, // days
      participants: {
        vp: ['all'],
        'site-manager': ['DC-001', 'DC-002'], // Boston + Philadelphia
        supervisor: [],
      },
      features: {
        viewDashboards: true,
        createDashboards: true,
        publishDashboards: true,
        dataInput: true,
        alerts: false,
        permissions: true,
      },
      successCriteria: {
        customDashboardsCreated: 1,
        noDataLeakage: true,
        positiveFeedback: 80, // %
      },
    },
    'supervisor-pilot': {
      duration: 14, // days
      participants: {
        vp: ['all'],
        'site-manager': ['DC-001', 'DC-002'],
        supervisor: ['DC-001', 'DC-002'], // All supervisors at pilot sites
      },
      features: {
        viewDashboards: true,
        createDashboards: true,
        publishDashboards: true,
        dataInput: true,
        alerts: true,
        permissions: true,
      },
      successCriteria: {
        dataEntryCompletion: 90, // %
        preferenceOverExcel: 80, // %
        avgEntryTime: 5, // minutes
      },
    },
    'full-rollout': {
      duration: 14, // days
      participants: {
        vp: ['all'],
        'site-manager': ['all'],
        supervisor: ['all'],
      },
      features: {
        viewDashboards: true,
        createDashboards: true,
        publishDashboards: true,
        dataInput: true,
        alerts: true,
        permissions: true,
      },
      successCriteria: {
        weeklyActiveUsers: 95, // %
        dataEntryCompletion: 95, // %
        supportTicketsPerDay: 10,
        noOutages: true,
      },
    },
    optimization: {
      duration: 30, // days
      activities: [
        'analyze-usage-data',
        'optimize-queries',
        'refine-alert-thresholds',
        'sunset-unused-dashboards',
        'promote-best-dashboards',
        'advanced-training',
        'feature-requests-prioritization',
      ],
    },
  },
  currentPhase: 'full-rollout',
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  offlineMode: true,
  exportToPDF: false, // Future feature
  exportToExcel: false, // Future feature
  bulkDataUpload: false, // Future feature
  comments: false, // Future feature
  scheduledReports: false, // Future feature
  forecasting: false, // Future feature
  mobileApp: false, // Future feature (native)
  shiftScheduling: false, // Future feature
  employeePerformance: false, // Future feature
  rootCauseAnalysis: false, // Future feature
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get feature access for a specific role and feature
 */
export function hasFeatureAccess(role: UserRole, feature: keyof typeof FEATURE_ACCESS): boolean {
  const access = FEATURE_ACCESS[feature]?.[role];
  return access ? access.enabled : false;
}

/**
 * Get max date range for a role
 */
export function getMaxDateRange(role: UserRole): number {
  return DATE_RANGE_CONFIG.maxDateRangeByRole[role] || 30;
}

/**
 * Get auto-refresh interval for a role
 */
export function getAutoRefreshInterval(role: UserRole): number {
  return DASHBOARD_CONFIG.autoRefresh[role] || 15 * 60 * 1000; // Default 15 min
}

/**
 * Get default notification preferences for a role
 */
export function getDefaultNotificationPreferences(role: UserRole) {
  return DEFAULT_NOTIFICATION_PREFERENCES[role];
}

/**
 * Check if currently in rollout phase
 */
export function isInPhase(phase: keyof typeof ROLLOUT_CONFIG.phases): boolean {
  return ROLLOUT_CONFIG.currentPhase === phase;
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Format performance value
 */
export function formatPerformance(value: number): string {
  return `${value.toFixed(FORMAT_CONFIG.performance.decimals)}${FORMAT_CONFIG.performance.suffix}`;
}

/**
 * Format volume value
 */
export function formatVolume(value: number): string {
  return value.toLocaleString(FORMAT_CONFIG.volume.locale, {
    minimumFractionDigits: FORMAT_CONFIG.volume.decimals,
    maximumFractionDigits: FORMAT_CONFIG.volume.decimals,
    useGrouping: FORMAT_CONFIG.volume.useGrouping,
  });
}

/**
 * Format hours value
 */
export function formatHours(value: number): string {
  return value.toLocaleString(FORMAT_CONFIG.hours.locale, {
    minimumFractionDigits: FORMAT_CONFIG.hours.decimals,
    maximumFractionDigits: FORMAT_CONFIG.hours.decimals,
    useGrouping: FORMAT_CONFIG.hours.useGrouping,
  });
}

/**
 * Get performance color based on value
 */
export function getPerformanceColor(performance: number): string {
  if (performance < 90) return THEME_CONFIG.colors.performance.critical;
  if (performance < 95) return THEME_CONFIG.colors.performance.warning;
  if (performance < 100) return THEME_CONFIG.colors.performance.caution;
  if (performance <= 104) return THEME_CONFIG.colors.performance.good;
  return THEME_CONFIG.colors.performance.excellent;
}

/**
 * Get performance label based on value
 */
export function getPerformanceLabel(performance: number): string {
  if (performance < 90) return 'Critical';
  if (performance < 95) return 'Warning';
  if (performance < 100) return 'Caution';
  if (performance <= 104) return 'Good';
  return 'Excellent';
}

/**
 * Check if user can edit data within date range
 */
export function canEditData(role: UserRole, daysAgo: number): boolean {
  const retention = DATE_RANGE_CONFIG.dataRetention;
  
  if (role === 'executive') return daysAgo <= retention.editableWithVP;
  if (role === 'site-manager') return daysAgo <= retention.editableWithSiteManager;
  if (role === 'supervisor') return daysAgo <= retention.editableWithSupervisor;
  
  return false;
}