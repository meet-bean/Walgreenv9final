import { ModernDateRangePicker } from './ModernDateRangePicker';

interface AggregationOption {
  value: string;
  label: string;
}

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  aggregation?: string;
  onAggregationChange?: (value: string) => void;
  aggregationOptions?: AggregationOption[];
  aggregationLabel?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  aggregation,
  onAggregationChange,
  aggregationOptions,
  aggregationLabel = 'View:',
}: DateRangePickerProps) {
  // Convert string dates to Date objects for ModernDateRangePicker
  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;

  // Handle date changes from ModernDateRangePicker
  const handleDateChange = (start: Date | null, end: Date | null) => {
    if (start) {
      onStartDateChange(start.toISOString().split('T')[0]);
    }
    if (end) {
      onEndDateChange(end.toISOString().split('T')[0]);
    }
    // If both are cleared
    if (!start && !end) {
      const today = new Date().toISOString().split('T')[0];
      onStartDateChange(today);
      onEndDateChange(today);
    }
  };

  // Quick preset handlers
  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-wrap items-center" style={{ gap: 'var(--spacing-3)' }}>
      {/* Modern Date Range Picker */}
      <ModernDateRangePicker
        startDate={startDateObj}
        endDate={endDateObj}
        onDateChange={handleDateChange}
      />
      
      {/* Aggregation dropdown */}
      {aggregation !== undefined && onAggregationChange && aggregationOptions && (
        <div className="flex items-center flex-shrink-0" style={{ gap: 'var(--spacing-2)' }}>
          <label className="label-muted-nowrap">{aggregationLabel}</label>
          <select
            value={aggregation}
            onChange={(e) => onAggregationChange(e.target.value)}
            style={{
              padding: 'var(--spacing-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--text-label)',
              fontFamily: 'var(--font-family-inter)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          >
            {aggregationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Quick preset buttons */}
      <div className="flex flex-wrap" style={{ gap: 'var(--spacing-2)' }}>
        <button
          onClick={() => setPreset(7)}
          style={{
            padding: 'var(--spacing-2) var(--spacing-3)',
            fontSize: 'var(--text-label)',
            fontFamily: 'var(--font-family-inter)',
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setPreset(30)}
          style={{
            padding: 'var(--spacing-2) var(--spacing-3)',
            fontSize: 'var(--text-label)',
            fontFamily: 'var(--font-family-inter)',
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setPreset(90)}
          style={{
            padding: 'var(--spacing-2) var(--spacing-3)',
            fontSize: 'var(--text-label)',
            fontFamily: 'var(--font-family-inter)',
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
        >
          Last 90 Days
        </button>
      </div>
    </div>
  );
}
