
import React, { useState, useEffect, useCallback } from 'react';
import momentJalaali from 'moment-jalaali';
import { CalendarSystem, ActivityData, UITranslations, CalendarGridDay, Activity } from './types';
import { DEFAULT_CALENDAR_SYSTEM, UI_TEXTS, MAX_ACTIVITY_LEVEL } from './constants';
import { Controls } from './components/Controls';
import { CalendarHeatmap } from './components/CalendarHeatmap';
import { ActivityModal } from './components/ActivityModal';
import { useCalendar } from './hooks/useCalendar';

momentJalaali.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
momentJalaali.locale('en');

const SAMPLE_ACTIVITY_DESCRIPTIONS: string[] = [
  "Team meeting", "Code review", "Develop feature X", "Fix bug #123", "Documentation update",
  "Client call", "Project planning", "Gym session", "Read a book", "Grocery shopping",
  "Cook dinner", "Learn new API", "Write unit tests", "Deploy to staging", "Attend webinar",
  "Clean the house", "Morning jog", "Yoga practice", "Pay bills", "Work on side project"
];

const generateMockActivities = (
  dateForMonth: momentJalaali.Moment,
  calendarSystem: CalendarSystem
): ActivityData => {
  const activities: ActivityData = {};
  const year = calendarSystem === 'jalaali' ? dateForMonth.jYear() : dateForMonth.year();
  const month = calendarSystem === 'jalaali' ? dateForMonth.jMonth() : dateForMonth.month();

  const tempMoment = momentJalaali(dateForMonth).clone();
  if (calendarSystem === 'jalaali') {
    tempMoment.locale('fa').jYear(year).jMonth(month);
  } else {
    tempMoment.locale('en').year(year).month(month);
  }
  
  const daysInMonth = tempMoment.daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    let currentDayMoment: momentJalaali.Moment;
    if (calendarSystem === 'jalaali') {
      currentDayMoment = momentJalaali().locale('fa').jYear(year).jMonth(month).jDate(day);
    } else {
      currentDayMoment = momentJalaali().locale('en').year(year).month(month).date(day);
    }
    
    const gregorianDateKey = currentDayMoment.clone().locale('en').format('YYYY-MM-DD');

    if (Math.random() > 0.35) { // ~65% chance of activity
      const numberOfDescriptions = Math.floor(Math.random() * 3) + 1; // 1 to 3 descriptions
      const dayDescriptions: string[] = [];
      const usedIndexes = new Set<number>();
      for (let i = 0; i < numberOfDescriptions; i++) {
        let randomIndex;
        // Ensure unique descriptions if possible and sample pool is large enough
        if (SAMPLE_ACTIVITY_DESCRIPTIONS.length > numberOfDescriptions) {
          do {
            randomIndex = Math.floor(Math.random() * SAMPLE_ACTIVITY_DESCRIPTIONS.length);
          } while (usedIndexes.has(randomIndex));
          usedIndexes.add(randomIndex);
        } else { // If sample pool is small, allow repeats
          randomIndex = Math.floor(Math.random() * SAMPLE_ACTIVITY_DESCRIPTIONS.length);
        }
        dayDescriptions.push(SAMPLE_ACTIVITY_DESCRIPTIONS[randomIndex]);
      }
      activities[gregorianDateKey] = {
        descriptions: dayDescriptions
      };
    }
  }
  return activities;
};


const App: React.FC = () => {
  const [calendarSystem, setCalendarSystem] = useState<CalendarSystem>(DEFAULT_CALENDAR_SYSTEM);
  const [currentDisplayDate, setCurrentDisplayDate] = useState<momentJalaali.Moment>(momentJalaali());
  const [activities, setActivities] = useState<ActivityData>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDayData, setSelectedDayData] = useState<CalendarGridDay | null>(null);

  const texts = UI_TEXTS;

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.dir = 'ltr';
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);
  
  const regenerateActivities = useCallback(() => {
    setActivities(generateMockActivities(currentDisplayDate, calendarSystem));
  }, [currentDisplayDate, calendarSystem]);

  useEffect(() => {
    regenerateActivities();
  }, [regenerateActivities]);

  const handleCalendarSystemChange = (system: CalendarSystem) => {
    const currentGregorianEquivalent = currentDisplayDate.clone().locale('en');
    let newDate;
    if (system === 'jalaali') {
        newDate = momentJalaali(currentGregorianEquivalent.format('YYYY-MM-DD'), 'YYYY-MM-DD');
    } else { 
        newDate = momentJalaali(currentGregorianEquivalent.format('YYYY-MM-DD'), 'YYYY-MM-DD');
    }
    setCurrentDisplayDate(newDate);
    setCalendarSystem(system);
  };
  
  const handleNavigate = (unit: 'month' | 'year', amount: number) => {
    setCurrentDisplayDate(prevDate => {
      const newDate = prevDate.clone();
      if (calendarSystem === 'jalaali') newDate.locale('fa'); else newDate.locale('en');
      
      const method = calendarSystem === 'jalaali' ? (unit === 'month' ? 'jMonth' : 'jYear') : unit;
      newDate.add(amount, method as momentJalaali.unitOfTime.DurationConstructor);
      return newDate;
    });
  };
  
  const { monthName, year, daysOfWeek, calendarGridDays } = useCalendar(currentDisplayDate, calendarSystem, texts);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleDayClick = (day: CalendarGridDay) => {
    if (!day.isCurrentMonth) return;
    setSelectedDayData(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDayData(null);
  };

  const activityForModal: Activity | undefined = selectedDayData ? activities[selectedDayData.gregorianDateKey] : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">
          Activity Calendar Heatmap
        </h1>
        
        <Controls
          currentDisplayDate={currentDisplayDate}
          calendarSystem={calendarSystem}
          onCalendarSystemChange={handleCalendarSystemChange}
          onNavigate={handleNavigate}
          texts={texts}
          monthName={monthName}
          year={year}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <CalendarHeatmap
          calendarGridDays={calendarGridDays}
          activities={activities}
          daysOfWeek={daysOfWeek}
          texts={texts}
          onDayClick={handleDayClick}
        />
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            {`Showing activities for ${monthName} ${year}`}
            <button onClick={regenerateActivities} className="ml-2 px-2 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white rounded">
              Regenerate Data
            </button>
        </div>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Built with React, Tailwind CSS, and moment-jalaali
      </footer>

      {isModalOpen && selectedDayData && (
        <ActivityModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          dayData={selectedDayData}
          activity={activityForModal} // activityForModal is now { descriptions: string[] } | undefined
          texts={texts}
        />
      )}
    </div>
  );
};

export default App;