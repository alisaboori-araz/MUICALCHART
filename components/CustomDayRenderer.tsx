
import React from 'react';
import { Moment } from 'moment-jalaali';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { ActivityData, Locale } from '../types';

interface CustomDayRendererProps extends PickersDayProps<Moment> {
  activityData: ActivityData;
  currentLocale: Locale; 
}

const CustomDayRenderer: React.FC<CustomDayRendererProps> = (props) => {
  const { day, outsideCurrentMonth, activityData, currentLocale, today, selected, ...other } = props;

  // Key for activityData is always Gregorian YYYY-MM-DD
  const activityDateKey = day.clone().locale('en').format('YYYY-MM-DD');
  const activityCount = activityData[activityDateKey] || 0;

  let dayBgColor = 'bg-slate-600 hover:bg-slate-500'; 
  let dayTextColor = 'text-slate-100'; 
  let dayBorderColor = 'border-slate-500'; 

  if (!outsideCurrentMonth) {
    if (activityCount > 0) {
      if (activityCount <= 5) {
        dayBgColor = 'bg-emerald-700 hover:bg-emerald-600'; // Low
      } else if (activityCount <= 10) {
        dayBgColor = 'bg-emerald-500 hover:bg-emerald-400'; // Medium
      } else {
        dayBgColor = 'bg-emerald-300 hover:bg-emerald-200'; // High
        dayTextColor = 'text-emerald-900'; 
      }
      dayBorderColor = 'border-transparent'; 
    }
  }
  
  if (outsideCurrentMonth) {
    dayBgColor = 'bg-transparent'; 
    dayTextColor = 'text-slate-500';
    dayBorderColor = 'border-transparent';
  } else if (today) {
    dayBorderColor = `border-sky-400 ${activityCount > 0 ? 'border-opacity-50' : ''}`; 
  }
  
  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      today={today}
      selected={selected} 
      className={`
        m-px !p-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
        !text-xs sm:!text-sm
        rounded-md !font-semibold transition-all duration-150 ease-in-out
        focus:z-10 
        ${dayBgColor} 
        ${dayTextColor}
        border ${dayBorderColor}
        ${!outsideCurrentMonth ? 'focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:ring-sky-400' : '!text-slate-600'}
      `}
    >
    </PickersDay>
  );
};

export default CustomDayRenderer;
