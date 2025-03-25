"use client"

import type React from "react"

import { useAppContext } from "@/contexts/app-context"
import { formatTime, formatTimeUntil } from "@/lib/prayer-times"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ChevronLeft, ChevronRight, Timer } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { BackgroundSetting, CardStyle } from "@/contexts/app-context"
import { formatTimeWithSeconds } from "@/lib/utils"

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

export function SchedulePage() {
  const {
    prayerTimes,
    currentTime,
    currentSlideIndex,
    setCurrentSlideIndex,
    slides,
    settings,
    customText,
    nextPrayer,
    previousPrayer,
    timeUntilNextPrayer,
    setForceShowPage,
  } = useAppContext()

  const [countdown, setCountdown] = useState(timeUntilNextPrayer)

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Reset countdown when next prayer changes
  useEffect(() => {
    setCountdown(timeUntilNextPrayer)
  }, [timeUntilNextPrayer])


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
    <div
      className="min-h-screen flex flex-col"
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

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Left side - Slides (2/3 of screen) */}
        <div className="md:w-2/3 flex flex-col">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {" "}
            {/* 16:9 Aspect Ratio */}
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

              {/* Page navigation */}
              {/* <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setForceShowPage("countdown")}>
                  Countdown
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setForceShowPage("iqamah")}>
                  Iqamah
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setForceShowPage("blank")}>
                  Blank
                </Button>
              </div> */}
            </div>
          </div>

          {/* Custom text below slide */}
          <div className="mt-4 p-4 bg-card rounded-lg shadow-md" dangerouslySetInnerHTML={{ __html: customText }} />
        </div>

        {/* Right side - Prayer times (1/3 of screen) */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <Card className="shadow-lg overflow-hidden" style={getCardStyle(settings.currentTimeCardStyle)}>
            <CardContent className="p-4 flex flex-col items-center backdrop-blur-sm bg-background/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">Waktu Sekarang</span>
              </div>
              <span className="text-4xl font-bold tabular-nums">{formatTimeWithSeconds(currentTime)}</span>
            </CardContent>
          </Card>

          {/* Next Prayer Countdown */}
          {nextPrayer && (
            <Card
              className="shadow-lg bg-primary/5 border-primary overflow-hidden"
              style={getCardStyle(settings.countdownCardStyle)}
            >
              <CardContent className="p-4 flex flex-col items-center backdrop-blur-sm bg-background/30">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">Menuju {nextPrayer.indonesianName}</span>
                </div>
                <span className="text-3xl font-bold tabular-nums">{formatTimeUntil(countdown)}</span>
              </CardContent>
            </Card>
          )}

          <div className="flex-1 grid grid-cols-1 gap-4">
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
                  <CardContent className="p-4 flex justify-between items-center backdrop-blur-sm bg-background/30">
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{prayer.indonesianName}</span>
                      <span className="text-muted-foreground">{prayer.arabicName}</span>
                    </div>
                    <span className="text-xl font-bold tabular-nums">{formatTime(prayer.time)}</span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

