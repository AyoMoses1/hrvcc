'use client';

import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';

export interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  defaultMonth?: Date;
  className?: string;
  inline?: boolean;
  highlightDates?: Date[];
}

function Calendar({
  selected,
  onSelect,
  defaultMonth,
  className,
  inline = true,
  highlightDates,
  ...props
}: CalendarProps) {
  const [date, setDate] = React.useState<Date | null>(selected || null);

  React.useEffect(() => {
    setDate(selected || null);
  }, [selected]);

  const handleChange = (newDate: Date | null) => {
    setDate(newDate);
    onSelect?.(newDate);
  };

  return (
    <div className={cn('w-full', className)}>
      <DatePicker
        selected={date}
        onChange={handleChange}
        inline={inline}
        highlightDates={highlightDates}
        calendarClassName="custom-calendar"
        {...props}
      />
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
