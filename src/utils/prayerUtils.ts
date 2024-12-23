import { Prayer, DailyPrayers, PrayerHistory } from '../types';

const DEFAULT_PRAYERS: DailyPrayers = [
  { name: 'Fajr', time: '05:30', completed: false },
  { name: 'Zuhr', time: '13:30', completed: false },
  { name: 'Asr', time: '16:30', completed: false },
  { name: 'Maghrib', time: '18:30', completed: false },
  { name: 'Isha', time: '20:00', completed: false }
];

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTodaysPrayers = (): DailyPrayers => {
  const today = getToday();
  const storedHistory = localStorage.getItem('prayerHistory');
  if (storedHistory) {
    const history: PrayerHistory = JSON.parse(storedHistory);
    if (history[today]) {
      return history[today].prayers;
    }
  }
  return DEFAULT_PRAYERS;
};

export const updatePrayerStatus = (
  history: PrayerHistory,
  prayerName: string
): { updatedHistory: PrayerHistory } => {
  const today = getToday();
  const updatedHistory = { ...history };

  if (!updatedHistory[today]) {
    updatedHistory[today] = {
      date: today,
      prayers: DEFAULT_PRAYERS,
      totalCompleted: 0,
      totalFine: 0
    };
  }

  const updatedPrayers = updatedHistory[today].prayers.map(prayer => {
    if (prayer.name === prayerName) {
      const completed = !prayer.completed;
      const fine = completed ? 0 : 10; // 10 rupees fine for missed prayers
      return { ...prayer, completed, fine };
    }
    return prayer;
  });

  const totalCompleted = updatedPrayers.filter(p => p.completed).length;
  const totalFine = updatedPrayers.reduce((sum, p) => sum + (p.fine || 0), 0);

  updatedHistory[today] = {
    date: today,
    prayers: updatedPrayers,
    totalCompleted,
    totalFine
  };

  return { updatedHistory };
};
