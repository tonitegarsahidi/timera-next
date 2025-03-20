"use client"

import type React from "react"

import { useAppContext } from "@/contexts/app-context"
import { formatTime, formatTimeUntil } from "@/lib/prayer-times"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ChevronLeft, ChevronRight, Timer, Settings } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import type { BackgroundSetting, CardStyle } from "@/contexts/app-context"

// Helper function to generate background style
function getBackgroundStyle(bg: BackgroundSetting): React.CSSProperties {
  if (bg.type === "color" && bg.value) {
    return { backgroundColor: bg.value }
  } else if (bg.type === "image" && bg.value) {
    return {
      backgroundImage: `url(${bg.value})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }
  return {}
}

// Helper function to generate card style
function getCardStyle(style: CardStyle): React.CSSProperties {
  const bgStyle = getBackgroundStyle(style.background)
  return {
    ...bgStyle,
    fontFamily: style.fontFamily !== "inherit" ? style.fontFamily : undefined,
    color: style.fontColor !== "inherit" ? style.fontColor : undefined,
  }
}

export default function V2Page() {
  const {
    prayerTimes,
    currentTime,
    currentSlideIndex,
    setCurrentSlideIndex,
    slides,
    settings,
    customText,
    nextPrayer,
    timeUntilNextPrayer,
    setForceShowPage,
    currentPage,
    forceShowPage,
  } = useAppContext()

  // If a page is forced to be shown, show it
  const displayPage = forceShowPage || currentPage

  const [isCountdownPage, setIsCountdownPage] = useState(false)
  const [isIqamahPage, setIsIqamahPage] = useState(false)
  const [isBlankPage, setIsBlankPage] = useState(false)
  const [countdown, setCountdown] = useState(timeUntilNextPrayer)

  useEffect(() => {
    setIsCountdownPage(displayPage === "countdown")
    setIsIqamahPage(displayPage === "iqamah")
    setIsBlankPage(displayPage === "blank")
  }, [displayPage])

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Reset countdown when next prayer changes
  useEffect(() => {
    setCountdown(timeUntilNextPrayer)
  }, [timeUntilNextPrayer])

  if (isCountdownPage) {
    return <CountdownPageV2 />
  }

  if (isIqamahPage) {
    return <IqamahPageV2 />
  }

  if (isBlankPage) {
    return <BlankPageV2 />
  }

  const formatTimeWithSeconds = (date: Date): string => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  // Find the current prayer (the most recent prayer that has passed)
  const getCurrentPrayer = () => {
    const now = new Date()
    for (let i = prayerTimes.length - 1; i >= 0; i--) {
      if (prayerTimes[i].time <= now) {
        return prayerTimes[i]
      }
    }
    // If no prayer has passed today, return the last prayer from yesterday
    return prayerTimes[prayerTimes.length - 1]
  }

  const currentPrayer = getCurrentPrayer()

  // Get app background style
  const appBackgroundStyle = getBackgroundStyle(settings.appBackground)

  return (
    <main
      className="min-h-screen flex flex-col"
      style={
        settings.appBackground.type === "color" && settings.appBackground.value === "transparent"
          ? {}
          : appBackgroundStyle
      }
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <ModeToggle />
        <Link
          href="/app/settings"
          className="rounded-full p-2 bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      <header className="w-full bg-primary/10 p-4 text-center">
        <div className="flex items-center justify-center gap-3">
          {settings.mosqueLogo && (
            <div className="relative w-12 h-12">
              <Image
                src={settings.mosqueLogo || "/placeholder.svg"}
                alt="Logo Masjid"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{settings.mosqueName}</h1>
            {settings.mosqueDescription && (
              <p className="text-sm text-muted-foreground">{settings.mosqueDescription}</p>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Current time and next prayer */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Card className="shadow-lg overflow-hidden" style={getCardStyle(settings.currentTimeCardStyle)}>
            <CardContent className="p-6 flex flex-col items-center backdrop-blur-sm bg-background/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-xl font-medium">Waktu Sekarang</span>
              </div>
              <span className="text-5xl font-bold tabular-nums">{formatTimeWithSeconds(currentTime)}</span>
            </CardContent>
          </Card>

          {/* Next Prayer Countdown */}
          {nextPrayer && (
            <Card
              className="shadow-lg bg-primary/5 border-primary overflow-hidden"
              style={getCardStyle(settings.countdownCardStyle)}
            >
              <CardContent className="p-6 flex flex-col items-center backdrop-blur-sm bg-background/30">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-6 w-6 text-primary" />
                  <span className="text-xl font-medium">Menuju {nextPrayer.indonesianName}</span>
                </div>
                <span className="text-4xl font-bold tabular-nums">{formatTimeUntil(countdown)}</span>
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button variant="outline" onClick={() => setForceShowPage("countdown")}>
              Countdown
            </Button>
            <Button variant="outline" onClick={() => setForceShowPage("iqamah")}>
              Iqamah
            </Button>
            <Button variant="outline" onClick={() => setForceShowPage("blank")}>
              Blank
            </Button>
          </div>
        </div>

        {/* Middle - Prayer times */}
        <div className="md:col-span-1 grid grid-cols-1 gap-3">
          {prayerTimes.map((prayer) => {
            // Determine if this is the current prayer
            const isCurrentPrayer = currentPrayer && prayer.name === currentPrayer.name

            // Determine if this is the next prayer
            const isNextPrayer = nextPrayer && prayer.name === nextPrayer.name

            // Get prayer card style
            const prayerCardStyle = settings.prayerCardStyles[prayer.name]

            return (
              <Card
                key={prayer.name}
                className={`prayer-time-card shadow-md overflow-hidden ${
                  isNextPrayer ? "border-2 border-primary" : isCurrentPrayer ? "bg-primary/10" : ""
                }`}
                style={getCardStyle(prayerCardStyle)}
              >
                <CardContent className="p-3 flex justify-between items-center backdrop-blur-sm bg-background/30">
                  <div className="flex flex-col">
                    <span className="text-lg font-medium">{prayer.indonesianName}</span>
                    <span className="text-xs text-muted-foreground">{prayer.arabicName}</span>
                  </div>
                  <span className="text-xl font-bold tabular-nums">{formatTime(prayer.time)}</span>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Right side - Slides */}
        <div className="md:col-span-1 flex flex-col">
          <div className="relative w-full" style={{ paddingTop: "75%" }}>
            <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden bg-card shadow-lg">
              {slides.length > 0 && (
                <div className="relative w-full h-full">
                  <Image
                    src={slides[currentSlideIndex] || "/placeholder.svg?height=600&width=800"}
                    alt="Slide"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Slide pagination */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs">
                  {currentSlideIndex + 1} / {slides.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Custom text below slide */}
          <div className="mt-4 p-4 bg-card rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: customText }} />
        </div>
      </div>
      {/* Tambahkan tombol navigasi di bagian bawah */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setForceShowPage("countdown")}
          className="bg-background/80 backdrop-blur-sm"
        >
          Countdown
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setForceShowPage("iqamah")}
          className="bg-background/80 backdrop-blur-sm"
        >
          Iqamah
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setForceShowPage("blank")}
          className="bg-background/80 backdrop-blur-sm"
        >
          Blank
        </Button>
      </div>
    </main>
  )
}

// V2 Countdown Page
function CountdownPageV2() {
  const { nextPrayer, timeUntilNextPrayer, settings } = useAppContext()
  const [countdown, setCountdown] = useState(timeUntilNextPrayer)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setCountdown(timeUntilNextPrayer)
  }, [timeUntilNextPrayer])

  // Get app background style
  const appBackgroundStyle = getBackgroundStyle(settings.appBackground)

  // Get font style
  const fontStyle = {
    fontFamily:
      settings.countdownCardStyle.fontFamily !== "inherit" ? settings.countdownCardStyle.fontFamily : undefined,
    color: settings.countdownCardStyle.fontColor !== "inherit" ? settings.countdownCardStyle.fontColor : undefined,
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center countdown-container"
      style={
        settings.appBackground.type === "color" && settings.appBackground.value === "transparent"
          ? {}
          : appBackgroundStyle
      }
    >
      <header className="w-full bg-primary/10 p-4 text-center">
        <div className="flex items-center justify-center gap-3">
          {settings.mosqueLogo && (
            <div className="relative w-12 h-12">
              <Image
                src={settings.mosqueLogo || "/placeholder.svg"}
                alt="Logo Masjid"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{settings.mosqueName}</h1>
            {settings.mosqueDescription && (
              <p className="text-sm text-muted-foreground">{settings.mosqueDescription}</p>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8" style={fontStyle}>
        <h2 className="text-4xl md:text-6xl font-bold mb-8">Bersiap untuk Sholat {nextPrayer?.indonesianName}</h2>

        <div className="text-7xl md:text-9xl font-bold tabular-nums mb-8">{formatTimeUntil(countdown)}</div>

        <p className="text-2xl md:text-3xl text-muted-foreground">
          {countdown > 0 ? "Persiapkan diri untuk sholat" : "Waktunya Adzan"}
        </p>
      </div>
    </div>
  )
}

// V2 Iqamah Page
function IqamahPageV2() {
  const { nextPrayer, settings, iqamahTimeRemaining, afterIqamahTimeRemaining } = useAppContext()

  const [countdown, setCountdown] = useState(iqamahTimeRemaining)
  const isAfterIqamah = iqamahTimeRemaining <= 0

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isAfterIqamah) {
      setCountdown(afterIqamahTimeRemaining)
    } else {
      setCountdown(iqamahTimeRemaining)
    }
  }, [iqamahTimeRemaining, afterIqamahTimeRemaining, isAfterIqamah])

  // Get app background style
  const appBackgroundStyle = getBackgroundStyle(settings.appBackground)

  // Get font style for the prayer that's currently in iqamah
  const fontStyle = nextPrayer
    ? {
        fontFamily:
          settings.prayerCardStyles[nextPrayer.name].fontFamily !== "inherit"
            ? settings.prayerCardStyles[nextPrayer.name].fontFamily
            : undefined,
        color:
          settings.prayerCardStyles[nextPrayer.name].fontColor !== "inherit"
            ? settings.prayerCardStyles[nextPrayer.name].fontColor
            : undefined,
      }
    : {}

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center countdown-container"
      style={
        settings.appBackground.type === "color" && settings.appBackground.value === "transparent"
          ? {}
          : appBackgroundStyle
      }
    >
      <header className="w-full bg-primary/10 p-4 text-center">
        <div className="flex items-center justify-center gap-3">
          {settings.mosqueLogo && (
            <div className="relative w-12 h-12">
              <Image
                src={settings.mosqueLogo || "/placeholder.svg"}
                alt="Logo Masjid"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{settings.mosqueName}</h1>
            {settings.mosqueDescription && (
              <p className="text-sm text-muted-foreground">{settings.mosqueDescription}</p>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8" style={fontStyle}>
        {!isAfterIqamah ? (
          <>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Iqamah {nextPrayer?.indonesianName}</h2>

            <div className="text-7xl md:text-9xl font-bold tabular-nums mb-8">{formatTimeUntil(countdown)}</div>

            <p className="text-2xl md:text-3xl text-muted-foreground">Bersiap untuk sholat berjamaah</p>
          </>
        ) : (
          <h2 className="text-4xl md:text-6xl font-bold text-center">{settings.afterIqamahMessage}</h2>
        )}
      </div>
    </div>
  )
}

// V2 Blank Page
function BlankPageV2() {
  const { settings } = useAppContext()

  // Get app background style
  const appBackgroundStyle = getBackgroundStyle(settings.appBackground)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center islamic-pattern"
      style={
        settings.appBackground.type === "color" && settings.appBackground.value === "transparent"
          ? {}
          : appBackgroundStyle
      }
    >
      <div className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          {settings.mosqueLogo ? (
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={settings.mosqueLogo || "/placeholder.svg"}
                alt={settings.mosqueName}
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="mosque-dome"></div>
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{settings.mosqueName}</h1>
        {settings.mosqueDescription && (
          <p className="text-lg md:text-xl text-muted-foreground mb-4">{settings.mosqueDescription}</p>
        )}
        <p className="text-xl md:text-2xl text-muted-foreground">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
      </div>
    </div>
  )
}

