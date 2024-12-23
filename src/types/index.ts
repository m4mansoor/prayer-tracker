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
  arabicName?: string;
  completed: boolean;
  startTime: string;
  endTime: string;
  fineAmount: number;
  calculatedTime?: Date;
  notified?: boolean;
}

export interface DailyPrayers {
  date: string;
  prayers: Prayer[];
  totalCompleted: number;
  totalFine: number;
  prayerTimes?: PrayerTimes;
}

export interface PrayerHistory {
  [date: string]: DailyPrayers;
}

export interface BasicStats {
  totalPrayers: number;
  completedPrayers: number;
  missedPrayers: number;
  totalFine: number;
  completionRate: number;
}

export interface PrayerStats extends BasicStats {
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string;
  };
  timeAnalysis: {
    averageDelay: number;
    mostMissedPrayer: string;
    bestPerformingDay: string;
  };
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  remainingBalance: number;
  paymentMethod?: string;
  notes?: string;
}

export interface PaymentHistory {
  records: PaymentRecord[];
  totalPaid: number;
  lastPayment?: PaymentRecord;
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
