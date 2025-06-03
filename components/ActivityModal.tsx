
import React, { useEffect } from 'react';
import type moment from 'moment-jalaali';
import { CalendarGridDay, Activity, UITranslations } from '../types';
import { MAX_ACTIVITY_LEVEL } from '../constants';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: CalendarGridDay;
  activity: Activity | undefined; // Activity now has { descriptions: string[] }
  texts: UITranslations;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  dayData,
  activity,
  texts
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const activityDescriptions = activity ? activity.descriptions : [];
  const activityCount = activityDescriptions.length;
  const formattedDate = dayData.momentDate.format('dddd, MMMM Do YYYY');
  // Example for Jalaali specific formatting if needed:
  // const formattedDate = dayData.momentDate.locale() === 'fa' 
  // ? dayData.momentDate.format('dddd jD jMMMM jYYYY') 
  // : dayData.momentDate.format('dddd, MMMM Do YYYY');


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="activity-modal-title" className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
            Activity Details
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-3">
          <p className="text-md text-gray-800 dark:text-gray-200">
            <span className="font-medium">Date:</span> {formattedDate} 
            ({dayData.momentDate.locale() === 'fa' ? dayData.momentDate.format('jD') : dayData.momentDate.format('D')})
          </p>
        </div>

        <div className="mb-5 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' /* Adjust based on padding/other elements */ }}>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            {activityCount > 0 ? texts.activityCount(activityCount) : texts.noActivity}:
          </h3>
          {activityCount > 0 ? (
            <ul className="list-disc list-inside space-y-1.5 text-gray-700 dark:text-gray-300 pl-1 pr-2 max-h-48 overflow-y-auto custom-scrollbar">
              {activityDescriptions.map((desc, index) => (
                <li key={index} className="text-sm">{desc}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">{/* Message handled by heading */}</p>
          )}
          
          {activityCount > 0 && (
             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                <div 
                    className="bg-green-500 h-2.5 rounded-full transition-width duration-500 ease-out" 
                    style={{ width: `${Math.min((activityCount / MAX_ACTIVITY_LEVEL) * 100, 100)}%` }}
                    title={`${Math.round((activityCount / MAX_ACTIVITY_LEVEL) * 100)}% of daily activity goal (max ${MAX_ACTIVITY_LEVEL} items)`}
                ></div>
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          className="mt-auto w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Basic custom scrollbar styling (optional, can be added to index.html <style> or a CSS file)
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255,255,255,0.2);
}
*/
