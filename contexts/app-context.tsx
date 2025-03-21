"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type PrayerTime,
  type PrayerSettings as PrayerSettingsType,
  calculatePrayerTimes,
  getNextPrayer,
  getTimeUntilNextPrayer,
  type PrayerName,
} from "@/lib/prayer-times"
import { saveSettings, getSettings, saveSlides, getSlides } from "@/lib/db"

// Define the AppPage type
type AppPage = "schedule" | "countdown" | "iqamah" | "blank"

// Define background type
export interface BackgroundSetting {
  type: "color" | "image"
  value: string // hex color or image data URL
}

// Define card style type
export interface CardStyle {
  background: BackgroundSetting
  fontFamily: string
  fontColor: string
}

// Update the PrayerSettings interface to include background settings
export interface PrayerSettings extends PrayerSettingsType {
  mosqueName: string
  mosqueLogo: string
  mosqueDescription: string
  afterIqamahMessage: string
  afterIqamahDuration: number
  fontFamily: string
  fontSize: string
  appBackground: BackgroundSetting
  currentTimeCardStyle: CardStyle
  countdownCardStyle: CardStyle
  prayerCardStyles: {
    [key in PrayerName]: CardStyle
  }
}

interface AppContextType {
  currentPage: AppPage
  prayerTimes: PrayerTime[]
  currentTime: Date
  settings: PrayerSettings
  updateSettings: (settings: PrayerSettings) => void
  nextPrayer: PrayerTime | null
  timeUntilNextPrayer: number
  currentSlideIndex: number
  setCurrentSlideIndex: (index: number) => void
  slides: string[]
  updateSlides: (slides: string[]) => void
  isAdhanTime: boolean
  isIqamahTime: boolean
  iqamahTimeRemaining: number
  afterIqamahTimeRemaining: number
  customText: string
  updateCustomText: (text: string) => void
  customTextStyle: {
    fontSize: number
    color: string
    fontWeight: string
    textAlign: string
  }
  updateCustomTextStyle: (style: any) => void
  forceShowPage: AppPage | null
  setForceShowPage: (page: AppPage | null) => void
  theme: string
  setTheme: (theme: string) => void
}

// Default background settings
const defaultBackground: BackgroundSetting = {
  type: "color",
  value: "transparent",
}

// Default card style
const defaultCardStyle: CardStyle = {
  background: defaultBackground,
  fontFamily: "inherit",
  fontColor: "inherit",
}

// Update the DEFAULT_SETTINGS to include the new fields
const initialSettings: PrayerSettings = {
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
  mosqueName: "Masjid TimerA",
  mosqueLogo: "",
  mosqueDescription: "Jl. Contoh No. 123, Jakarta",
  afterIqamahMessage: "Lurus Rapatkan Shaf",
  afterIqamahDuration: 10,
  fontFamily: "Inter",
  fontSize: "medium",
  appBackground: { type: "color", value: "transparent" },
  currentTimeCardStyle: defaultCardStyle,
  countdownCardStyle: defaultCardStyle,
  prayerCardStyles: {
    Fajr: defaultCardStyle,
    Sunrise: defaultCardStyle,
    Dhuhr: defaultCardStyle,
    Asr: defaultCardStyle,
    Maghrib: defaultCardStyle,
    Isha: defaultCardStyle,
  },
}

// Create a default context value
const defaultContextValue: AppContextType = {
  currentPage: "schedule",
  prayerTimes: [],
  currentTime: new Date(),
  settings: initialSettings,
  updateSettings: () => {},
  nextPrayer: null,
  timeUntilNextPrayer: 0,
  currentSlideIndex: 0,
  setCurrentSlideIndex: () => {},
  slides: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
  updateSlides: () => {},
  isAdhanTime: false,
  isIqamahTime: false,
  iqamahTimeRemaining: 0,
  afterIqamahTimeRemaining: 0,
  customText: "Selamat datang di Masjid kami",
  updateCustomText: () => {},
  customTextStyle: {
    fontSize: 18,
    color: "#50c878",
    fontWeight: "normal",
    textAlign: "center",
  },
  updateCustomTextStyle: () => {},
  forceShowPage: null,
  setForceShowPage: () => {},
  theme: "light",
  setTheme: () => {},
}

