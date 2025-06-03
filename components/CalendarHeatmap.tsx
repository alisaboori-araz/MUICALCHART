
import React from 'react';
import { CalendarGridDay, ActivityData, UITranslations, Activity } from '../types';
import { MAX_ACTIVITY_LEVEL } from '../constants';

interface CalendarHeatmapProps {
  calendarGridDays: CalendarGridDay[];
  activities: ActivityData;
  daysOfWeek: string[];
  texts: UITranslations;
  onDayClick: (day: CalendarGridDay) => void;
}

const getActivityColor = (count: number | undefined, maxCount: number = MAX_ACTIVITY_LEVEL): string => {
  if (count === undefined || count === 0) return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
  
  const intensity = Math.min(count / maxCount, 1);
  // Adjusted color scale for potentially lower max counts if MAX_ACTIVITY_LEVEL is small
  if (intensity <= 0) return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
  if (intensity < 0.25) return 'bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700';
  if (intensity < 0.5) return 'bg-green-300 dark:bg-green-700 hover:bg-green-400 dark:hover:bg-green-600';
  if (intensity < 0.75) return 'bg-green-400 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-500';
  return 'bg-green-500 dark:bg-green-500 hover:bg-green-600 dark:hover:bg-green-400';
  // For higher MAX_ACTIVITY_LEVEL, might want more granular colors:
  // if (intensity < 0.2) return 'bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700';
  // if (intensity < 0.4) return 'bg-green-300 dark:bg-green-700 hover:bg-green-400 dark:hover:bg-green-600';
  // if (intensity < 0.6) return 'bg-green-400 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-500';
  // if (intensity < 0.8) return 'bg-green-500 dark:bg-green-500 hover:bg-green-600 dark:hover:bg-green-400';
  // return 'bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300';
};


export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  calendarGridDays,
  activities,
  daysOfWeek,
  texts,
  onDayClick
}) => {
  return (
    <div className="grid grid-cols-7 gap-1 md:gap-1.5">
      {daysOfWeek.map(dayName => (
        <div key={dayName} className="text-center font-medium text-xs text-gray-600 dark:text-gray-400 pb-1 select-none">
          {dayName}
        </div>
      ))}
      {calendarGridDays.map(day => {
        const activity: Activity | undefined = activities[day.gregorianDateKey];
        const activityCount = activity ? activity.descriptions.length : 0;
        
        const colorClass = day.isCurrentMonth 
          ? getActivityColor(activityCount, MAX_ACTIVITY_LEVEL) 
          : 'bg-gray-50 dark:bg-gray-800'; 
        
        const tooltipText = day.isCurrentMonth 
          ? (activityCount > 0 ? texts.activityCount(activityCount) : texts.noActivity)
          : '';
          
        return (
          <div
            key={day.key}
            title={`${day.momentDate.format('LL')} - ${tooltipText}`}
            onClick={() => day.isCurrentMonth && onDayClick(day)}
            className={`
              h-12 md:h-16 lg:h-20 
              flex items-center justify-center 
              rounded
              transition-all duration-150 ease-in-out
              border 
              ${day.isToday && day.isCurrentMonth ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-300 dark:ring-indigo-600' : 'border-gray-200 dark:border-gray-700'}
              ${colorClass}
              ${day.isCurrentMonth ? 'cursor-pointer hover:opacity-80' : 'text-gray-400 dark:text-gray-600 cursor-default'}
            `}
            role={day.isCurrentMonth ? "button" : undefined}
            tabIndex={day.isCurrentMonth ? 0 : undefined}
            onKeyDown={(e) => {
              if (day.isCurrentMonth && (e.key === 'Enter' || e.key === ' ')) {
                onDayClick(day);
              }
            }}
          >
            <span className={`text-xs md:text-sm select-none ${day.isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
              {day.displayDay}
            </span>
          </div>
        );
      })}
    </div>
  );
};