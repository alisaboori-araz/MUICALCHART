import type moment from 'moment-jalaali';

export type CalendarSystem = 'gregorian' | 'jalaali';

export interface Activity {
  descriptions: string[]; // Changed from count: number
}
export interface ActivityData {
  [gregorianDateKey: string]: Activity; // YYYY-MM-DD
}

export interface CalendarGridDay {
  key: string;
  momentDate: moment.Moment;
  displayDay: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  gregorianDateKey: string; // YYYY-MM-DD, for activity lookup
}

export interface UITranslations {
  calendarSystem: string;
  gregorian: string;
  jalaali: string;
  prevMonth: string;
  nextMonth: "Next Month";
  prevYear: string;
  nextYear: string;
  currentMonth: string;
  noActivity: string;
  activityCount: (count: number) => string; // Will use descriptions.length
  darkMode: string;
  lightMode: string;
  daysShort: string[];
}