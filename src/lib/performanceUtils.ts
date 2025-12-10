/**
 * Performance Utilities
 * Provides consistent color coding and thresholds across the application
 */

export interface PerformanceThresholds {
  excellent: number;  // >= 100%
  good: number;       // >= 85%
  warning: number;    // >= 75%
  critical: number;   // < 75%
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  excellent: 100,
  good: 85,
  warning: 75,
  critical: 0,
};

export type PerformanceLevel = 'excellent' | 'good' | 'warning' | 'critical';

/**
 * Determines the performance level based on a percentage value
 */
export function getPerformanceLevel(
  performance: number,
  thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
): PerformanceLevel {
  if (performance >= thresholds.excellent) return 'excellent';
  if (performance >= thresholds.good) return 'good';
  if (performance >= thresholds.warning) return 'warning';
  return 'critical';
}

/**
 * Performance color configurations for different UI contexts
 * Returns inline style objects using CSS variables
 */
export const PERFORMANCE_COLORS = {
  excellent: {
    border: '#10b981', // emerald-500
    chart: '#10b981',
    badge: {
      backgroundColor: 'rgb(209 250 229)', // emerald-100
      color: 'rgb(6 95 70)', // emerald-800
      borderColor: 'rgb(167 243 208)', // emerald-200
    },
    progress: {
      backgroundColor: 'rgb(5 150 105)', // emerald-600
    },
    icon: {
      color: 'rgb(5 150 105)', // emerald-600
    },
  },
  good: {
    border: '#3b82f6', // blue-500
    chart: '#3b82f6',
    badge: {
      backgroundColor: 'rgb(219 234 254)', // blue-100
      color: 'rgb(30 64 175)', // blue-800
      borderColor: 'rgb(191 219 254)', // blue-200
    },
    progress: {
      backgroundColor: 'rgb(37 99 235)', // blue-600
    },
    icon: {
      color: 'rgb(37 99 235)', // blue-600
    },
  },
  warning: {
    border: '#f59e0b', // amber-500
    chart: '#f59e0b',
    badge: {
      backgroundColor: 'rgb(254 243 199)', // amber-100
      color: 'rgb(146 64 14)', // amber-800
      borderColor: 'rgb(253 230 138)', // amber-200
    },
    progress: {
      backgroundColor: 'rgb(217 119 6)', // amber-600
    },
    icon: {
      color: 'rgb(217 119 6)', // amber-600
    },
  },
  critical: {
    border: '#ef4444', // red-500
    chart: '#ef4444',
    badge: {
      backgroundColor: 'rgb(254 226 226)', // red-100
      color: 'rgb(153 27 27)', // red-800
      borderColor: 'rgb(254 202 202)', // red-200
    },
    progress: {
      backgroundColor: 'rgb(220 38 38)', // red-600
    },
    icon: {
      color: 'rgb(220 38 38)', // red-600
    },
  },
} as const;

/**
 * Get color classes for a performance value
 */
export function getPerformanceColors(
  performance: number,
  thresholds?: PerformanceThresholds
) {
  const level = getPerformanceLevel(performance, thresholds);
  return PERFORMANCE_COLORS[level];
}

/**
 * Get icon name for performance level (for lucide-react)
 */
export function getPerformanceIcon(performance: number): string {
  const level = getPerformanceLevel(performance);
  switch (level) {
    case 'excellent':
      return 'CheckCircle2';
    case 'good':
      return 'CheckCircle2';
    case 'warning':
      return 'AlertTriangle';
    case 'critical':
      return 'XCircle';
  }
}

/**
 * Get human-readable performance status
 */
export function getPerformanceStatus(performance: number): string {
  const level = getPerformanceLevel(performance);
  switch (level) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'On Track';
    case 'warning':
      return 'Needs Attention';
    case 'critical':
      return 'Critical';
  }
}

/**
 * Format performance percentage for display
 */
export function formatPerformance(performance: number): string {
  return `${performance.toFixed(1)}%`;
}
