"use client"

import { useState, useEffect } from "react"
import { Coordinates, CalculationMethod, PrayerTimes, CalculationParameters, Madhab } from 'adhan';

export type PrayerName = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha"

export interface PrayerTime {
  name: PrayerName
  time: Date
  arabicName: string
  indonesianName: string
}

export type CalculationMethodName = "Singapore"

export interface PrayerSettings {
  coordinates: {
    latitude: number
    longitude: number
  }
  cityName: string
  calculationMethod: CalculationMethodName
  adjustments: {
    [key in PrayerName]: number
  }
  iqamahTimes: {
    [key in Exclude<PrayerName, "Sunrise">]: number
  }
  mosqueName: string
  afterIqamahMessage: string
  afterIqamahDuration: number
}

const DEFAULT_SETTINGS: PrayerSettings = {
  coordinates: {
    latitude: -6.2088, // Jakarta
    longitude: 106.8456,
  },
  cityName: "Jakarta",
  calculationMethod: "Singapore",
  adjustments: {
    Fajr: 0,
    Sunrise: 0,
    Dhuhr: 0,
    Asr: 0,
    Maghrib: 0,
    Isha: 0,
  },
  iqamahTimes: {
    Fajr: 20,
    Dhuhr: 5,
    Asr: 5,
    Maghrib: 5,
    Isha: 5,
  },
  mosqueName: "Masjid TimerA",
  afterIqamahMessage: "Lurus Rapatkan Shaf",
  afterIqamahDuration: 10,
}

// Calculate prayer times with improved accuracy
export function calculatePrayerTimes(date: Date, settings: PrayerSettings, isApplyAdjustment: boolean = true): PrayerTime[] {
  try {
    const coordinates = new Coordinates(
      settings.coordinates.latitude,
      settings.coordinates.longitude
    );

    const params = CalculationMethod.Singapore();
    params.madhab = Madhab.Shafi;

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const fajrTime = prayerTimes.fajr;
    const sunriseTime = prayerTimes.sunrise;
    const dhuhrTime = prayerTimes.dhuhr;
    const asrTime = prayerTimes.asr;
    const maghribTime = prayerTimes.maghrib;
    const ishaTime = prayerTimes.isha;

    const prayers: PrayerTime[] = [
      {
        name: "Fajr",
        time: fajrTime,
        arabicName: getArabicName("Fajr"),
        indonesianName: getIndonesianName("Fajr"),
      },
      {
        name: "Sunrise",
        time: sunriseTime,
        arabicName: getArabicName("Sunrise"),
        indonesianName: getIndonesianName("Sunrise"),
      },
      {
        name: "Dhuhr",
        time: dhuhrTime,
        arabicName: getArabicName("Dhuhr"),
        indonesianName: getIndonesianName("Dhuhr"),
      },
      {
        name: "Asr",
        time: asrTime,
        arabicName: getArabicName("Asr"),
        indonesianName: getIndonesianName("Asr"),
      },
      {
        name: "Maghrib",
        time: maghribTime,
        arabicName: getArabicName("Maghrib"),
        indonesianName: getIndonesianName("Maghrib"),
      },
      {
        name: "Isha",
        time: ishaTime,
        arabicName: getArabicName("Isha"),
        indonesianName: getIndonesianName("Isha"),
      },
    ];

    if (isApplyAdjustment) {
      // Apply user adjustments
      prayers.forEach((prayer) => {
        if (settings.adjustments[prayer.name] !== undefined) {
          const adjustedTime = new Date(prayer.time);
          adjustedTime.setMinutes(prayer.time.getMinutes() + settings.adjustments[prayer.name]);
          prayer.time = adjustedTime;
        }
      });
    }


    // Sort by time
    prayers.sort((a, b) => a.time.getTime() - b.time.getTime());

    return prayers;
  } catch (error) {
    console.error("Error calculating prayer times:", error);
    return getFallbackPrayerTimes(date);
  }
}

