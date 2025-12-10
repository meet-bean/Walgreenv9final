// Machine Learning Engine for Supply Chain Performance Management
// Provides forecasting, anomaly detection, pattern recognition, and recommendations

import { DailyMetrics, Site, JobFunction, Task } from './mockData';

// ===== Type Definitions =====

export interface MLPrediction {
  id: string;
  metric: string;
  type: 'forecast' | 'anomaly' | 'threshold' | 'trend' | 'seasonal';
  severity: 'critical' | 'warning' | 'info';
  confidence: number;
  currentValue: number;
  predictedValue: number;
  predictedDate: string;
  message: string;
  recommendation?: string;
  impact?: {
    cost?: number;
    hours?: number;
    volume?: number;
  };
  rootCauses?: string[];
  modelUsed: string;
}

export interface AnomalyDetection {
  id: string;
  siteId: string;
  siteName: string;
  metric: string;
  date: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  deviationPercent: number;
  severity: 'critical' | 'warning' | 'info';
  confidence: number;
  possibleCauses: string[];
}

export interface TrendAnalysis {
  metric: string;
  siteId: string;
  siteName: string;
  trendType: 'improving' | 'declining' | 'stable' | 'volatile';
  currentValue: number;
  changeRate: number; // % change per week
  consistency: number; // 0-100, how consistent the trend is
  projectedValue: number;
  projectionDate: string;
  confidence: number;
}

export interface PatternRecognition {
  patternType: 'seasonal' | 'day-of-week' | 'time-of-day' | 'cyclic' | 'correlation';
  description: string;
  strength: number; // 0-100
  confidence: number;
  affectedMetrics: string[];
  recommendation: string;
  historicalEvidence: {
    occurrences: number;
    consistency: number;
  };
}

export interface MLRecommendation {
  id: string;
  type: 'staffing' | 'process' | 'equipment' | 'training' | 'scheduling';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedSites: string[];
  expectedImpact: {
    performanceImprovement: number; // %
    costSavings?: number;
    hoursReduced?: number;
    roi?: number;
    timeToRealize: string;
  };
  implementationComplexity: 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string[];
  similarSuccesses?: {
    siteId: string;
    improvement: number;
  }[];
}

export interface ForecastResult {
  metric: string;
  date: string;
  predictedValue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  confidence: number;
  modelType: 'arima' | 'exponential-smoothing' | 'prophet' | 'ml-ensemble';
}

// ===== Core ML Engine =====

export class MLEngine {
  // Time Series Forecasting using exponential smoothing
  static forecast(
    historicalData: number[],
    periodsAhead: number = 7,
    alpha: number = 0.3 // Smoothing parameter
  ): ForecastResult[] {
    if (historicalData.length < 7) {
      throw new Error('Insufficient historical data for forecasting');
    }

    const forecasts: ForecastResult[] = [];
    
    // Calculate trend and seasonality
    const trend = this.calculateTrend(historicalData);
    const seasonalFactors = this.calculateSeasonalFactors(historicalData, 7);
    
    // Exponential smoothing with trend and seasonality
    let lastValue = historicalData[historicalData.length - 1];
    let lastTrend = trend;
    
    for (let i = 1; i <= periodsAhead; i++) {
      const seasonalIndex = (historicalData.length + i - 1) % 7;
      const seasonal = seasonalFactors[seasonalIndex];
      
      // Holt-Winters multiplicative model
      const forecast = (lastValue + i * lastTrend) * seasonal;
      
      // Calculate confidence interval (wider for further predictions)
      const stdDev = this.calculateStdDev(historicalData);
      const confidenceMultiplier = 1.96 * Math.sqrt(i); // 95% confidence
      
      const today = new Date();
      today.setDate(today.getDate() + i);
      
      // Confidence decreases with prediction distance
      const confidence = Math.max(60, 95 - i * 2);
      
      forecasts.push({
        metric: 'performance',
        date: today.toISOString().split('T')[0],
        predictedValue: Math.max(0, forecast),
        confidenceInterval: {
          lower: Math.max(0, forecast - stdDev * confidenceMultiplier),
          upper: Math.min(100, forecast + stdDev * confidenceMultiplier),
        },
        confidence,
        modelType: 'exponential-smoothing',
      });
    }
    
    return forecasts;
  }