// Initialize the context with the default value
const AppContext = createContext<AppContextType>(defaultContextValue)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PrayerSettings>(initialSettings)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [currentPage, setCurrentPage] = useState<AppPage>("schedule")
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null)
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState(0)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [slides, setSlides] = useState<string[]>([
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ])
  const [isAdhanTime, setIsAdhanTime] = useState(false)
  const [isIqamahTime, setIsIqamahTime] = useState(false)
  const [iqamahTimeRemaining, setIqamahTimeRemaining] = useState(0)
  const [afterIqamahTimeRemaining, setAfterIqamahTimeRemaining] = useState(0)
  const [customText, setCustomText] = useState("Selamat datang di Masjid kami")
  const [customTextStyle, setCustomTextStyle] = useState({
    fontSize: 18,
    color: "#50c878",
    fontWeight: "normal",
    textAlign: "center",
  })
  const [forceShowPage, setForceShowPage] = useState<AppPage | null>(null)
  const [isDbInitialized, setIsDbInitialized] = useState(false)
  const [theme, setTheme] = useState("light")

  // Initialize database and load settings
  useEffect(() => {
    const initializeDb = async () => {
      try {
        // Load settings
        const savedSettings = await getSettings("prayerSettings", initialSettings)
        setSettings(savedSettings)

        // Load slides
        const savedSlides = await getSlides()
        if (savedSlides && savedSlides.length > 0) {
          setSlides(savedSlides)
        }

        // Load custom text
        const savedCustomText = await getSettings("customText", "Selamat datang di Masjid kami")
        setCustomText(savedCustomText)

        // Load custom text style
        const savedCustomTextStyle = await getSettings("customTextStyle", {
          fontSize: 18,
          color: "#50c878",
          fontWeight: "normal",
          textAlign: "center",
        })
        setCustomTextStyle(savedCustomTextStyle)

        // Load theme
        const savedTheme = await getSettings("theme", "light")
        setTheme(savedTheme)

        setIsDbInitialized(true)
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }

    initializeDb()
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save theme to database
    if (isDbInitialized) {
      saveSettings("theme", theme)
    }
  }, [theme, isDbInitialized])

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate prayer times
  useEffect(() => {
    const times = calculatePrayerTimes(currentTime, settings)
    setPrayerTimes(times)
  }, [currentTime, settings])

  // Update next prayer and time until next prayer
  useEffect(() => {
    const next = getNextPrayer(prayerTimes)
    setNextPrayer(next)

    if (next) {
      const timeUntil = getTimeUntilNextPrayer(next)
      setTimeUntilNextPrayer(timeUntil)
    } else {
      setTimeUntilNextPrayer(0)
    }
  }, [prayerTimes, currentTime])

  // Rotate slides every 10 seconds
  useEffect(() => {
    if (currentPage === "schedule" && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [currentPage, slides])

  // Page transition logic
  useEffect(() => {
    // If a page is forced to be shown, don't change it automatically
    if (forceShowPage) {
      setCurrentPage(forceShowPage)
      return
    }

    if (!nextPrayer) return

    const timeUntil = getTimeUntilNextPrayer(nextPrayer)

    // 10 minutes before prayer time
    if (timeUntil <= 10 * 60 * 1000 && timeUntil > 0) {
      setCurrentPage("countdown")
    }
    // At prayer time
    else if (timeUntil <= 0 && timeUntil > -2 * 60 * 1000) {
      setIsAdhanTime(true)
    }
    // 2 minutes after prayer time (after adhan)
    else if (timeUntil <= -2 * 60 * 1000 && nextPrayer.name !== "Sunrise") {
      setIsAdhanTime(false)
      setIsIqamahTime(true)

      // Calculate iqamah time remaining
      const iqamahDuration = settings.iqamahTimes[nextPrayer.name as keyof typeof settings.iqamahTimes] * 60 * 1000
      const elapsedSincePrayer = Math.abs(timeUntil) - 2 * 60 * 1000
      const remaining = iqamahDuration - elapsedSincePrayer

      if (remaining > 0) {
        setCurrentPage("iqamah")
        setIqamahTimeRemaining(remaining)
      } else {
        // After iqamah time
        const afterIqamahDuration = settings.afterIqamahDuration * 60 * 1000
        const elapsedSinceIqamah = elapsedSincePrayer - iqamahDuration
        const afterIqamahRemaining = afterIqamahDuration - elapsedSinceIqamah

        if (afterIqamahRemaining > 0) {
          setCurrentPage("iqamah")
          setIqamahTimeRemaining(0)
          setAfterIqamahTimeRemaining(afterIqamahRemaining)
        } else {
          // Show blank page until 30 minutes after prayer time
          const totalElapsed = Math.abs(timeUntil)
          if (totalElapsed < 30 * 60 * 1000) {
            setCurrentPage("blank")
          } else {
            setCurrentPage("schedule")
            setIsIqamahTime(false)
          }
        }
      }
    } else {
      setCurrentPage("schedule")
      setIsAdhanTime(false)
      setIsIqamahTime(false)
    }
  }, [nextPrayer, timeUntilNextPrayer, settings, forceShowPage])

  const updateSettings = async (newSettings: PrayerSettings) => {
    setSettings(newSettings)
    if (isDbInitialized) {
      await saveSettings("prayerSettings", newSettings)
    }
  }

  const updateSlides = async (newSlides: string[]) => {
    setSlides(newSlides)
    if (isDbInitialized) {
      await saveSlides(newSlides)
    }
  }

  const updateCustomText = async (text: string) => {
    setCustomText(text)
    if (isDbInitialized) {
      await saveSettings("customText", text)
    }
  }

  const updateCustomTextStyle = async (style: any) => {
    setCustomTextStyle(style)
    if (isDbInitialized) {
      await saveSettings("customTextStyle", style)
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentPage,
        prayerTimes,
        currentTime,
        settings,
        updateSettings,
        nextPrayer,
        timeUntilNextPrayer,
        currentSlideIndex,
        setCurrentSlideIndex,
        slides,
        updateSlides,
        isAdhanTime,
        isIqamahTime,
        iqamahTimeRemaining,
        afterIqamahTimeRemaining,
        customText,
        updateCustomText,
        customTextStyle,
        updateCustomTextStyle,
        forceShowPage,
        setForceShowPage,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

