import { Prayer, DailyPrayers, PrayerHistory, FilterOptions } from '../types';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';

export const DEFAULT_PRAYERS: Prayer[] = [
  { name: 'Fajr', arabicName: 'الفجر', startTime: '04:30', endTime: '05:45', completed: false, fineAmount: 10 },
  { name: 'Dhuhr', arabicName: 'الظهر', startTime: '12:00', endTime: '13:30', completed: false, fineAmount: 10 },
  { name: 'Asr', arabicName: 'العصر', startTime: '15:30', endTime: '16:45', completed: false, fineAmount: 10 },
  { name: 'Maghrib', arabicName: 'المغرب', startTime: '18:00', endTime: '19:15', completed: false, fineAmount: 10 },
  { name: 'Isha', arabicName: 'العشاء', startTime: '19:45', endTime: '21:00', completed: false, fineAmount: 10 },
];

export const getToday = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const createDailyPrayers = (): DailyPrayers => ({
  date: getToday(),
  prayers: DEFAULT_PRAYERS.map(prayer => ({
    ...prayer,
    completed: false
  })),
  totalCompleted: 0,
  totalFine: 0
});

export const updateDailyPrayers = (
  dayData: DailyPrayers,
  prayerName: string,
  completed: boolean
): DailyPrayers => {
  const updatedPrayers = dayData.prayers.map(prayer =>
    prayer.name === prayerName ? { ...prayer, completed } : prayer
  );

  const totalCompleted = updatedPrayers.filter(p => p.completed).length;
  const totalFine = updatedPrayers.reduce(
    (sum, prayer) => sum + (prayer.completed ? 0 : prayer.fineAmount),
    0
  );

  return {
    date: dayData.date,
    prayers: updatedPrayers,
    totalCompleted,
    totalFine
  };
};

export const getDateRangeForFilter = (filterType: FilterOptions['filterType']): { startDate: string; endDate: string } => {
  const today = new Date();
  const endDate = formatDate(today);

  switch (filterType) {
    case 'day':
      return {
        startDate: endDate,
        endDate: endDate,
      };
    case 'week':
      return {
        startDate: formatDate(subDays(today, 7)),
        endDate: endDate,
      };
    case 'month':
      return {
        startDate: formatDate(subDays(today, 30)),
        endDate: endDate,
      };
    case 'custom':
      return {
        startDate: endDate,
        endDate: endDate,
      };
    default:
      return {
        startDate: endDate,
        endDate: endDate,
      };
  }
};

export const filterPrayerHistory = (
  history: PrayerHistory,
  filterOptions: FilterOptions
): PrayerHistory => {
  const { dateRange, showCompleted, showMissed } = filterOptions;
  const startDate = parseISO(dateRange.startDate);
  const endDate = parseISO(dateRange.endDate);

  return Object.entries(history).reduce((filtered, [date, dayData]) => {
    const currentDate = parseISO(date);

    // Check if the date is within the selected range
    if (!isWithinInterval(currentDate, { start: startDate, end: endDate })) {
      return filtered;
    }

    // Filter prayers based on completion status
    const filteredPrayers = dayData.prayers.filter(prayer => {
      if (prayer.completed && !showCompleted) return false;
      if (!prayer.completed && !showMissed) return false;
      return true;
    });

    if (filteredPrayers.length === 0) {
      return filtered;
    }

    // Calculate new totals for filtered prayers
    const totalCompleted = filteredPrayers.filter(p => p.completed).length;
    const totalFine = filteredPrayers.reduce((acc, prayer) => 
      acc + (prayer.completed ? 0 : prayer.fineAmount), 0
    );

    return {
      ...filtered,
      [date]: {
        prayers: filteredPrayers,
        totalCompleted,
        totalFine,
      },
    };
  }, {} as PrayerHistory);
};
