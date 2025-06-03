
import { Moment } from 'moment-jalaali';

export interface ActivityData {
  [dateKey: string]: number; // Gregorian YYYY-MM-DD is used as key
}

export type Locale = 'en' | 'fa';

export interface CustomDayProps { // This was an earlier thought, CustomDayRendererProps is more specific
  day: Moment;
  activityCount?: number;
  outsideCurrentMonth: boolean;
  currentLocale: Locale; // Renamed from 'locale'
}