  // Anomaly Detection using statistical methods
  static detectAnomalies(
    historicalData: number[],
    currentValue: number,
    sensitivity: 'low' | 'medium' | 'high' = 'medium'
  ): { isAnomaly: boolean; severity: string; confidence: number; zScore: number } {
    const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    const stdDev = this.calculateStdDev(historicalData);
    
    // Z-score calculation
    const zScore = Math.abs((currentValue - mean) / stdDev);
    
    // Threshold based on sensitivity
    const thresholds = {
      low: { warning: 2.5, critical: 3.5 },
      medium: { warning: 2.0, critical: 3.0 },
      high: { warning: 1.5, critical: 2.5 },
    };
    
    const threshold = thresholds[sensitivity];
    
    let severity = 'info';
    let isAnomaly = false;
    
    if (zScore >= threshold.critical) {
      severity = 'critical';
      isAnomaly = true;
    } else if (zScore >= threshold.warning) {
      severity = 'warning';
      isAnomaly = true;
    }
    
    // Confidence based on how far from threshold
    const confidence = Math.min(95, Math.floor((zScore / threshold.critical) * 95));
    
    return { isAnomaly, severity, confidence, zScore };
  }

  // Trend Analysis
  static analyzeTrend(
    historicalData: number[],
    windowSize: number = 7
  ): {
    trendType: 'improving' | 'declining' | 'stable' | 'volatile';
    changeRate: number;
    consistency: number;
  } {
    if (historicalData.length < windowSize * 2) {
      return { trendType: 'stable', changeRate: 0, consistency: 0 };
    }

    // Calculate moving averages
    const recent = historicalData.slice(-windowSize);
    const previous = historicalData.slice(-windowSize * 2, -windowSize);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    const changeRate = ((recentAvg - previousAvg) / previousAvg) * 100;
    
    // Calculate consistency (lower variance = higher consistency)
    const variance = this.calculateVariance(recent);
    const consistency = Math.max(0, 100 - variance * 2);
    
    // Determine trend type
    let trendType: 'improving' | 'declining' | 'stable' | 'volatile' = 'stable';
    
    if (consistency < 30) {
      trendType = 'volatile';
    } else if (Math.abs(changeRate) < 0.5) {
      trendType = 'stable';
    } else if (changeRate > 0) {
      trendType = 'improving';
    } else {
      trendType = 'declining';
    }
    
    return { trendType, changeRate, consistency };
  }

  // Pattern Recognition
  static recognizePatterns(
    data: { date: string; value: number }[],
    patternType: 'seasonal' | 'day-of-week' | 'cyclic'
  ): PatternRecognition | null {
    if (data.length < 28) return null; // Need at least 4 weeks

    switch (patternType) {
      case 'day-of-week':
        return this.detectDayOfWeekPattern(data);
      case 'seasonal':
        return this.detectSeasonalPattern(data);
      case 'cyclic':
        return this.detectCyclicPattern(data);
      default:
        return null;
    }
  }

  // Root Cause Analysis
  static analyzeRootCauses(
    performance: number,
    volume: number,
    hours: number,
    expectedPerformance: number,
    historicalData: {
      avgVolume: number;
      avgHours: number;
      avgPerformance: number;
    }
  ): string[] {
    const causes: string[] = [];
    
    const volumeVariance = ((volume - historicalData.avgVolume) / historicalData.avgVolume) * 100;
    const hoursVariance = ((hours - historicalData.avgHours) / historicalData.avgHours) * 100;
    const performanceGap = expectedPerformance - performance;
    
    // Volume-related causes
    if (volumeVariance > 15) {
      causes.push(`Volume spike of ${volumeVariance.toFixed(1)}% above normal may be overwhelming capacity`);
    } else if (volumeVariance < -15) {
      causes.push(`Volume drop of ${Math.abs(volumeVariance).toFixed(1)}% could indicate upstream issues`);
    }
    
    // Hours-related causes
    if (hoursVariance > 20 && performanceGap > 0) {
      causes.push(`Hours worked ${hoursVariance.toFixed(1)}% above normal suggests inefficiency`);
    } else if (hoursVariance < -10 && performanceGap > 0) {
      causes.push(`Insufficient hours (${Math.abs(hoursVariance).toFixed(1)}% below normal) - understaffing likely`);
    }
    
    // Performance-specific causes
    if (performanceGap > 5) {
      const efficiency = (volume / hours);
      const expectedEfficiency = (volume / (hours * (performance / expectedPerformance)));
      
      if (efficiency < expectedEfficiency * 0.9) {
        causes.push('Lower than expected productivity per hour worked');
      }
    }
    
    // Correlation analysis
    if (volumeVariance > 10 && hoursVariance < 5) {
      causes.push('Volume increased without proportional staffing adjustment');
    }
    
    if (causes.length === 0) {
      causes.push('Multiple minor factors likely contributing - requires detailed operational review');
    }
    
    return causes;
  }

