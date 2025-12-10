import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './design-system/Popover';
import { Button } from './design-system/Button';

interface ModernDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

export function ModernDateRangePicker({ startDate, endDate, onDateChange }: ModernDateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select date range';
    const format = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    return `${format(startDate)} - ${format(endDate)}`;
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(null, null);
  };

  const handleClear = () => {
    onDateChange(null, null);
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      onDateChange(date, null);
    } else {
      // Complete the range
      if (date < startDate) {
        onDateChange(date, startDate);
      } else {
        onDateChange(startDate, date);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate && hoveredDate) {
      const rangeStart = startDate < hoveredDate ? startDate : hoveredDate;
      const rangeEnd = startDate < hoveredDate ? hoveredDate : startDate;
      return date >= rangeStart && date <= rangeEnd;
    }
    if (endDate) {
      return date >= startDate && date <= endDate;
    }
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!startDate) return false;
    const sameAsStart = date.toDateString() === startDate.toDateString();
    const sameAsEnd = endDate && date.toDateString() === endDate.toDateString();
    return sameAsStart || sameAsEnd;
  };

  const renderMonth = (monthOffset: number) => {
    const displayMonth = new Date(currentMonth);
    displayMonth.setMonth(currentMonth.getMonth() + monthOffset);

    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const monthName = displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return (
      <div key={monthOffset}>
        <div style={{ 
          fontFamily: 'var(--font-family-inter)',
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-weight-semibold)',
          marginBottom: 'var(--spacing-4)',
          textAlign: 'center',
        }}>
          {monthName}
        </div>
        
        {/* Day headers */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--spacing-1)',
          marginBottom: 'var(--spacing-2)',
        }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div 
              key={day} 
              style={{ 
                fontFamily: 'var(--font-family-inter)',
                fontSize: 'var(--text-label)',
                color: 'var(--muted-foreground)',
                textAlign: 'center',
                padding: 'var(--spacing-2)',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--spacing-1)',
        }}>
          {days.map(({ date, isCurrentMonth }, i) => {
            const inRange = isDateInRange(date);
            const selected = isDateSelected(date);
            
            return (
              <button
                key={i}
                onClick={() => isCurrentMonth && handleDateClick(date)}
                onMouseEnter={() => isCurrentMonth && setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={!isCurrentMonth}
                style={{
                  fontFamily: 'var(--font-family-inter)',
                  fontSize: 'var(--text-label)',
                  color: !isCurrentMonth ? 'var(--muted-foreground)' : 
                         selected ? 'white' : 
                         inRange ? 'var(--primary)' : 
                         'var(--foreground)',
                  backgroundColor: selected ? 'var(--primary)' : 
                                  inRange ? 'rgba(255, 105, 105, 0.1)' : 
                                  'transparent',
                  border: 'none',
                  borderRadius: selected ? 'var(--radius)' : '0',
                  padding: 'var(--spacing-2)',
                  cursor: isCurrentMonth ? 'pointer' : 'default',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                  minWidth: '32px',
                  minHeight: '32px',
                }}
                onMouseOver={(e) => {
                  if (isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = selected ? 'var(--primary)' : 'var(--muted)';
                  }
                }}
                onMouseOut={(e) => {
                  if (isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = selected ? 'var(--primary)' : inRange ? 'rgba(255, 105, 105, 0.1)' : 'transparent';
                  }
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-2) var(--spacing-4)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            borderColor: 'var(--border)',
            backgroundColor: 'var(--background)',
            fontFamily: 'var(--font-family-inter)',
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <Calendar className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ color: 'var(--foreground)' }}>{formatDateRange()}</span>
          {(startDate || endDate) && (
            <span 
              onClick={handleReset}
              style={{ 
                color: 'var(--muted-foreground)',
                fontSize: 'var(--text-label)',
                cursor: 'pointer',
                marginLeft: 'var(--spacing-2)',
              }}
            >
              Reset
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start"
        style={{
          width: 'auto',
          padding: 0,
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--elevation-sm)',
        }}
      >
        <div style={{ padding: 'var(--spacing-6)', minWidth: '600px' }}>
          <h3 style={{
            fontFamily: 'var(--font-family-inter)',
            fontSize: 'var(--text-h4)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-6)',
            color: 'var(--foreground)',
          }}>
            Select Date Range
          </h3>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-4)',
          }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={previousMonth}
              style={{
                borderRadius: 'var(--radius)',
                flexShrink: 0,
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-8)',
            }}>
              {renderMonth(0)}
              {renderMonth(1)}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              style={{
                borderRadius: 'var(--radius)',
                flexShrink: 0,
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <button
            onClick={handleClear}
            style={{
              width: '100%',
              padding: 'var(--spacing-3)',
              marginTop: 'var(--spacing-4)',
              fontFamily: 'var(--font-family-inter)',
              fontSize: 'var(--text-base)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Clear Selection
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
