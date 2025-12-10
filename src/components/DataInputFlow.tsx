import { useState, useEffect } from 'react';
import { Card } from './design-system/Card';
import { Users } from 'lucide-react';
import { DataEntryDesktop } from './blocks/DataEntryDesktop';
import { DataEntryMobile } from './blocks/DataEntryMobile';
import { useIsMobile } from '../hooks/useIsMobile';
import { 
  UserRole, 
  jobFunctions, 
  JobFunction, 
  DailyMetrics,
  dailyMetrics
} from '../lib/mockData';

interface DataInputFlowProps {
  userRole: UserRole;
  userName: string;
  siteId: string;
  jobFunctionId?: string;
}

export function DataInputFlow({ userRole, userName, siteId, jobFunctionId }: DataInputFlowProps) {
  const isMobile = useIsMobile();
  const [selectedJobFunction, setSelectedJobFunction] = useState<JobFunction | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryMethod, setEntryMethod] = useState<'desktop' | 'mobile'>(isMobile ? 'mobile' : 'desktop');

  // Get available job functions based on role
  const availableJobFunctions = userRole === 'supervisor' && jobFunctionId
    ? jobFunctions.filter(jf => jf.id === jobFunctionId)
    : jobFunctions.filter(jf => jf.siteId === siteId);

  // Auto-select first job function on mount
  useEffect(() => {
    if (availableJobFunctions.length > 0 && !selectedJobFunction) {
      setSelectedJobFunction(availableJobFunctions[0]);
    }
  }, [availableJobFunctions, selectedJobFunction]);

  // Update entry method when device type changes
  useEffect(() => {
    setEntryMethod(isMobile ? 'mobile' : 'desktop');
  }, [isMobile]);

  // Get metrics for selected job function and date
  const getMetricsForJobFunction = (jf: JobFunction): DailyMetrics[] => {
    return dailyMetrics.filter(m => 
      m.jobFunctionId === jf.id && 
      m.date === selectedDate
    );
  };

  const handleJobFunctionChange = (jf: JobFunction) => {
    setSelectedJobFunction(jf);
  };

  // Show empty state if no job functions available
  if (availableJobFunctions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardContent className="card-content-centered-vertical">
            <Users style={{ height: '48px', width: '48px', color: 'var(--muted-foreground)', margin: '0 auto var(--spacing-4)' }} />
            <p style={{ 
              fontFamily: 'var(--font-family-inter)',
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              marginBottom: 'var(--spacing-2)'
            }}>No job functions available</p>
            <p style={{ 
              fontFamily: 'var(--font-family-inter)',
              fontSize: 'var(--text-base)',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              {userRole === 'supervisor' 
                ? 'You are not assigned to any job function.'
                : 'No job functions found for this site.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while job function is being selected
  if (!selectedJobFunction) {
    return null;
  }

  const metrics = getMetricsForJobFunction(selectedJobFunction);

  // Render appropriate entry screen based on device type
  if (entryMethod === 'mobile') {
    return (
      <DataEntryMobile
        metrics={metrics}
        jobFunction={selectedJobFunction}
        supervisorName={userName}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onBack={() => {}} // No back action needed since we removed selection screen
        availableJobFunctions={availableJobFunctions}
        onJobFunctionChange={handleJobFunctionChange}
        onSwitchToDesktop={() => setEntryMethod('desktop')}
      />
    );
  }

  return (
    <DataEntryDesktop
      metrics={metrics}
      jobFunction={selectedJobFunction}
      supervisorName={userName}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      onBack={() => {}} // No back action needed since we removed selection screen
      availableJobFunctions={availableJobFunctions}
      onJobFunctionChange={handleJobFunctionChange}
      onSwitchToMobile={() => setEntryMethod('mobile')}
    />
  );
}
