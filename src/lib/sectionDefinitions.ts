import { DashboardSectionType } from './mockData';

// ============================================
// SAVED REPORT SECTIONS (User-Created)
// ============================================

export interface SavedReportSection {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'financial' | 'operations' | 'strategic';
  createdBy: string;
  createdAt: string;
  lastModified: string;
  version: number;
  
  // Layout definition
  layout: {
    columns: number; // grid columns (e.g., 12)
    rows: number; // grid rows
  };
  
  // Tiles in this section
  tiles: SavedReportTile[];
  
  // Metadata (no role restrictions - sections are universal templates)
  recommendedFor?: ('executive' | 'site-manager' | 'supervisor')[]; // Optional hint, not enforced
  usageCount: number;
  tags: string[];
  thumbnail?: string; // base64 preview image
}

export interface SavedReportTile {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'metric';
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  
  // Grid position
  position: {
    x: number; // column start
    y: number; // row start
    w: number; // width in columns
    h: number; // height in rows
  };
  
  // Tile configuration
  config: {
    title: string;
    // Data source configuration
    dataSource: 'none' | 'system' | 'custom' | 'both';
    systemMetric?: string;
    aggregation?: 'avg' | 'sum' | 'min' | 'max';
    customData?: any; // CustomDataConfig from Report Builder
    dataPriority?: 'system' | 'custom';
    
    // Type-specific configs
    kpiConfig?: {
      showComparison: boolean;
      showTrend: boolean;
      comparisonType: 'previous-period' | 'target';
      thresholds?: { good: number; warning: number };
    };
    timeSeriesConfig?: {
      timePeriod: '7d' | '30d' | '90d' | 'ytd' | 'all';
      multipleMetrics?: string[];
      showTarget: boolean;
      smoothing?: boolean;
      showDataPoints?: boolean;
      fillOpacity?: number;
    };
    barConfig?: {
      groupBy: 'sites' | 'departments' | 'weeks' | 'months';
      orientation: 'vertical' | 'horizontal';
      showValues: boolean;
      chartStyle: 'grouped' | 'stacked';
    };
    pieConfig?: {
      groupBy: 'sites' | 'categories' | 'status';
      showPercentages: boolean;
      showLabels: boolean;
      legendPosition: 'right' | 'bottom' | 'none';
      pieStyle: 'donut' | 'solid';
    };
    tableConfig?: {
      selectedColumns: string[];
      sortBy?: string;
      sortOrder: 'asc' | 'desc';
      rowsPerPage: 10 | 25 | 50 | 100;
      showTotals: boolean;
    };
  };
}

// Version history for sections
export interface SectionVersion {
  versionId: string;
  sectionId: string;
  version: number;
  timestamp: string;
  modifiedBy: string;
  changeDescription: string;
  sectionSnapshot: SavedReportSection;
}

// Helper functions
export function saveSectionToLibrary(section: SavedReportSection): void {
  const saved = localStorage.getItem('savedReportSections');
  let sections: SavedReportSection[] = [];
  
  try {
    sections = saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse saved sections, clearing corrupted data:', error);
    localStorage.removeItem('savedReportSections');
  }
  
  // Check if updating existing section
  const existingIndex = sections.findIndex(s => s.id === section.id);
  if (existingIndex >= 0) {
    // Save version history
    const oldSection = sections[existingIndex];
    saveSectionVersion(oldSection, 'Manual save');
    
    // Update section with new version number
    sections[existingIndex] = { ...section, version: section.version + 1 };
  } else {
    // New section
    sections.push(section);
  }
  
  try {
    localStorage.setItem('savedReportSections', JSON.stringify(sections));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some saved sections.');
    }
    throw error;
  }
}

export function getSavedSections(): SavedReportSection[] {
  const saved = localStorage.getItem('savedReportSections');
  if (!saved) return [];
  
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to parse saved sections, clearing corrupted data:', error);
    localStorage.removeItem('savedReportSections');
    return [];
  }
}

export function getSectionById(id: string): SavedReportSection | undefined {
  const sections = getSavedSections();
  return sections.find(s => s.id === id);
}

export function deleteSavedSection(id: string): void {
  const sections = getSavedSections();
  const filtered = sections.filter(s => s.id !== id);
  localStorage.setItem('savedReportSections', JSON.stringify(filtered));
}

export function incrementSectionUsage(id: string): void {
  const sections = getSavedSections();
  const section = sections.find(s => s.id === id);
  if (section) {
    section.usageCount++;
    localStorage.setItem('savedReportSections', JSON.stringify(sections));
  }
}