  // Generate ML-Powered Recommendations
  static generateRecommendations(
    siteId: string,
    siteName: string,
    performance: number,
    trend: TrendAnalysis,
    anomalies: AnomalyDetection[]
  ): MLRecommendation[] {
    const recommendations: MLRecommendation[] = [];
    
    // Performance-based recommendations
    if (performance < 95 && trend.trendType === 'declining') {
      recommendations.push({
        id: `rec-${siteId}-staffing`,
        type: 'staffing',
        priority: performance < 90 ? 'critical' : 'high',
        title: 'Staffing Optimization Required',
        description: `${siteName} showing ${Math.abs(trend.changeRate).toFixed(1)}% weekly decline. Analysis suggests staffing adjustments during peak hours.`,
        affectedSites: [siteId],
        expectedImpact: {
          performanceImprovement: Math.min(5, 100 - performance) * 0.7,
          costSavings: 15000,
          roi: 180,
          timeToRealize: '2-3 weeks',
        },
        implementationComplexity: 'medium',
        confidence: 78,
        reasoning: [
          'Historical data shows correlation between staffing levels and performance',
          'Similar interventions at other sites yielded 3-4% improvements',
          'Peak hour analysis reveals consistent capacity gaps',
        ],
        similarSuccesses: [
          { siteId: 'DC-002', improvement: 3.5 },
          { siteId: 'DC-005', improvement: 4.2 },
        ],
      });
    }
    
    // Anomaly-based recommendations
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
    if (criticalAnomalies.length > 2) {
      recommendations.push({
        id: `rec-${siteId}-process`,
        type: 'process',
        priority: 'critical',
        title: 'Process Review Needed',
        description: `Multiple critical anomalies detected at ${siteName}. Systematic process issues likely present.`,
        affectedSites: [siteId],
        expectedImpact: {
          performanceImprovement: 6,
          hoursReduced: 120,
          timeToRealize: '4-6 weeks',
        },
        implementationComplexity: 'high',
        confidence: 85,
        reasoning: [
          `${criticalAnomalies.length} critical anomalies in recent period`,
          'Pattern suggests systematic rather than random issues',
          'Process audit recommended to identify bottlenecks',
        ],
      });
    }
    
    // Best practice sharing
    if (performance > 101 && trend.trendType === 'improving') {
      recommendations.push({
        id: `rec-${siteId}-share`,
        type: 'process',
        priority: 'medium',
        title: 'Share Best Practices',
        description: `${siteName} consistently exceeding targets. Best practices should be documented and shared.`,
        affectedSites: [siteId],
        expectedImpact: {
          performanceImprovement: 0,
          costSavings: 50000,
          timeToRealize: '6-8 weeks',
        },
        implementationComplexity: 'low',
        confidence: 92,
        reasoning: [
          'Sustained high performance indicates effective processes',
          'Sharing best practices can lift other sites by 2-3%',
          'Low implementation risk with high potential value',
        ],
      });
    }
    
    return recommendations;
  }

  // ===== Helper Methods =====

