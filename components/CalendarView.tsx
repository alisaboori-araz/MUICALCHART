
import React from 'react';
import { Moment } from 'moment-jalaali';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ActivityData, Locale } from '../types';
import CustomDayRenderer from './CustomDayRenderer';

interface CalendarViewProps {
  currentMonthView: Moment;
  activityData: ActivityData;
  locale: Locale;
  onDisplayMonthChange: (date: Moment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonthView,
  activityData,
  locale,
  onDisplayMonthChange,
}) => {
  return (
    <div className="bg-slate-750 rounded-lg shadow-inner">
      <DateCalendar<Moment>
        value={currentMonthView} 
        onMonthChange={onDisplayMonthChange}
        readOnly // We don't want date selection, just month navigation and display
        disableFuture={false} // Allow navigation to future months
        disablePast={false}   // Allow navigation to past months
        slots={{
          day: (dayProps) => (
            <CustomDayRenderer
              {...dayProps}
              activityData={activityData}
              currentLocale={locale}
            />
          ),
        }}
        sx={{
          width: '100%', 
          maxHeight: 'none', 
          '.MuiPickersCalendarHeader-label, .MuiPickersCalendarHeader-labelContainer': {
            fontSize: locale === 'fa' ? '1.1rem' : '1rem', 
            color: 'rgb(203, 213, 225)', // slate-300
            margin: '0 auto' 
          },
          '.MuiPickersCalendarHeader-switchViewButton': {
            display: 'none', 
          },
          '.MuiPickersCalendarHeader-iconButton': {
            color: 'rgb(148, 163, 184)', 
            backgroundColor: 'rgba(100, 116, 139, 0.1)', 
            '&:hover': {
              backgroundColor: 'rgba(100, 116, 139, 0.3)', 
            },
            '&.Mui-disabled': {
              color: 'rgb(71, 85, 105)', 
              backgroundColor: 'transparent',
            }
          },
          '.MuiDayCalendar-weekContainer': {
             margin: '2px 0', 
          },
          '.MuiDayCalendar-weekDayLabel': {
            color: 'rgb(148, 163, 184)', 
            fontWeight: '600',
            fontSize: locale === 'fa' ? '0.8rem' : '0.75rem', 
            width: 'calc(100% / 7)', 
            maxWidth: 'none',
            margin: '0', 
          },
          '.MuiPickersDay-root': { 
             fontSize: locale === 'fa' ? '0.95rem' : '0.875rem',
          },
          '.MuiPickersDay-root:focus': {
             outline: 'none', 
          },
          '.MuiPickersDay-root.Mui-selected': {
            backgroundColor: 'rgba(56, 189, 248, 0.1) !important', 
            '&:hover': {
               backgroundColor: 'rgba(56, 189, 248, 0.2) !important',
            }
          },
          '.MuiPickersDay-root.Mui-selected.MuiPickersDay-today': {
            // Ensures that if currentMonthView (selected) is also today,
            // the 'today' styling from CustomDayRenderer (border) is still visible
            // along with the subtle selection background.
          },
          '.MuiDayCalendar-header > .MuiButtonBase-root': {
            display: 'none',
          }
        }}
      />
    </div>
  );
};

export default CalendarView;
