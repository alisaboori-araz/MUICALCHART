
import React from 'react';
import { Moment } from 'moment-jalaali';
import { Locale } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ControlsProps {
  locale: Locale;
  onLocaleChange: (newLocale: Locale) => void;
  currentMonthView: Moment;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

const Controls: React.FC<ControlsProps> = ({
  locale,
  onLocaleChange,
  currentMonthView,
  onMonthChange,
}) => {
  // currentMonthView is already localized by App.tsx's useEffect
  const formattedMonthYear = currentMonthView.format(locale === 'fa' ? 'jMMMM jYYYY' : 'MMMM YYYY');

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700 rounded-lg shadow-md">
      <div className="mb-3 sm:mb-0">
        <button
          onClick={() => onLocaleChange(locale === 'en' ? 'fa' : 'en')}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 text-sm sm:text-base"
        >
          {locale === 'en' ? 'فارسی (شمسی)' : 'English (Gregorian)'}
        </button>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => onMonthChange('prev')}
          aria-label={locale === 'en' ? 'Previous month' : 'ماه قبل'}
          className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <span className="text-base sm:text-lg font-semibold text-sky-300 w-36 sm:w-48 text-center tabular-nums">
          {formattedMonthYear}
        </span>
        <button
          onClick={() => onMonthChange('next')}
          aria-label={locale === 'en' ? 'Next month' : 'ماه بعد'}
          className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
