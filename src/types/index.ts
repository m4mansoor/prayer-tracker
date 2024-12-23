export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerSettings {
  location: Coordinates;
  calculationMethod: string;
  asrMethod: string;
  adjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  notificationSound: boolean;
  notificationTime: number; // minutes before prayer time
}

export interface Prayer {
  name: string;
  arabicName: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  fineAmount: number;
}

export interface DailyPrayers {
  date: string;
  prayers: Prayer[];
  totalCompleted: number;
  totalFine: number;
}

export interface PrayerHistory {
  [date: string]: DailyPrayers;
}

export interface PrayerStats {
  totalPrayers: number;
  completedPrayers: number;
  missedPrayers: number;
  totalFine: number;
  completionRate: number;
  streakData?: {
    currentStreak: number;
    longestStreak: number;
  };
  timeAnalysis?: {
    mostMissedPrayer: string;
    bestPerformingDay: string;
  };
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  remainingBalance: number;
}

export interface PaymentHistory {
  records: Payment[];
  totalPaid: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOptions {
  dateRange: DateRange;
  filterType: 'day' | 'week' | 'month' | 'custom';
  showCompleted: boolean;
  showMissed: boolean;
}
