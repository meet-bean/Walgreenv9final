import React, { useMemo } from 'react';
import { Card, CardTitle } from './design-system/Card';
import { FlatCard } from './design-system/FlatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './design-system/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './design-system/Select';
import { Badge } from './design-system/Badge';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Zap, DollarSign, TrendingUp, BarChart3, Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Site, JobFunction, Task, DailyMetrics } from '../lib/mockData';
import { ChartHeader } from './ChartHeader';

interface DynamicRankingsProps {
  title: string;
  description?: string;
  role: 'vp' | 'site-manager' | 'supervisor';
  currentSiteId?: string;
  currentJobFunctionId?: string;
  sites: Site[];
  jobFunctions: JobFunction[];
  tasks: Task[];
  allMetrics: DailyMetrics[];
  previousMetrics: DailyMetrics[];
}

type RankingCriteria = 'performance' | 'efficiency' | 'budget' | 'improvement' | 'consistency' | 'volume';

export const DynamicRankings: React.FC<DynamicRankingsProps> = ({
  title,
  description,
  role,
  currentSiteId,
  currentJobFunctionId,
  sites,
  jobFunctions,
  tasks,
  allMetrics,
  previousMetrics,
}) => {
  const [rankingCriteria, setRankingCriteria] = React.useState<RankingCriteria>('performance');

  // Calculate all metrics for an entity
  const calculateMetrics = (currentMetrics: DailyMetrics[], prevMetrics: DailyMetrics[]) => {
    const metricsWithPerf = currentMetrics.filter(m => m.performance !== null);
    
    // Performance metric
    const avgPerformance = metricsWithPerf.length > 0
      ? metricsWithPerf.reduce((sum, m) => sum + (m.performance || 0), 0) / metricsWithPerf.length
      : null;
    
    // Efficiency metric (expected / actual)
    const totalExpected = currentMetrics.reduce((sum, m) => sum + m.expectedHours, 0);
    const totalActual = currentMetrics.reduce((sum, m) => sum + (m.actualHours || 0), 0);
    const efficiency = totalActual > 0 ? (totalExpected / totalActual) * 100 : null;
    
    // Budget adherence
    const totalBudgeted = currentMetrics.reduce((sum, m) => sum + m.budgetedHours, 0);
    const budgetVariance = totalBudgeted > 0 ? Math.abs(totalBudgeted - totalActual) / totalBudgeted : 0;
    const budgetAdherence = totalBudgeted > 0 ? (1 - budgetVariance) * 100 : null;
    
    // Improvement rate
    const prevMetricsWithPerf = prevMetrics.filter(m => m.performance !== null);
    const prevAvgPerformance = prevMetricsWithPerf.length > 0
      ? prevMetricsWithPerf.reduce((sum, m) => sum + (m.performance || 0), 0) / prevMetricsWithPerf.length
      : null;
    const improvementRate = (avgPerformance !== null && prevAvgPerformance !== null)
      ? avgPerformance - prevAvgPerformance
      : null;
    
    // Consistency score
    let consistencyScore: number | null = null;
    if (metricsWithPerf.length > 1) {
      const perfValues = metricsWithPerf.map(m => m.performance || 0);
      const mean = perfValues.reduce((a, b) => a + b, 0) / perfValues.length;
      const variance = perfValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / perfValues.length;
      consistencyScore = Math.max(0, 100 - Math.sqrt(variance));
    } else if (metricsWithPerf.length === 1) {
      consistencyScore = 100;
    }
    
    // Volume handled
    const totalVolume = currentMetrics.reduce((sum, m) => sum + (m.actualVolume || 0), 0);
    
    // Last 7 days trend
    const last7Days = currentMetrics.slice(-7).map(m => m.performance || 0);
    
    return {
      avgPerformance,
      efficiency,
      budgetAdherence,
      improvementRate,
      consistencyScore,
      totalVolume,
      totalMetrics: currentMetrics.length,
      completedMetrics: metricsWithPerf.length,
      prevAvgPerformance,
      last7Days,
    };
  };

  // Calculate rankings based on role
  const rankings = useMemo(() => {
    if (role === 'vp') {
      // Executive: Rank sites
      return sites.map(s => {
        const siteMetrics = allMetrics.filter(m => m.siteId === s.id);
        const prevSiteMetrics = previousMetrics.filter(m => m.siteId === s.id);
        const metrics = calculateMetrics(siteMetrics, prevSiteMetrics);
        
        return {
          id: s.id,
          name: s.name,
          subtitle: s.region,
          isCurrent: s.id === currentSiteId,
          ...metrics,
        };
      });
    } else if (role === 'site-manager' && currentSiteId) {
      // Site Manager: Rank job functions at their site
      const siteJobFunctions = jobFunctions.filter(jf => jf.siteId === currentSiteId);
      return siteJobFunctions.map(jf => {
        const jfMetrics = allMetrics.filter(m => m.jobFunctionId === jf.id);
        const prevJfMetrics = previousMetrics.filter(m => m.jobFunctionId === jf.id);
        const metrics = calculateMetrics(jfMetrics, prevJfMetrics);
        
        return {
          id: jf.id,
          name: jf.name,
          subtitle: jf.supervisorName,
          isCurrent: false,
          ...metrics,
        };
      });
    } else if (role === 'supervisor' && currentJobFunctionId) {
      // Supervisor: Rank tasks in their job function
      const currentJobFunction = jobFunctions.find(jf => jf.id === currentJobFunctionId);
      if (!currentJobFunction) return [];
      
      const jobTasks = tasks.filter(t => t.jobFunctionType === currentJobFunction.type);
      return jobTasks.map(t => {
        const taskMetrics = allMetrics.filter(m => m.taskId === t.id && m.jobFunctionId === currentJobFunctionId);
        const prevTaskMetrics = previousMetrics.filter(m => m.taskId === t.id && m.jobFunctionId === currentJobFunctionId);
        const metrics = calculateMetrics(taskMetrics, prevTaskMetrics);
        
        return {
          id: t.id,
          name: t.name,
          subtitle: `${taskMetrics.length} days tracked`,
          isCurrent: false,
          ...metrics,
        };
      });
    }
    return [];
  }, [role, sites, jobFunctions, tasks, allMetrics, previousMetrics, currentSiteId, currentJobFunctionId]);

  // Sort rankings by selected criteria
  const sortedRankings = useMemo(() => {
    return rankings
      .filter(r => {
        switch(rankingCriteria) {
          case 'performance': return r.avgPerformance !== null;
          case 'efficiency': return r.efficiency !== null;
          case 'budget': return r.budgetAdherence !== null;
          case 'improvement': return r.improvementRate !== null;
          case 'consistency': return r.consistencyScore !== null;
          case 'volume': return r.totalVolume > 0;
          default: return true;
        }
      })
      .sort((a, b) => {
        switch(rankingCriteria) {
          case 'performance': return (b.avgPerformance || 0) - (a.avgPerformance || 0);
          case 'efficiency': return (b.efficiency || 0) - (a.efficiency || 0);
          case 'budget': return (b.budgetAdherence || 0) - (a.budgetAdherence || 0);
          case 'improvement': return (b.improvementRate || 0) - (a.improvementRate || 0);
          case 'consistency': return (b.consistencyScore || 0) - (a.consistencyScore || 0);
          case 'volume': return (b.totalVolume || 0) - (a.totalVolume || 0);
          default: return 0;
        }
      });
  }, [rankings, rankingCriteria]);

  // Calculate rank changes
  const previousRankings = useMemo(() => {
    return rankings
      .filter(r => r.prevAvgPerformance !== null)
      .sort((a, b) => (b.prevAvgPerformance || 0) - (a.prevAvgPerformance || 0));
  }, [rankings]);

  const getRankChange = (id: string) => {
    const currentIndex = sortedRankings.findIndex(r => r.id === id);
    const previousIndex = previousRankings.findIndex(r => r.id === id);
    
    if (currentIndex === -1 || previousIndex === -1) return 0;
    return previousIndex - currentIndex; // Positive means moved up
  };

  const getMetricValue = (rank: typeof sortedRankings[0]) => {
    switch(rankingCriteria) {
      case 'performance': return rank.avgPerformance?.toFixed(1) + '%';
      case 'efficiency': return rank.efficiency?.toFixed(1) + '%';
      case 'budget': return rank.budgetAdherence?.toFixed(1) + '%';
      case 'improvement': return (rank.improvementRate && rank.improvementRate > 0 ? '+' : '') + rank.improvementRate?.toFixed(1) + '%';
      case 'consistency': return rank.consistencyScore?.toFixed(1);
      case 'volume': return rank.totalVolume?.toLocaleString();
      default: return 'N/A';
    }
  };

  const getCriteriaIcon = () => {
    switch(rankingCriteria) {
      case 'performance': return <Target style={{ height: '16px', width: '16px' }} />;
      case 'efficiency': return <Zap style={{ height: '16px', width: '16px' }} />;
      case 'budget': return <DollarSign style={{ height: '16px', width: '16px' }} />;
      case 'improvement': return <TrendingUp style={{ height: '16px', width: '16px' }} />;
      case 'consistency': return <BarChart3 style={{ height: '16px', width: '16px' }} />;
      case 'volume': return <Activity style={{ height: '16px', width: '16px' }} />;
    }
  };

  const getEntityTypeLabel = () => {
    switch(role) {
      case 'vp': return 'Sites';
      case 'site-manager': return 'Job Functions';
      case 'supervisor': return 'Tasks';
    }
  };

  const getCriteriaLabel = () => {
    switch(rankingCriteria) {
      case 'performance': return 'Performance';
      case 'efficiency': return 'Efficiency';
      case 'budget': return 'Budget';
      case 'improvement': return 'Improvement';
      case 'consistency': return 'Consistency';
      case 'volume': return 'Volume';
    }
  };

  const getMedalColor = (index: number) => {
    if (index === 0) return { bg: '#fef3c7', color: '#92400e' };
    if (index === 1) return { bg: '#f3f4f6', color: '#374151' };
    if (index === 2) return { bg: '#fed7aa', color: '#9a3412' };
    return { bg: 'transparent', color: 'var(--foreground)' };
  };

  return (
    <FlatCard>
      <ChartHeader
        title={title}
        description={description}
        drillDownHint="Compare performance across different metrics"
        metricValue={rankingCriteria}
        onMetricChange={(value: string) => setRankingCriteria(value as RankingCriteria)}
        metricOptions={[
          { value: 'performance', label: 'Performance' },
          { value: 'efficiency', label: 'Efficiency' },
          { value: 'budget', label: 'Budget Adherence' },
          { value: 'improvement', label: 'Improvement' },
          { value: 'consistency', label: 'Consistency' },
          { value: 'volume', label: 'Volume' }
        ]}
      />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-center">Change</TableHead>
              <TableHead className="text-right">{getCriteriaLabel()}</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRankings.map((rank, index) => {
              const rankChange = getRankChange(rank.id);
              const percentile = ((sortedRankings.length - index) / sortedRankings.length) * 100;
              
              return (
                <TableRow 
                  key={rank.id}
                  className={rank.isCurrent ? 'bg-blue-50' : ''}
                  style={rank.isCurrent ? { 
                    backgroundColor: 'var(--chart-1-light)',
                    borderLeft: '3px solid var(--chart-1)'
                  } : {}}
                >
                  {/* Rank */}
                  <TableCell>
                    <span style={{
                      fontWeight: 'var(--font-weight-semibold)',
                      fontFamily: 'var(--font-family-inter)',
                      fontSize: 'var(--text-base)'
                    }}>
                      {index + 1}
                    </span>
                  </TableCell>
                  
                  {/* Name */}
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <span style={{ 
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-family-inter)',
                        fontSize: 'var(--text-sm)'
                      }}>
                        {rank.name}
                      </span>
                      {rank.isCurrent && (
                        <Badge variant="outline" style={{ 
                          backgroundColor: 'var(--chart-1)',
                          color: 'white',
                          borderColor: 'var(--chart-1)',
                          fontSize: 'var(--text-xs)'
                        }}>
                          You
                        </Badge>
                      )}
                      {percentile >= 75 && (
                        <Badge variant="outline" style={{ 
                          backgroundColor: 'var(--success-light)', 
                          color: 'var(--chart-2)', 
                          borderColor: 'var(--chart-2)',
                          fontSize: 'var(--text-xs)'
                        }}>
                          Top {Math.round(100 - percentile)}%
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Details */}
                  <TableCell>
                    <span style={{ 
                      fontSize: 'var(--text-sm)',
                      color: 'var(--muted-foreground)',
                      fontFamily: 'var(--font-family-inter)'
                    }}>
                      {rank.subtitle}
                    </span>
                  </TableCell>
                  
                  {/* Change */}
                  <TableCell className="text-center">
                    {rankChange !== 0 && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-1)',
                        fontSize: 'var(--text-sm)',
                        padding: '2px var(--spacing-2)',
                        borderRadius: '9999px',
                        backgroundColor: rankChange > 0 ? 'var(--success-light)' : 'var(--error-light)',
                        color: rankChange > 0 ? 'var(--chart-2)' : 'var(--destructive)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        {rankChange > 0 ? (
                          <ArrowUp style={{ height: '14px', width: '14px' }} />
                        ) : (
                          <ArrowDown style={{ height: '14px', width: '14px' }} />
                        )}
                        <span>{Math.abs(rankChange)}</span>
                      </div>
                    )}
                    {rankChange === 0 && rank.prevAvgPerformance !== null && (
                      <Minus style={{ 
                        height: '14px', 
                        width: '14px', 
                        color: 'var(--muted-foreground)',
                        opacity: 0.5
                      }} />
                    )}
                  </TableCell>
                  
                  {/* Metric Value */}
                  <TableCell className="text-right">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                      {getCriteriaIcon()}
                      <span style={{ 
                        fontSize: 'var(--text-sm)', 
                        fontWeight: 'var(--font-weight-semibold)',
                        fontFamily: 'var(--font-family-inter)'
                      }}>
                        {getMetricValue(rank)}
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* Trend */}
                  <TableCell className="text-right">
                    {rank.last7Days.length > 1 && rankingCriteria === 'performance' ? (
                      <div style={{ height: '24px', width: '60px', marginLeft: 'auto' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={rank.last7Days.map((val, i) => ({ value: val }))}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={rank.isCurrent ? '#3b82f6' : '#94a3b8'} 
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--muted-foreground)' }}>—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {sortedRankings.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-8)',
            color: 'var(--muted-foreground)',
            fontFamily: 'var(--font-family-inter)'
          }}>
            <p>No ranking data available for {getEntityTypeLabel()}</p>
          </div>
        )}
      </div>
    </FlatCard>
  );
};