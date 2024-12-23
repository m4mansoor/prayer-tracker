import { PrayerHistory, PrayerStats, Prayer } from '../types';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, differenceInDays } from 'date-fns';

export const calculatePrayerStats = (history: PrayerHistory): PrayerStats => {
  let totalPrayers = 0;
  let completedPrayers = 0;
  let totalFine = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let lastCompletedDate = '';
  let prayerDelays: number[] = [];
  let missedPrayerCounts: { [key: string]: number } = {};
  let dayCompletionCounts: { [key: string]: number } = {};

  // Sort dates in ascending order
  const dates = Object.keys(history).sort();
  
  // Calculate streaks and gather data
  dates.forEach((date, index) => {
    const dayData = history[date];
    const dayCompleted = dayData.prayers.every(p => p.completed);
    
    dayData.prayers.forEach(prayer => {
      totalPrayers++;
      if (prayer.completed) {
        completedPrayers++;
        if (prayer.calculatedTime) {
          const delay = new Date(prayer.startTime).getTime() - new Date(prayer.calculatedTime).getTime();
          if (delay > 0) {
            prayerDelays.push(delay);
          }
        }
      } else {
        missedPrayerCounts[prayer.name] = (missedPrayerCounts[prayer.name] || 0) + 1;
      }
    });

    totalFine += dayData.totalFine;
    
    // Track completion rate by day of week
    const dayOfWeek = format(new Date(date), 'EEEE');
    if (dayCompleted) {
      dayCompletionCounts[dayOfWeek] = (dayCompletionCounts[dayOfWeek] || 0) + 1;
    }

    // Calculate streaks
    if (dayCompleted) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
      lastCompletedDate = date;
    } else {
      currentStreak = 0;
    }
  });

  // Find most missed prayer
  const mostMissedPrayer = Object.entries(missedPrayerCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '';

  // Find best performing day
  const bestPerformingDay = Object.entries(dayCompletionCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '';

  // Calculate average delay
  const averageDelay = prayerDelays.length > 0
    ? prayerDelays.reduce((a, b) => a + b, 0) / prayerDelays.length / 60000 // Convert to minutes
    : 0;

  return {
    totalPrayers,
    completedPrayers,
    missedPrayers: totalPrayers - completedPrayers,
    totalFine,
    completionRate: (completedPrayers / totalPrayers) * 100,
    streakData: {
      currentStreak,
      longestStreak,
      lastCompletedDate,
    },
    timeAnalysis: {
      averageDelay,
      mostMissedPrayer,
      bestPerformingDay,
    },
  };
};

export const getWeeklyStats = (history: PrayerHistory) => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return daysInWeek.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = history[dateStr];
    if (!dayData) return { date: dateStr, completed: 0, total: 5 };

    return {
      date: dateStr,
      completed: dayData.totalCompleted,
      total: dayData.prayers.length,
    };
  });
};

export const getTrendData = (history: PrayerHistory, days: number = 30) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);

  const trendData = [];
  let currentDate = startDate;

  while (currentDate <= today) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayData = history[dateStr];
    
    trendData.push({
      date: dateStr,
      completionRate: dayData 
        ? (dayData.totalCompleted / dayData.prayers.length) * 100 
        : 0,
      fineAmount: dayData?.totalFine || 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return trendData;
};

export const getPrayerDistribution = (history: PrayerHistory) => {
  const distribution: { [key: string]: { completed: number; missed: number } } = {};

  Object.values(history).forEach(dayData => {
    dayData.prayers.forEach(prayer => {
      if (!distribution[prayer.name]) {
        distribution[prayer.name] = { completed: 0, missed: 0 };
      }
      if (prayer.completed) {
        distribution[prayer.name].completed++;
      } else {
        distribution[prayer.name].missed++;
      }
    });
  });

  return Object.entries(distribution).map(([name, stats]) => ({
    name,
    completed: stats.completed,
    missed: stats.missed,
    total: stats.completed + stats.missed,
    completionRate: (stats.completed / (stats.completed + stats.missed)) * 100,
  }));
};

export const getTimeDistribution = (history: PrayerHistory) => {
  const timeSlots: { [key: string]: number } = {};
  const hourFormat = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  // Initialize time slots
  for (let i = 0; i < 24; i++) {
    timeSlots[hourFormat(i)] = 0;
  }

  Object.values(history).forEach(dayData => {
    dayData.prayers.forEach(prayer => {
      if (prayer.completed) {
        const hour = new Date(prayer.startTime).getHours();
        timeSlots[hourFormat(hour)]++;
      }
    });
  });

  return Object.entries(timeSlots).map(([hour, count]) => ({
    hour,
    count,
  }));
};