// Fallback prayer times in case of error
function getFallbackPrayerTimes(date: Date): PrayerTime[] {
  // Set some reasonable default prayer times
  const baseDate = new Date(date)
  baseDate.setHours(0, 0, 0, 0)

  const times = [
    { name: "Fajr", hours: 4, minutes: 30 },
    { name: "Sunrise", hours: 6, minutes: 0 },
    { name: "Dhuhr", hours: 12, minutes: 0 },
    { name: "Asr", hours: 15, minutes: 0 },
    { name: "Maghrib", hours: 18, minutes: 0 },
    { name: "Isha", hours: 19, minutes: 30 },
  ]

  return times.map((t) => {
    const time = new Date(baseDate)
    time.setHours(t.hours, t.minutes)

    return {
      name: t.name as PrayerName,
      time,
      arabicName: getArabicName(t.name as PrayerName),
      indonesianName: getIndonesianName(t.name as PrayerName),
    }
  })
}

function getArabicName(prayer: PrayerName): string {
  const arabicNames: Record<PrayerName, string> = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  }

  return arabicNames[prayer]
}

function getIndonesianName(prayer: PrayerName): string {
  const indonesianNames: Record<PrayerName, string> = {
    Fajr: "Subuh",
    Sunrise: "Syuruq",
    Dhuhr: "Dzuhur",
    Asr: "Ashar",
    Maghrib: "Maghrib",
    Isha: "Isya",
  }

  return indonesianNames[prayer]
}

export function useSettings() {
  const [settings, setSettings] = useState<PrayerSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("prayerSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse saved settings", e)
      }
    }
  }, [])

  const updateSettings = (newSettings: PrayerSettings) => {
    setSettings(newSettings)
    localStorage.setItem("prayerSettings", JSON.stringify(newSettings))
  }

  return { settings, updateSettings }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function getNextPrayer(prayerTimes: PrayerTime[]): PrayerTime | null {
  const now = new Date()

  // Filter out Sunrise for next prayer calculation
  const prayers = prayerTimes.filter((prayer) => prayer.name !== "Sunrise")

  for (const prayer of prayers) {
    if (prayer.time > now) {
      return prayer
    }
  }

  // If no prayer is found for today, return the first prayer of tomorrow
  // This handles the case when we're after the last prayer of the day
  if (prayers.length > 0) {
    const tomorrowPrayer = { ...prayers[0] }
    const tomorrowTime = new Date(tomorrowPrayer.time)
    tomorrowTime.setDate(tomorrowTime.getDate() + 1)
    tomorrowPrayer.time = tomorrowTime
    return tomorrowPrayer
  }

  return null
}

export function getTimeUntilNextPrayer(nextPrayer: PrayerTime | null): number {
  if (!nextPrayer) return 0

  const now = new Date()
  return nextPrayer.time.getTime() - now.getTime()
}

export function getTimeSincePreviousPrayer(prevPrayer: PrayerTime | null): number {
  if (!prevPrayer) return 0

  const now = new Date()
  return now.getTime() - prevPrayer.time.getTime()
}

export function getPreviousPrayer(prayerTimes: PrayerTime[]): PrayerTime | null {
  const now = new Date();

  // Filter out Sunrise for previous prayer calculation
  const prayers = prayerTimes.filter((prayer) => prayer.name !== "Sunrise");

  for (let i = prayers.length - 1; i >= 0; i--) {
    const prayer = prayers[i];
    if (prayer.time < now) {
      return prayer;
    }
  }

  // If no prayer is found for today, return the last prayer of yesterday
  // This handles the case when we're before the first prayer of the day
  if (prayers.length > 0) {
    const yesterdayPrayer = { ...prayers[prayers.length - 1] };
    const yesterdayTime = new Date(yesterdayPrayer.time);
    yesterdayTime.setDate(yesterdayTime.getDate() - 1);
    yesterdayPrayer.time = yesterdayTime;
    return yesterdayPrayer;
  }

  return null;
}
export function formatTimeCountdownDetail(ms: number): string {
  if (ms <= 0) return "0 detik";

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  let result = [];

  if (hours > 0) result.push(`${hours} jam`);
  if (minutes > 0) result.push(`${minutes} menit`);
  // if (seconds > 0 || result.length === 0) result.push(`${seconds} detik`);

  return result.join(" ");
}


export function formatTimeUntil(ms: number): string {
  if (ms <= 0) return "00:00:00"

  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}


export function formatTimeUntilMinutes(ms: number): string {
  if (ms <= 0) return "00:00"

  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)


  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export { DEFAULT_SETTINGS }