  private static calculateTrend(data: number[]): number {
    const n = data.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((acc, y, x) => acc + (x + 1) * y, 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private static calculateSeasonalFactors(data: number[], period: number): number[] {
    const factors: number[] = new Array(period).fill(0);
    const counts: number[] = new Array(period).fill(0);
    
    // Calculate average for each position in the cycle
    const overallMean = data.reduce((a, b) => a + b, 0) / data.length;
    
    data.forEach((value, index) => {
      const seasonalIndex = index % period;
      factors[seasonalIndex] += value;
      counts[seasonalIndex]++;
    });
    
    // Normalize to get seasonal factors
    return factors.map((sum, i) => 
      counts[i] > 0 ? (sum / counts[i]) / overallMean : 1.0
    );
  }

  private static calculateStdDev(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  private static calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  }

  private static detectDayOfWeekPattern(
    data: { date: string; value: number }[]
  ): PatternRecognition {
    const dayAverages: number[] = new Array(7).fill(0);
    const dayCounts: number[] = new Array(7).fill(0);
    
    data.forEach(item => {
      const dayOfWeek = new Date(item.date).getDay();
      dayAverages[dayOfWeek] += item.value;
      dayCounts[dayOfWeek]++;
    });
    
    const averages = dayAverages.map((sum, i) => 
      dayCounts[i] > 0 ? sum / dayCounts[i] : 0
    );
    
    const overallAvg = averages.reduce((a, b) => a + b, 0) / 7;
    const variance = averages.reduce((acc, val) => 
      acc + Math.pow(val - overallAvg, 2), 0
    ) / 7;
    
    const strength = Math.min(100, (Math.sqrt(variance) / overallAvg) * 100);
    
    // Find patterns
    const weekendAvg = (averages[0] + averages[6]) / 2;
    const weekdayAvg = averages.slice(1, 6).reduce((a, b) => a + b, 0) / 5;
    const weekendDrop = ((weekdayAvg - weekendAvg) / weekdayAvg) * 100;
    
    return {
      patternType: 'day-of-week',
      description: weekendDrop > 10 
        ? `Weekend performance ${weekendDrop.toFixed(0)}% lower than weekdays`
        : 'Relatively consistent performance across all days',
      strength,
      confidence: 82,
      affectedMetrics: ['volume', 'performance'],
      recommendation: weekendDrop > 15
        ? 'Consider adjusted staffing models for weekends'
        : 'Current day-of-week staffing appears appropriate',
      historicalEvidence: {
        occurrences: data.length,
        consistency: 100 - strength,
      },
    };
  }

  private static detectSeasonalPattern(
    data: { date: string; value: number }[]
  ): PatternRecognition {
    // Look for monthly patterns
    const monthlyData: { [key: string]: number[] } = {};
    
    data.forEach(item => {
      const month = new Date(item.date).getMonth();
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(item.value);
    });
    
    const monthlyAverages = Object.entries(monthlyData).map(([month, values]) => ({
      month: parseInt(month),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    }));
    
    const overallAvg = monthlyAverages.reduce((sum, m) => sum + m.avg, 0) / monthlyAverages.length;
    const maxDeviation = monthlyAverages.reduce((max, m) => 
      Math.max(max, Math.abs(m.avg - overallAvg) / overallAvg * 100), 0
    );
    
    return {
      patternType: 'seasonal',
      description: maxDeviation > 10
        ? `Seasonal variation up to ${maxDeviation.toFixed(0)}% detected`
        : 'Minimal seasonal variation observed',
      strength: Math.min(100, maxDeviation * 5),
      confidence: 75,
      affectedMetrics: ['volume', 'staffing'],
      recommendation: maxDeviation > 15
        ? 'Implement seasonal staffing adjustments 2-3 weeks in advance'
        : 'Current staffing model handles seasonal variation well',
      historicalEvidence: {
        occurrences: monthlyAverages.length,
        consistency: 100 - maxDeviation,
      },
    };
  }

  private static detectCyclicPattern(
    data: { date: string; value: number }[]
  ): PatternRecognition {
    // Simple autocorrelation to detect cycles
    const values = data.map(d => d.value);
    const correlations: number[] = [];
    
    for (let lag = 1; lag <= Math.min(30, values.length / 3); lag++) {
      correlations.push(this.autocorrelation(values, lag));
    }
    
    // Find peaks in correlation
    const peaks = correlations.map((corr, i) => ({ lag: i + 1, corr }))
      .filter((item, i, arr) => 
        i > 0 && i < arr.length - 1 &&
        item.corr > arr[i - 1].corr &&
        item.corr > arr[i + 1].corr &&
        item.corr > 0.3
      );
    
    const strongestPeak = peaks.sort((a, b) => b.corr - a.corr)[0];
    
    return {
      patternType: 'cyclic',
      description: strongestPeak
        ? `${strongestPeak.lag}-day cycle detected with ${(strongestPeak.corr * 100).toFixed(0)}% correlation`
        : 'No significant cyclic patterns detected',
      strength: strongestPeak ? Math.min(100, strongestPeak.corr * 120) : 0,
      confidence: strongestPeak ? 70 : 50,
      affectedMetrics: ['performance'],
      recommendation: strongestPeak
        ? `Monitor and plan around ${strongestPeak.lag}-day performance cycles`
        : 'Continue regular monitoring',
      historicalEvidence: {
        occurrences: peaks.length,
        consistency: strongestPeak ? strongestPeak.corr * 100 : 0,
      },
    };
  }

  private static autocorrelation(data: number[], lag: number): number {
    const n = data.length - lag;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (data[i] - mean) * (data[i + lag] - mean);
    }
    
    for (let i = 0; i < data.length; i++) {
      denominator += Math.pow(data[i] - mean, 2);
    }
    
    return numerator / denominator;
  }
}

// ===== Prediction Interface Types (for existing mockData compatibility) =====

export interface Prediction {
  id: string;
  type: 'trend' | 'anomaly' | 'threshold';
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  message: string;
  currentValue: number;
  predictedValue: number;
  predictedDate: string;
  confidence: number;
  recommendation?: string;
}

// ===== ML-Powered Mock Data Generator =====

export function generateMLPredictions(
  historicalMetrics: DailyMetrics[],
  sites: Site[]
): Prediction[] {
  const predictions: Prediction[] = [];
  
  // Group metrics by site and job function
  const siteMetrics: { [key: string]: number[] } = {};
  
  historicalMetrics.slice(-30).forEach(metric => {
    const key = `${metric.siteId}-${metric.jobFunctionId}`;
    if (!siteMetrics[key]) siteMetrics[key] = [];
    if (metric.performance) siteMetrics[key].push(metric.performance);
  });
  
  // Generate predictions for each site/function
  Object.entries(siteMetrics).forEach(([key, performances], index) => {
    if (performances.length < 7) return;
    
    const [siteId, jobFunctionId] = key.split('-');
    const site = sites.find(s => s.id === siteId);
    if (!site) return;
    
    const currentValue = performances[performances.length - 1];
    const trend = MLEngine.analyzeTrend(performances, 7);
    const anomaly = MLEngine.detectAnomalies(performances, currentValue, 'medium');
    
    // Forecast next week
    const forecasts = MLEngine.forecast(performances, 7);
    const nextWeekForecast = forecasts[6];
    
    // Generate prediction based on trend and forecast
    if (trend.trendType === 'declining' && nextWeekForecast.predictedValue < 95) {
      predictions.push({
        id: `pred-${index}`,
        type: 'trend',
        severity: nextWeekForecast.predictedValue < 90 ? 'critical' : 'warning',
        metric: `${site.name} - ${jobFunctionId.split('-')[0]}`,
        message: `Performance trending downward at ${Math.abs(trend.changeRate).toFixed(1)}% per week. Predicted to reach ${nextWeekForecast.predictedValue.toFixed(1)}% by ${new Date(nextWeekForecast.date).toLocaleDateString()}.`,
        currentValue,
        predictedValue: nextWeekForecast.predictedValue,
        predictedDate: nextWeekForecast.date,
        confidence: nextWeekForecast.confidence,
        recommendation: 'Review staffing levels and identify process bottlenecks. Consider implementing best practices from higher-performing sites.',
      });
    }
    
    // Anomaly detection
    if (anomaly.isAnomaly && index % 3 === 0) {
      predictions.push({
        id: `pred-anomaly-${index}`,
        type: 'anomaly',
        severity: anomaly.severity as 'critical' | 'warning' | 'info',
        metric: `${site.name} - ${jobFunctionId.split('-')[0]}`,
        message: `Unusual performance pattern detected. Current value ${currentValue.toFixed(1)}% deviates ${anomaly.zScore.toFixed(1)} standard deviations from normal.`,
        currentValue,
        predictedValue: currentValue,
        predictedDate: new Date().toISOString().split('T')[0],
        confidence: anomaly.confidence,
        recommendation: 'Investigate recent operational changes, equipment issues, or staffing changes that may explain the deviation.',
      });
    }
  });
  
  return predictions.slice(0, 8); // Return top 8 predictions
}
