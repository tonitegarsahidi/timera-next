"use client"

import { useState, useEffect } from "react"

export type PrayerName = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha"

export interface PrayerTime {
  name: PrayerName
  time: Date
  arabicName: string
  indonesianName: string
}

export type CalculationMethodName = "MWL" | "ISNA" | "Egypt" | "Makkah" | "Karachi" | "Tehran" | "Jafari"

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
  calculationMethod: "MWL",
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
  mosqueName: "Masjid Al-Ikhlas",
  afterIqamahMessage: "Lurus Rapatkan Shaf",
  afterIqamahDuration: 10,
}

// Calculate prayer times with improved accuracy
export function calculatePrayerTimes(date: Date, settings: PrayerSettings): PrayerTime[] {
  try {
    // Get the day of the year
    const dayOfYear = getDayOfYear(date)

    // Get the timezone offset in hours
    const timezoneOffset = date.getTimezoneOffset() / -60

    // Calculate prayer times based on coordinates and calculation method
    const prayerTimes = calculatePrayerTimesForLocation(
      settings.coordinates.latitude,
      settings.coordinates.longitude,
      timezoneOffset,
      dayOfYear,
      settings.calculationMethod,
    )

    // Apply user adjustments
    Object.keys(prayerTimes).forEach((key) => {
      const prayerName = key as PrayerName
      if (settings.adjustments[prayerName] !== undefined) {
        const time = prayerTimes[prayerName]
        const adjustedTime = new Date(time)
        adjustedTime.setMinutes(time.getMinutes() + settings.adjustments[prayerName])
        prayerTimes[prayerName] = adjustedTime
      }
    })

    // Convert to array format
    const prayers: PrayerTime[] = Object.entries(prayerTimes).map(([name, time]) => {
      const prayerName = name as PrayerName
      return {
        name: prayerName,
        time,
        arabicName: getArabicName(prayerName),
        indonesianName: getIndonesianName(prayerName),
      }
    })

    // Sort by time
    prayers.sort((a, b) => a.time.getTime() - b.time.getTime())

    return prayers
  } catch (error) {
    console.error("Error calculating prayer times:", error)
    return getFallbackPrayerTimes(date)
  }
}

// Calculate prayer times based on astronomical formulas
function calculatePrayerTimesForLocation(
  latitude: number,
  longitude: number,
  timezone: number,
  dayOfYear: number,
  method: CalculationMethodName,
): Record<PrayerName, Date> {
  // Get the date for calculations
  const date = new Date()
  date.setHours(0, 0, 0, 0)

  // Get method parameters
  const methodParams = getMethodParameters(method)

  // Calculate solar position
  const declination = getSolarDeclination(dayOfYear)
  const equation = getEquationOfTime(dayOfYear)

  // Calculate prayer times
  const fajrTime = calculateFajrTime(date, latitude, longitude, timezone, declination, equation, methodParams.fajrAngle)
  const sunriseTime = calculateSunriseTime(date, latitude, longitude, timezone, declination, equation)
  const dhuhrTime = calculateDhuhrTime(date, longitude, timezone, equation)
  const asrTime = calculateAsrTime(date, latitude, longitude, timezone, declination, equation, methodParams.asrFactor)
  const maghribTime = calculateMaghribTime(
    date,
    latitude,
    longitude,
    timezone,
    declination,
    equation,
    methodParams.maghribAngle,
  )
  const ishaTime = calculateIshaTime(date, latitude, longitude, timezone, declination, equation, methodParams.ishaAngle)

  return {
    Fajr: fajrTime,
    Sunrise: sunriseTime,
    Dhuhr: dhuhrTime,
    Asr: asrTime,
    Maghrib: maghribTime,
    Isha: ishaTime,
  }
}

// Get method parameters for different calculation methods
function getMethodParameters(method: CalculationMethodName): {
  fajrAngle: number
  ishaAngle: number
  maghribAngle: number
  asrFactor: number
} {
  switch (method) {
    case "MWL":
      return { fajrAngle: 18, ishaAngle: 17, maghribAngle: 0, asrFactor: 1 }
    case "ISNA":
      return { fajrAngle: 15, ishaAngle: 15, maghribAngle: 0, asrFactor: 1 }
    case "Egypt":
      return { fajrAngle: 19.5, ishaAngle: 17.5, maghribAngle: 0, asrFactor: 1 }
    case "Makkah":
      return { fajrAngle: 18.5, ishaAngle: 90, maghribAngle: 0, asrFactor: 1 } // Isha is 90 minutes after Maghrib
    case "Karachi":
      return { fajrAngle: 18, ishaAngle: 18, maghribAngle: 0, asrFactor: 1 }
    case "Tehran":
      return { fajrAngle: 17.7, ishaAngle: 14, maghribAngle: 4.5, asrFactor: 1 }
    case "Jafari":
      return { fajrAngle: 16, ishaAngle: 14, maghribAngle: 4, asrFactor: 1 }
    default:
      return { fajrAngle: 18, ishaAngle: 17, maghribAngle: 0, asrFactor: 1 }
  }
}

// Get day of year (1-366)
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

// Calculate solar declination
function getSolarDeclination(dayOfYear: number): number {
  return 23.45 * Math.sin(((Math.PI / 180) * 360 * (dayOfYear - 81)) / 365)
}

// Calculate equation of time
function getEquationOfTime(dayOfYear: number): number {
  const b = (360 * (dayOfYear - 81)) / 365
  return (
    9.87 * Math.sin((2 * b * Math.PI) / 180) -
    7.53 * Math.cos((b * Math.PI) / 180) -
    1.5 * Math.sin((b * Math.PI) / 180)
  )
}

