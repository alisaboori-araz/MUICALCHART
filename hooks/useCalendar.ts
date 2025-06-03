
import moment from 'moment-jalaali';
import { useMemo } from 'react';
import { CalendarSystem, CalendarGridDay, UITranslations } from '../types';

// Ensure that startOf('week') for English locale (default UI) aligns with Sunday as the first day.
moment.updateLocale('en', {
  week: {
    dow: 0, // Sunday is the first day of the week for English
    doy: 6 // Standard for US English locale
  }
});
// No need to update 'fa' locale here for week start, as UI is English.
// Jalaali calendar itself inherently starts weeks on Saturday, which moment-jalaali handles.

export const useCalendar = (
  currentDisplayDate: moment.Moment, // The date determining the month/year to display
  calendarSystem: CalendarSystem,    // The calendar system to use ('gregorian' or 'jalaali')
  texts: UITranslations              // UI text translations (now only English)
): {
  monthName: string;
  year: string;
  daysOfWeek: string[];
  calendarGridDays: CalendarGridDay[];
} => {
  return useMemo(() => {
    const effectiveLocale = calendarSystem === 'jalaali' ? 'fa' : 'en';
    const displayContextMoment = currentDisplayDate.clone().locale(effectiveLocale);

    const monthName = calendarSystem === 'jalaali' ? displayContextMoment.format('jMMMM') : displayContextMoment.format('MMMM');
    const year = calendarSystem === 'jalaali' ? displayContextMoment.format('jYYYY') : displayContextMoment.format('YYYY');
    
    // Use pre-translated English short day names
    const daysOfWeek = [...texts.daysShort]; // Should be ["Sun", "Mon", ..., "Sat"]
    
    let actualStartOfMonth: moment.Moment;
    if (calendarSystem === 'jalaali') {
      actualStartOfMonth = displayContextMoment.clone().startOf('jMonth');
    } else {
      actualStartOfMonth = displayContextMoment.clone().startOf('month');
    }

    // Calculate the first cell of the calendar grid.
    // Week structure (e.g., starting Sunday) is based on 'en' locale.
    // Then switch back to effectiveLocale for date calculations within that grid.
    const firstCellMoment = actualStartOfMonth.clone()
                              .locale('en')             // Use English locale for week definition (e.g. Sunday start)
                              .startOf('week')
                              .locale(effectiveLocale); // Switch back to the calendar system's effective locale

    const calendarGridDays: CalendarGridDay[] = [];
    const todayInDisplaySystem = moment().locale(effectiveLocale); 

    for (let i = 0; i < 42; i++) { 
      const dayMomentInCell = firstCellMoment.clone().add(i, 'days');
      
      let isCurrentMonthForCell: boolean;
      if (calendarSystem === 'jalaali') {
        isCurrentMonthForCell = dayMomentInCell.jMonth() === displayContextMoment.jMonth();
      } else {
        isCurrentMonthForCell = dayMomentInCell.month() === displayContextMoment.month();
      }

      // For Jalaali, usePersianDigits will apply if moment-jalaali is configured for it.
      const displayDayString = calendarSystem === 'jalaali' ? dayMomentInCell.format('jD') : dayMomentInCell.format('D');
      
      const gregorianDateKeyForActivity = dayMomentInCell.clone().locale('en').format('YYYY-MM-DD');
      const isTodayCell = dayMomentInCell.isSame(todayInDisplaySystem, 'day');

      calendarGridDays.push({
        key: dayMomentInCell.format('YYYYMMDDHHmmss') + i,
        momentDate: dayMomentInCell,
        displayDay: displayDayString,
        isCurrentMonth: isCurrentMonthForCell,
        isToday: isTodayCell,
        gregorianDateKey: gregorianDateKeyForActivity,
      });
    }
    
    return { monthName, year, daysOfWeek, calendarGridDays };
  }, [currentDisplayDate, calendarSystem, texts]);
};
