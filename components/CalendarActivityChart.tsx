import React from 'react';
import moment from 'moment-jalaali';
import type { Language, CalendarSystem, ActivityData, DayObject, LocalizedStrings } from '../types';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme, SxProps, Theme } from '@mui/material/styles';
import { grey, blue } from '@mui/material/colors'; // Import blue color

interface CalendarActivityChartProps {
  selectedDate: moment.Moment;
  language: Language;
  calendarSystem: CalendarSystem;
  activityData: ActivityData;
  translations: LocalizedStrings;
}

// Updated to use theme and return SxProps
const getActivityStyles = (
    count: number | undefined, 
    isCurrentMonth: boolean, 
    theme: Theme
  ): SxProps<Theme> => {
  const baseStyle: SxProps<Theme> = {
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.short,
    }),
    color: theme.palette.text.primary, // Default text color
  };

  // Resolve customSky from the theme, or fallback to MUI blue
  const skyColors = (theme.palette as any).customSky || {
    50: blue[50],
    100: blue[100],
    200: blue[200],
    300: blue[300], 
    400: blue[400],
    500: blue[500],
    600: blue[600],
    700: blue[700],
    800: blue[800],
  };
  // Use skyColors directly or define an alias after skyColors is fully defined.
  // For clarity, using skyColors directly or ensuring alias is correctly scoped if used.

  if (!isCurrentMonth) {
    return {
      ...baseStyle,
      backgroundColor: grey[50],
      color: grey[400],
      opacity: 0.7,
    };
  }

  if (count === undefined || count === 0) {
    return {
      ...baseStyle,
      backgroundColor: grey[100], // slate-100
      color: grey[600],          // slate-500
      '&:hover': { backgroundColor: grey[200] },
    };
  }
  if (count <= 2) {
    return {
      ...baseStyle,
      backgroundColor: skyColors[100], 
      color: skyColors[700], // Consider a darker shade for text on light background
      '&:hover': { backgroundColor: skyColors[200] },
    };
  }
  if (count <= 5) {
    return {
      ...baseStyle,
      backgroundColor: skyColors[300], 
      color: skyColors[800], // Consider a darker shade for text on medium background
      '&:hover': { backgroundColor: skyColors[400] },
    };
  }
  if (count <= 9) {
    return {
      ...baseStyle,
      backgroundColor: skyColors[500], 
      color: 'white',
      '&:hover': { backgroundColor: skyColors[600] },
    };
  }
  return { // 10+
    ...baseStyle,
    backgroundColor: skyColors[700], 
    color: 'white',
    '&:hover': { backgroundColor: skyColors[800] },
  };
};


