
// This file can be used for additional date utility functions if needed.
// For now, moment-jalaali and the useCalendar hook handle most requirements.

// Example: Function to convert English numbers to Persian, if not handled by moment's locale
/*
export const toPersianNumerals = (numStr: string | number): string => {
  const persianNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(numStr).replace(/[0-9]/g, (digit) => persianNumerals[parseInt(digit)]);
};
*/

// moment-jalaali with `usePersianDigits: true` should handle this automatically.
export {}; // Keep the file as a module
