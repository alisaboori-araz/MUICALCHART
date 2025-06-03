
import React, { useState, useCallback, useEffect } from 'react';
import moment, { Moment } from 'moment-jalaali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import CalendarView from './components/CalendarView';
import Controls from './components/Controls';
import { ActivityData, Locale } from './types';

// Initialize moment-jalaali for Persian settings.
// usePersianDigits: true will make moment format dates with Persian numerals when locale is 'fa'.
moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

const initialActivityData: ActivityData = {};
// Populate with some random data for +-60 days around today
for (let i = -60; i <= 60; i++) {
    const date = moment().add(i, 'days');
    // Use Gregorian YYYY-MM-DD for keys consistently
    const dateKey = date.clone().locale('en').format('YYYY-MM-DD'); 
    if (Math.random() < 0.4) { // 40% chance of activity
        initialActivityData[dateKey] = Math.floor(Math.random() * 15) + 1;
    }
}

const App: React.FC = () => {
  const [locale, setLocale] = useState<Locale>('en');
  const [currentMonthView, setCurrentMonthView] = useState<Moment>(moment());
  const [activityData] = useState<ActivityData>(initialActivityData);

  useEffect(() => {
    // Set moment's global locale and update currentMonthView's locale instance
    moment.locale(locale);
    setCurrentMonthView(prev => prev.clone().locale(locale));
  }, [locale]);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    // The useEffect above will handle moment.locale and currentMonthView update.
  }, []);

  const handleMonthChange = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonthView(prev => {
      const newMonth = prev.clone(); // prev is already in the correct locale due to useEffect
      if (direction === 'prev') {
        newMonth.subtract(1, 'month');
      } else {
        newMonth.add(1, 'month');
      }
      return newMonth;
    });
  }, []);

  const handleDisplayMonthChange = useCallback((date: Moment) => {
    // This date comes from DateCalendar, which uses AdapterMomentJalaali.
    // It should already be in the correct locale context.
    setCurrentMonthView(date.clone()); 
  }, []);


  return (
    <LocalizationProvider dateAdapter={AdapterMomentJalaali} adapterLocale={locale}>
      <div 
        className={`min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 flex flex-col items-center ${locale === 'fa' ? 'font-persian' : ''}`}
        dir={locale === 'fa' ? 'rtl' : 'ltr'} // Set text direction
      >
        <div className="w-full max-w-3xl bg-slate-800 shadow-2xl rounded-lg p-3 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
            {locale === 'en' ? 'Activity Calendar' : 'تقویم فعالیت‌ها'}
          </h1>
          <Controls
            locale={locale}
            onLocaleChange={handleLocaleChange}
            currentMonthView={currentMonthView}
            onMonthChange={handleMonthChange}
          />
          <div className="mt-6">
            <CalendarView
              currentMonthView={currentMonthView}
              activityData={activityData}
              locale={locale}
              onDisplayMonthChange={handleDisplayMonthChange}
            />
          </div>
           <div className="mt-8 p-4 bg-slate-700 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-sky-400">{locale === 'en' ? 'Activity Legend' : 'راهنمای فعالیت'}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:text-base">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-slate-600 border border-slate-500 shrink-0"></div>
                <span>{locale === 'en' ? 'No Activity' : 'بدون فعالیت'}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-emerald-700 shrink-0"></div>
                <span>{locale === 'en' ? 'Low (1-5)' : 'کم (۱-۵)'}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-emerald-500 shrink-0"></div>
                <span>{locale === 'en' ? 'Medium (6-10)' : 'متوسط (۶-۱۰)'}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-emerald-300 shrink-0"></div>
                <span className="text-slate-100">{locale === 'en' ? 'High (>10)' : 'زیاد (۱۰+)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default App;