export const CalendarActivityChart: React.FC<CalendarActivityChartProps> = ({
  selectedDate,
  language,
  calendarSystem,
  activityData,
  translations,
}) => {
  moment.locale(language);
  const theme = useTheme();

  const getMonthDays = (): DayObject[] => {
    const days: DayObject[] = [];
    const monthUnit = calendarSystem === 'jalaali' ? 'jMonth' : 'month';
    
    const monthStart = selectedDate.clone().startOf(monthUnit as moment.unitOfTime.StartOf);
    const monthEnd = selectedDate.clone().endOf(monthUnit as moment.unitOfTime.StartOf);
    
    const calendarGridStartDay = monthStart.clone().startOf('week');

    for (let dayIter = calendarGridStartDay.clone(); dayIter.isBefore(monthEnd.clone().endOf('week')) || dayIter.isSame(monthEnd.clone().endOf('week'),'day') ; dayIter.add(1, 'day')) {
        const currentMoment = dayIter.clone();
        
        // @ts-ignore moment-jalaali uses jMonth, TypeScript types for isSame might not be perfectly aligned for units
        const isCurrentMonth = currentMoment.isSame(monthStart, monthUnit as moment.unitOfTime.Diff);
        
        let dayNumberText: string;
        if (calendarSystem === 'jalaali') {
            dayNumberText = currentMoment.locale(language).format('jD');
        } else {
            dayNumberText = currentMoment.locale(language).format('D');
        }
        const gregorianDateKey = currentMoment.format('YYYY-MM-DD'); 
        const activityCount = activityData[gregorianDateKey];

        days.push({
            date: currentMoment,
            dayNumberText: dayNumberText,
            isCurrentMonth: isCurrentMonth,
            isToday: currentMoment.isSame(moment(), 'day'),
            activityCount: activityCount,
            gregorianDateKey: gregorianDateKey,
        });
        
        // Ensure we don't create an infinitely long calendar for weird edge cases with month calculations
        if (days.length >= 42 && !currentMoment.isSame(monthStart, monthUnit as moment.unitOfTime.Diff) && currentMoment.isAfter(monthEnd)) {
            break;
        }
         // Simplified break: if we have enough weeks (6*7=42) and the next day is no longer in the selected month.
        if (days.length >= 35 && dayIter.day() === 6 && !currentMoment.clone().add(1,'day').isSame(monthStart, monthUnit as moment.unitOfTime.Diff)) {
             if (days.length >= 42) break; // Max 6 weeks
             // if it's the last day of a 5-week display and next week is entirely outside current month.
             if (days.length === 35 && !isCurrentMonth && !currentMoment.clone().add(1,'day').isSame(monthStart, monthUnit as moment.unitOfTime.Diff) && !currentMoment.clone().add(7,'days').isSame(monthStart, monthUnit as moment.unitOfTime.Diff)){
                // Check if the entire next week is outside the current month
                let nextWeekOutside = true;
                for(let k=1; k<=7; k++){
                    if(currentMoment.clone().add(k,'day').isSame(monthStart, monthUnit as moment.unitOfTime.Diff)){
                        nextWeekOutside = false;
                        break;
                    }
                }
                if(nextWeekOutside) break;
             }
        }
    }
    // Trim trailing empty week if all days are outside the current month
    while (days.length > 35) {
        const lastWeek = days.slice(-7);
        if (lastWeek.every(d => !d.isCurrentMonth)) {
            days.splice(days.length - 7, 7);
        } else {
            break;
        }
    }

    return days;
  };

  const daysInGrid = getMonthDays();
  
  const dayHeaders = React.useMemo(() => {
    const firstDayOfWeek = moment().locale(language).startOf('week');
    return Array(7).fill(null).map((_, i) => firstDayOfWeek.clone().add(i, 'day').format('dd'));
  }, [language]);
  
  const currentMonthName = calendarSystem === 'jalaali'
    ? selectedDate.locale(language).format('jMMMM jYYYY')
    : selectedDate.locale(language).format('MMMM YYYY');

  const customSkyPalette = (theme.palette as any).customSky || {
    100: blue[100], 300: blue[300], 500: blue[500], 700: blue[700] // Fallbacks
  };

  const legendItems = [
    { labelKey: 'noActivity', color: grey[100] },
    { label: '1-2', color: customSkyPalette[100] },
    { label: '3-5', color: customSkyPalette[300] },
    { label: '6-9', color: customSkyPalette[500] },
    { label: '10+', color: customSkyPalette[700] },
  ];


  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
       <Typography variant="h5" component="h2" color="primary.main" sx={{ mb: 3, textAlign: 'center', fontWeight:'medium' }}>
        {currentMonthName}
      </Typography>
      <Grid container columns={7} spacing={{xs: 0.5, sm: 1}}> {/* Grid for days */}
        {dayHeaders.map((header) => (
          <Grid item xs={1} key={header}>
            <Typography variant="caption" display="block" align="center" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
              {header}
            </Typography>
          </Grid>
        ))}
        {daysInGrid.map((dayObj, index) => (
          <Grid item xs={1} key={`${dayObj.gregorianDateKey}-${index}`}>
            <Box
              title={
                `${dayObj.date.locale(language).format(calendarSystem === 'jalaali' ? 'dddd, jD jMMMM jYYYY' : 'dddd, MMMM D, YYYY')}\n` +
                (dayObj.activityCount !== undefined 
                  ? translations.activityCount.replace('{count}', dayObj.activityCount.toString()) 
                  : translations.noActivity)
              }
              sx={{
                height: { xs: 36, sm: 48, md: 56 }, // h-12 sm:h-16 md:h-20 (approx)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1, // rounded-md
                cursor: 'default',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                outline: dayObj.isToday && dayObj.isCurrentMonth ? `2px solid ${theme.palette.primary.main}` : 'none',
                outlineOffset: '1px',
                ...(getActivityStyles(dayObj.activityCount, dayObj.isCurrentMonth, theme)),
              }}
            >
              <Typography 
                component="span" 
                variant="body2" 
                sx={{ 
                  fontWeight: dayObj.isToday && dayObj.isCurrentMonth ? 'bold' : 'normal',
                  fontSize: 'inherit'
                }}
              >
                {dayObj.dayNumberText}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
          {language === 'en' ? 'Legend:' : 'راهنما:'}
        </Typography>
        {legendItems.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: item.color }} />
            <Typography variant="caption" sx={{color: 'text.secondary'}}>
              {item.labelKey ? translations[item.labelKey as keyof LocalizedStrings] : item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};