import { PrayerTimes, PrayerSettings, Coordinates } from '../types';
import { CalculationMethod, Coordinates as AdhanCoordinates, PrayerTimes as AdhanPrayerTimes, SunnahTimes } from 'adhan';
import { format } from 'date-fns';

export const getCalculationMethod = (method: string) => {
  const methods: { [key: string]: CalculationMethod } = {
    'MuslimWorldLeague': CalculationMethod.MuslimWorldLeague(),
    'Egyptian': CalculationMethod.Egyptian(),
    'Karachi': CalculationMethod.Karachi(),
    'UmmAlQura': CalculationMethod.UmmAlQura(),
    'Dubai': CalculationMethod.Dubai(),
    'MoonsightingCommittee': CalculationMethod.MoonsightingCommittee(),
    'NorthAmerica': CalculationMethod.NorthAmerica(),
    'Kuwait': CalculationMethod.Kuwait(),
    'Qatar': CalculationMethod.Qatar(),
    'Singapore': CalculationMethod.Singapore(),
    'Tehran': CalculationMethod.Tehran(),
    'Turkey': CalculationMethod.Turkey()
  };
  return methods[method] || CalculationMethod.MuslimWorldLeague();
};

export const calculatePrayerTimes = (date: Date, settings: PrayerSettings): PrayerTimes => {
  const coordinates = new AdhanCoordinates(settings.location.latitude, settings.location.longitude);
  const params = getCalculationMethod(settings.calculationMethod);
  
  // Apply custom adjustments
  Object.entries(settings.adjustments).forEach(([prayer, adjustment]) => {
    if (params.adjustments[prayer as keyof typeof params.adjustments] !== undefined) {
      params.adjustments[prayer as keyof typeof params.adjustments] = adjustment;
    }
  });

  const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha
  };
};

export const formatPrayerTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const getNextPrayer = (prayerTimes: PrayerTimes): { name: string; time: Date } | null => {
  const now = new Date();
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha }
  ];

  for (const prayer of prayers) {
    if (prayer.time > now) {
      return prayer;
    }
  }

  return null;
};

export const shouldNotify = (
  prayerTime: Date,
  notificationTime: number,
  alreadyNotified: boolean
): boolean => {
  if (alreadyNotified) return false;

  const now = new Date();
  const notificationThreshold = new Date(prayerTime.getTime() - notificationTime * 60000);
  return now >= notificationThreshold && now < prayerTime;
};

export const getQiblaDirection = (coordinates: Coordinates): number => {
  const meccaCoordinates = new AdhanCoordinates(21.4225, 39.8262);
  const currentLocation = new AdhanCoordinates(coordinates.latitude, coordinates.longitude);
  return currentLocation.qibla();
};
