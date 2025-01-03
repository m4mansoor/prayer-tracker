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
  time: string;
  completed: boolean;
  completedOnTime?: boolean;
  fine?: number;
  completedAt?: string;
}

export interface DailyPrayers {
  date: string;
  prayers: Prayer[];
  totalCompleted: number;
  totalFine: number;
}

export interface FinePayment {
  id: string;
  amount: number;
  date: string;
  paidAt: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: 'pending' | 'paid';
}

export interface FineHistory {
  [date: string]: {
    amount: number;
    prayers: string[];
    paid: boolean;
    paidAt?: string;
    paymentId?: string;
  };
}

export interface PrayerHistory {
  [date: string]: DailyPrayers;
  fineHistory: FineHistory;
  finePayments: FinePayment[];
}

export interface PrayerTimeSettings {
  method: string;
  school: string;
  latitude: number;
  longitude: number;
}

export interface PrayerStats {
  totalPrayers: number;
  completedPrayers: number;
  missedPrayers: number;
  totalFine: number;
  completionRate: number;
  streakData: {
    currentStreak: number;
    longestStreak: number;
  };
  timeAnalysis: {
    onTime: number;
    delayed: number;
  };
}

export interface PrayerReport {
  startDate: string;
  endDate: string;
  totalPrayers: number;
  completedPrayers: number;
  missedPrayers: number;
  totalFine: number;
  completionRate: number;
  prayerBreakdown: {
    [prayerName: string]: {
      total: number;
      completed: number;
      completionRate: number;
      totalFine: number;
    };
  };
  dailyStats: {
    [date: string]: {
      completed: number;
      total: number;
      fine: number;
    };
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
