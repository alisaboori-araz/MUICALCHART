
import React from 'react';
import type moment from 'moment-jalaali';
import { CalendarSystem, UITranslations } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, SunIcon, MoonIcon } from './icons';

interface ControlsProps {
  currentDisplayDate: moment.Moment;
  // language: Language; // Removed
  calendarSystem: CalendarSystem;
  // onLanguageChange: (lang: Language) => void; // Removed
  onCalendarSystemChange: (system: CalendarSystem) => void;
  onNavigate: (unit: 'month' | 'year', amount: number) => void;
  texts: UITranslations;
  monthName: string;
  year: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const selectBaseClasses = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";
const buttonBaseClasses = "p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";
const navButtonClasses = `${buttonBaseClasses} flex items-center justify-center`;

export const Controls: React.FC<ControlsProps> = ({
  // language, // Removed
  calendarSystem,
  // onLanguageChange, // Removed
  onCalendarSystemChange,
  onNavigate,
  texts,
  monthName,
  year,
  isDarkMode,
  toggleDarkMode
}) => {
  // const isRtl = language === 'fa'; // Removed, defaulting to LTR behavior

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
        {/* Language select removed */}
        <div className="md:col-span-1"> {/* Was col-span-1, ensure layout is fine */}
          <label htmlFor="calendar-system-select" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">{texts.calendarSystem}:</label>
          <select
            id="calendar-system-select"
            value={calendarSystem}
            onChange={(e) => onCalendarSystemChange(e.target.value as CalendarSystem)}
            className={selectBaseClasses}
          >
            <option value="gregorian">{texts.gregorian}</option>
            <option value="jalaali">{texts.jalaali}</option>
          </select>
        </div>
        <div className="md:col-span-1"> {/* Empty div for spacing or shift dark mode toggle here */}
        </div>
        <div className="flex items-center justify-start md:justify-end pt-2 md:pt-0 md:col-span-1"> {/* Adjusted to col-span-1 and pt-0 for alignment */}
            <button onClick={toggleDarkMode} className={buttonBaseClasses} aria-label={isDarkMode ? texts.lightMode : texts.darkMode}>
                {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-indigo-500" />}
            </button>
        </div>
      </div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center space-x-1"> {/* Removed rtl:space-x-reverse */}
          <button onClick={() => onNavigate('year', -1)} className={navButtonClasses} title={texts.prevYear}>
            <ChevronLeftIcon />
            <ChevronLeftIcon />
          </button>
          <button onClick={() => onNavigate('month', -1)} className={navButtonClasses} title={texts.prevMonth}>
            <ChevronLeftIcon />
          </button>
        </div>
        
        <div className="text-lg font-semibold text-center text-indigo-700 dark:text-indigo-300 whitespace-nowrap px-2">
          {monthName} {year}
        </div>

        <div className="flex items-center space-x-1">  {/* Removed rtl:space-x-reverse */}
          <button onClick={() => onNavigate('month', 1)} className={navButtonClasses} title={texts.nextMonth}>
             <ChevronRightIcon />
          </button>
          <button onClick={() => onNavigate('year', 1)} className={navButtonClasses} title={texts.nextYear}>
            <ChevronRightIcon />
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