// Calculate Fajr time
function calculateFajrTime(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  declination: number,
  equation: number,
  angle: number,
): Date {
  const time = date.getTime()
  const fajrDate = new Date(time)

  // Calculate time difference from noon for Fajr
  const T =
    (1 / 15) *
    Math.acos(
      (-Math.sin((angle * Math.PI) / 180) -
        Math.sin((declination * Math.PI) / 180) * Math.sin((latitude * Math.PI) / 180)) /
        (Math.cos((declination * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180)),
    )

  // Convert to hours
  const fajrHours = 12 - T - equation / 60 + longitude / 15 - timezone

  // Set time
  fajrDate.setHours(Math.floor(fajrHours))
  fajrDate.setMinutes(Math.round((fajrHours - Math.floor(fajrHours)) * 60))
  fajrDate.setSeconds(0)

  return fajrDate
}

// Calculate Sunrise time
function calculateSunriseTime(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  declination: number,
  equation: number,
): Date {
  const time = date.getTime()
  const sunriseDate = new Date(time)

  // Calculate time difference from noon for Sunrise
  const T =
    (1 / 15) *
    Math.acos(
      (-Math.sin((0.833 * Math.PI) / 180) -
        Math.sin((declination * Math.PI) / 180) * Math.sin((latitude * Math.PI) / 180)) /
        (Math.cos((declination * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180)),
    )

  // Convert to hours
  const sunriseHours = 12 - T - equation / 60 + longitude / 15 - timezone

  // Set time
  sunriseDate.setHours(Math.floor(sunriseHours))
  sunriseDate.setMinutes(Math.round((sunriseHours - Math.floor(sunriseHours)) * 60))
  sunriseDate.setSeconds(0)

  return sunriseDate
}

// Calculate Dhuhr time
function calculateDhuhrTime(date: Date, longitude: number, timezone: number, equation: number): Date {
  const time = date.getTime()
  const dhuhrDate = new Date(time)

  // Calculate Dhuhr time
  const dhuhrHours = 12 - equation / 60 + longitude / 15 - timezone

  // Set time
  dhuhrDate.setHours(Math.floor(dhuhrHours))
  dhuhrDate.setMinutes(Math.round((dhuhrHours - Math.floor(dhuhrHours)) * 60))
  dhuhrDate.setSeconds(0)

  return dhuhrDate
}

// Calculate Asr time
function calculateAsrTime(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  declination: number,
  equation: number,
  asrFactor: number,
): Date {
  const time = date.getTime()
  const asrDate = new Date(time)

  // Calculate shadow length
  const shadowLength = asrFactor + Math.tan((Math.abs(latitude - declination) * Math.PI) / 180)

  // Calculate time difference from noon for Asr
  const T =
    (1 / 15) *
    Math.acos(
      (Math.sin((Math.atan(1 / shadowLength) * Math.PI) / 180) -
        Math.sin((declination * Math.PI) / 180) * Math.sin((latitude * Math.PI) / 180)) /
        (Math.cos((declination * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180)),
    )

  // Convert to hours
  const asrHours = 12 + T - equation / 60 + longitude / 15 - timezone

  // Set time
  asrDate.setHours(Math.floor(asrHours))
  asrDate.setMinutes(Math.round((asrHours - Math.floor(asrHours)) * 60))
  asrDate.setSeconds(0)

  return asrDate
}

// Calculate Maghrib time
function calculateMaghribTime(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  declination: number,
  equation: number,
  angle: number,
): Date {
  const time = date.getTime()
  const maghribDate = new Date(time)

  // Calculate time difference from noon for Maghrib
  const T =
    (1 / 15) *
    Math.acos(
      (-Math.sin(((0.833 + angle) * Math.PI) / 180) -
        Math.sin((declination * Math.PI) / 180) * Math.sin((latitude * Math.PI) / 180)) /
        (Math.cos((declination * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180)),
    )

  // Convert to hours
  const maghribHours = 12 + T - equation / 60 + longitude / 15 - timezone

  // Set time
  maghribDate.setHours(Math.floor(maghribHours))
  maghribDate.setMinutes(Math.round((maghribHours - Math.floor(maghribHours)) * 60))
  maghribDate.setSeconds(0)

  return maghribDate
}

// Calculate Isha time
function calculateIshaTime(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number,
  declination: number,
  equation: number,
  angle: number,
): Date {
  const time = date.getTime()
  const ishaDate = new Date(time)

  // For Makkah method, Isha is 90 minutes after Maghrib
  if (angle === 90) {
    const maghribTime = calculateMaghribTime(date, latitude, longitude, timezone, declination, equation, 0)
    ishaDate.setTime(maghribTime.getTime() + 90 * 60 * 1000)
    return ishaDate
  }

  // Calculate time difference from noon for Isha
  const T =
    (1 / 15) *
    Math.acos(
      (-Math.sin((angle * Math.PI) / 180) -
        Math.sin((declination * Math.PI) / 180) * Math.sin((latitude * Math.PI) / 180)) /
        (Math.cos((declination * Math.PI) / 180) * Math.cos((latitude * Math.PI) / 180)),
    )

  // Convert to hours
  const ishaHours = 12 + T - equation / 60 + longitude / 15 - timezone

  // Set time
  ishaDate.setHours(Math.floor(ishaHours))
  ishaDate.setMinutes(Math.round((ishaHours - Math.floor(ishaHours)) * 60))
  ishaDate.setSeconds(0)

  return ishaDate
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

export function formatTimeUntil(ms: number): string {
  if (ms <= 0) return "00:00:00"

  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export { DEFAULT_SETTINGS }

