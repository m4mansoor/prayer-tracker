export interface Prayer {
  name: string;
  arabicName?: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  fineAmount: number;
}

export interface DailyPrayers {
  prayers: Prayer[];
  totalCompleted: number;
  totalFine: number;
}

export interface PrayerHistory {
  [date: string]: DailyPrayers;
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

export interface PrayerStats {
  totalPrayers: number;
  completedPrayers: number;
  missedPrayers: number;
  totalFine: number;
  completionRate: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  remainingBalance: number;
}

export interface PaymentHistory {
  records: PaymentRecord[];
  totalPaid: number;
}
