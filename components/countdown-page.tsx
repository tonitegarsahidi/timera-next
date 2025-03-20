"use client"

import type React from "react"

import { useAppContext } from "@/contexts/app-context"
import { formatTimeUntil } from "@/lib/prayer-times"
import { useEffect, useState } from "react"
import Image from "next/image"
import type { BackgroundSetting } from "@/contexts/app-context"

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

export function CountdownPage() {
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