// Version history functions
export function saveSectionVersion(section: SavedReportSection, changeDescription: string): void {
  const saved = localStorage.getItem('sectionVersionHistory');
  let history: SectionVersion[] = [];
  
  try {
    history = saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse version history, clearing corrupted data:', error);
    localStorage.removeItem('sectionVersionHistory');
  }
  
  const version: SectionVersion = {
    versionId: `${section.id}-v${section.version}-${Date.now()}`,
    sectionId: section.id,
    version: section.version,
    timestamp: new Date().toISOString(),
    modifiedBy: section.createdBy, // Would be current user in real app
    changeDescription,
    sectionSnapshot: { ...section },
  };
  
  history.push(version);
  
  // Keep last 10 versions per section
  const sectionHistory = history.filter(v => v.sectionId === section.id);
  if (sectionHistory.length > 10) {
    const toRemove = sectionHistory.slice(0, sectionHistory.length - 10);
    const filtered = history.filter(v => !toRemove.includes(v));
    try {
      localStorage.setItem('sectionVersionHistory', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to save version history:', error);
    }
  } else {
    try {
      localStorage.setItem('sectionVersionHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save version history:', error);
    }
  }
}

export function getSectionVersionHistory(sectionId: string): SectionVersion[] {
  const saved = localStorage.getItem('sectionVersionHistory');
  if (!saved) return [];
  
  try {
    const history: SectionVersion[] = JSON.parse(saved);
    return history.filter(v => v.sectionId === sectionId).sort((a, b) => b.version - a.version);
  } catch (error) {
    console.error('Failed to parse version history, clearing corrupted data:', error);
    localStorage.removeItem('sectionVersionHistory');
    return [];
  }
}

export function restoreSectionVersion(versionId: string): void {
  const history = localStorage.getItem('sectionVersionHistory');
  if (!history) return;
  
  const versions: SectionVersion[] = JSON.parse(history);
  const version = versions.find(v => v.versionId === versionId);
  
  if (version) {
    // Restore this version as current
    const restored = { ...version.sectionSnapshot, lastModified: new Date().toISOString() };
    saveSectionToLibrary(restored);
  }
}

// ============================================
// SYSTEM SECTION DEFINITIONS (Pre-built)
// ============================================

// Enhanced Section Definition with all new properties
export interface SectionDefinition {
  id: string;
  type: DashboardSectionType;
  label: string;
  description: string;
  icon: string;
  recommendedFor: string[];
  kpis?: string[];
  hierarchyMode: 'static' | 'dynamic';
  dynamicConfig?: {
    vp: {
      groupBy: 'sites';
      showMetrics: string[];
      drillDownTo: 'site-manager';
    };
    siteManager: {
      groupBy: 'job-functions' | 'supervisors';
      showMetrics: string[];
      drillDownTo: 'supervisor' | 'job-function';
    };
    supervisor: {
      groupBy: 'job-functions' | 'tasks';
      showMetrics: string[];
      drillDownTo: 'task';
    };
  };
  // New properties for enhanced features
  category: 'performance' | 'financial' | 'operations' | 'strategic';
  tags: string[];
  usageCount?: number;
  lastUpdated?: string;
  performanceImpact?: 'light' | 'medium' | 'heavy';
  dependencies?: string[];
  pairedWith?: string[];
  worksBestWith?: string[];
  dataRequirements?: string[];
  calculationFormulas?: Record<string, string>;
  useCase?: string;
  whenToUse?: string;
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    id: 'overview-tiles',
    type: 'top-tasks',
    label: 'Overview Tiles',
    description: 'Smart hierarchy tiles that adapt by role - shows Sites for VPs, Job Functions for Site Managers, and Tasks for Supervisors',
    icon: 'Trophy',
    recommendedFor: ['Executive', 'Site Manager', 'Supervisor'],
    category: 'performance',
    tags: ['overview', 'kpi', 'tiles', 'hierarchy'],
    usageCount: 156,
    lastUpdated: '2025-10-15',
    performanceImpact: 'light',
    dependencies: [],
    pairedWith: ['performance-trend', 'site-kpis'],
    worksBestWith: ['Performance Trend', 'KPI Cards'],
    dataRequirements: ['Daily performance metrics', 'User role context'],
    calculationFormulas: {
      'Performance': '(Actual Volume / Expected Volume) × 100',
      'Total Hours': 'Sum of actual hours for all entities',
      'Active Staff': 'Count of unique staff IDs with activity'
    },
    useCase: 'Quick at-a-glance view of top performers across your organization',
    whenToUse: 'Use as the first section on executive dashboards for immediate performance insights',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['performance', 'totalHours', 'activeStaff'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'totalHours', 'efficiency'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'actualVolume', 'actualHours'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'site-kpis',
    type: 'kpi-cards',
    label: 'KPI Cards',
    description: 'Configurable metric cards - add 1-12 cards with custom or system data sources. Auto-layout based on card count.',
    icon: 'BarChart3',
    recommendedFor: ['Executive', 'Site Manager', 'Supervisor'],
    category: 'performance',
    tags: ['kpi', 'metrics', 'cards', 'summary', 'configurable'],
    usageCount: 143,
    lastUpdated: '2025-11-07',
    performanceImpact: 'light',
    dependencies: [],
    pairedWith: ['overview-tiles', 'performance-trend'],
    worksBestWith: ['Overview Tiles', 'Budget Tracking'],
    dataRequirements: ['Configured card data sources'],
    calculationFormulas: {
      'Performance %': 'Average performance across all entities',
      'Total Hours': 'Sum of actual hours',
      'Efficiency': '(Expected Hours / Actual Hours) × 100'
    },
    useCase: 'Display 1-12 customizable metric cards with flexible data sources',
    whenToUse: 'Perfect for dashboards that need to highlight key metrics with full control over what shows',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['avgPerformance', 'totalHours', 'sitesActive', 'efficiency'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'totalHours', 'jobFunctionsActive', 'efficiency'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'tasks',
        showMetrics: ['performance', 'actualHours', 'tasksActive', 'efficiency'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'performance-trend',
    type: 'trend-chart',
    label: 'Performance Trend',
    description: 'Performance trend over time with role-based drill-down - VP sees all sites, Site Manager sees their job functions, Supervisor sees their tasks',
    icon: 'TrendingUp',
    recommendedFor: ['Executive', 'Site Manager', 'Supervisor'],
    category: 'performance',
    tags: ['trend', 'chart', 'time-series', 'analytics'],
    usageCount: 189,
    lastUpdated: '2025-11-01',
    performanceImpact: 'medium',
    dependencies: [],
    pairedWith: ['overview-tiles', 'site-kpis'],
    worksBestWith: ['Overview Tiles', 'Hierarchical Performance Table'],
    dataRequirements: ['Historical daily metrics', 'Date range selection'],
    calculationFormulas: {
      'Trend Line': '7-day moving average of performance',
      'Performance': 'Daily (Actual / Expected) × 100'
    },
    useCase: 'Identify performance trends and patterns over time',
    whenToUse: 'Essential for understanding if performance is improving or declining',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['performance', 'trend'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'trend'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'trend'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'hierarchical-performance',
    type: 'hierarchical-performance',
    label: 'Hierarchical Performance Table',
    description: 'Collapsible performance hierarchy - VP sees regions→sites→job functions→tasks. Find root causes by drilling down from underperforming sites to specific tasks',
    icon: 'FolderTree',
    recommendedFor: ['Executive', 'Site Manager', 'Supervisor'],
    category: 'operations',
    tags: ['table', 'hierarchy', 'drill-down', 'detailed'],
    usageCount: 98,
    lastUpdated: '2025-10-28',
    performanceImpact: 'heavy',
    dependencies: [],
    pairedWith: ['performance-trend', 'rankings'],
    worksBestWith: ['Performance Trend', 'Rankings'],
    dataRequirements: ['Complete hierarchy data', 'Performance at all levels'],
    calculationFormulas: {
      'Parent Performance': 'Weighted average of children performance',
      'Rank': 'Sorted by performance descending'
    },
    useCase: 'Deep dive into performance issues to find root causes',
    whenToUse: 'When you need to troubleshoot underperformance or explore detailed breakdowns',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['performance', 'hours', 'rank', 'expand'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'hours', 'tasks', 'expand'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'tasks',
        showMetrics: ['performance', 'volume', 'hours'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'hours-chart',
    type: 'hours-chart',
    label: 'Hours Chart',
    description: 'Expected vs actual hours - adapts to show site-level, job function-level, or task-level data',
    icon: 'Clock',
    recommendedFor: ['Site Manager', 'Supervisor'],
    category: 'operations',
    tags: ['hours', 'chart', 'comparison', 'efficiency'],
    usageCount: 112,
    lastUpdated: '2025-10-18',
    performanceImpact: 'medium',
    dependencies: [],
    pairedWith: ['budget-tracking', 'site-kpis'],
    worksBestWith: ['Budget Tracking', 'Performance Trend'],
    dataRequirements: ['Expected hours', 'Actual hours', 'Entity breakdown'],
    calculationFormulas: {
      'Variance': 'Actual Hours - Expected Hours',
      'Efficiency': '(Expected / Actual) × 100'
    },
    useCase: 'Track labor efficiency and identify over/under-staffed areas',
    whenToUse: 'Critical for operations managers monitoring labor costs',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['expectedHours', 'actualHours', 'variance'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['expectedHours', 'actualHours', 'variance'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'tasks',
        showMetrics: ['expectedHours', 'actualHours', 'variance'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'rankings',
    type: 'rankings',
    label: 'Rankings',
    description: 'Site and job function rankings - VP sees sites, Site Manager sees job functions',
    icon: 'Award',
    recommendedFor: ['Site Manager'],
    category: 'performance',
    tags: ['rankings', 'leaderboard', 'comparison', 'competition'],
    usageCount: 87,
    lastUpdated: '2025-10-12',
    performanceImpact: 'light',
    dependencies: [],
    pairedWith: ['performance-trend', 'hierarchical-performance'],
    worksBestWith: ['Performance Trend', 'Overview Tiles'],
    dataRequirements: ['Performance scores', 'Entity names'],
    calculationFormulas: {
      'Rank': 'Sorted by performance score',
      'Movement': 'Change in rank from previous period'
    },
    useCase: 'Create healthy competition and recognize top performers',
    whenToUse: 'Great for team dashboards to motivate performance improvement',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['performance', 'rank'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'rank'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'job-functions',
        showMetrics: ['performance', 'rank'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'budget-tracking',
    type: 'budget-tracking',
    label: 'Budget Tracking',
    description: 'Budgeted vs expected vs actual hours - adapts by role to show site-level, job function-level, or task-level budget data',
    icon: 'DollarSign',
    recommendedFor: ['Executive', 'Site Manager', 'Supervisor'],
    category: 'financial',
    tags: ['budget', 'financial', 'variance', 'tracking'],
    usageCount: 134,
    lastUpdated: '2025-11-03',
    performanceImpact: 'medium',
    dependencies: [],
    pairedWith: ['hours-chart', 'site-kpis'],
    worksBestWith: ['Hours Chart', 'KPI Cards'],
    dataRequirements: ['Budget data', 'Expected hours', 'Actual hours'],
    calculationFormulas: {
      'Budget Variance': 'Budgeted - Actual',
      'Budget %': '(Actual / Budgeted) × 100'
    },
    useCase: 'Monitor budget compliance and identify cost overruns',
    whenToUse: 'Essential for financial planning and cost control dashboards',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['budgeted', 'expected', 'actual', 'variance'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['budgeted', 'expected', 'actual', 'variance'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'tasks',
        showMetrics: ['budgeted', 'expected', 'actual', 'variance'],
        drillDownTo: 'task',
      },
    },
  },
  {
    id: 'site-map',
    type: 'site-map',
    label: 'Site Performance Map',
    description: 'Geographic visualization of site performance - color-coded markers show which sites are on target. Select metric: Performance or Budget Variance. VP only.',
    icon: 'Map',
    recommendedFor: ['Executive'],
    category: 'strategic',
    tags: ['map', 'geographic', 'visualization', 'executive'],
    usageCount: 45,
    lastUpdated: '2025-10-05',
    performanceImpact: 'light',
    dependencies: [],
    pairedWith: ['overview-tiles', 'hierarchical-performance'],
    worksBestWith: ['Overview Tiles', 'Rankings'],
    dataRequirements: ['Site locations', 'Performance by site'],
    calculationFormulas: {
      'Color Coding': 'Green (≥90%), Yellow (75-89%), Red (<75%)'
    },
    useCase: 'Geographic overview of performance across all locations',
    whenToUse: 'Perfect for multi-site organizations to see regional patterns',
    hierarchyMode: 'static',
  },
  {
    id: 'task-distribution-pie',
    type: 'task-distribution-pie' as any,
    label: 'Task Distribution (Pie Chart)',
    description: 'Visual breakdown of hours distribution - VP sees sites, Site Manager sees job functions, Supervisor sees tasks. Top 8 items shown as pie slices.',
    icon: 'PieChart',
    recommendedFor: ['Executive', 'Site Manager', 'Supervisor'],
    category: 'performance',
    tags: ['chart', 'pie', 'distribution', 'breakdown', 'visual'],
    usageCount: 67,
    lastUpdated: '2025-11-12',
    performanceImpact: 'light',
    dependencies: [],
    pairedWith: ['hours-chart', 'site-kpis'],
    worksBestWith: ['Hours Chart', 'KPI Cards'],
    dataRequirements: ['Actual hours by entity'],
    calculationFormulas: {
      'Percentage': '(Entity Hours / Total Hours) × 100'
    },
    useCase: 'Show proportional distribution of work across sites, job functions, or tasks',
    whenToUse: 'Perfect for understanding where time is being spent at a glance',
    hierarchyMode: 'dynamic',
    dynamicConfig: {
      vp: {
        groupBy: 'sites',
        showMetrics: ['actualHours', 'percentage'],
        drillDownTo: 'site-manager',
      },
      siteManager: {
        groupBy: 'job-functions',
        showMetrics: ['actualHours', 'percentage'],
        drillDownTo: 'supervisor',
      },
      supervisor: {
        groupBy: 'tasks',
        showMetrics: ['actualHours', 'percentage'],
        drillDownTo: 'task',
      },
    },
  },
];