
import type { LocalizedStrings } from '../types';

export const translations: Record<string, LocalizedStrings> = {
  en: {
    activityCalendarTitle: "Monthly Activity Overview",
    selectDate: "Select Month",
    language: "Language",
    calendarSystem: "Calendar System",
    gregorian: "Gregorian",
    jalaali: "Jalaali (Persian)",
    english: "English",
    persian: "Persian (فارسی)",
    Su: "Su", Mo: "Mo", Tu: "Tu", We: "We", Th: "Th", Fr: "Fr", Sa: "Sa",
    Sunday: "Sunday", Monday: "Monday", Tuesday: "Tuesday", Wednesday: "Wednesday", Thursday: "Thursday", Friday: "Friday", Saturday: "Saturday",
    noActivity: "No activity",
    activityCount: "Activities: {count}",
    footerText: "© {year} Activity Tracker Plus",
  },
  fa: {
    activityCalendarTitle: "مرور فعالیت ماهانه",
    selectDate: "انتخاب ماه",
    language: "زبان",
    calendarSystem: "سیستم تقویم",
    gregorian: "میلادی",
    jalaali: "شمسی (فارسی)",
    english: "انگلیسی (English)",
    persian: "فارسی",
    Su: "ی", Mo: "د", Tu: "س", We: "چ", Th: "پ", Fr: "ج", Sa: "ش",
    Sunday: "یکشنبه", Monday: "دوشنبه", Tuesday: "سه‌شنبه", Wednesday: "چهارشنبه", Thursday: "پنج‌شنبه", Friday: "جمعه", Saturday: "شنبه",
    noActivity: "بدون فعالیت",
    activityCount: "فعالیت‌ها: {count}",
    footerText: "© {year} ردیاب فعالیت پلاس",
  },
};
