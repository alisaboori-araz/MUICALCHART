import { CalendarSystem, UITranslations } from './types';

export const DEFAULT_CALENDAR_SYSTEM: CalendarSystem = 'gregorian';

export const MAX_ACTIVITY_LEVEL = 15; // For heatmap color scaling

export const UI_TEXTS: UITranslations = {
  calendarSystem: "Calendar System",
  gregorian: "Gregorian",
  jalaali: "Jalaali (Shamsi)", // Clarified Jalaali name
  prevMonth: "Prev Month",
  nextMonth: "Next Month",
  prevYear: "Prev Year",
  nextYear: "Next Year",
  currentMonth: "Current Month",
  noActivity: "No activity",
  activityCount: (count: number) => `${count} activities`,
  darkMode: "Dark Mode",
  lightMode: "Light Mode",
  daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
