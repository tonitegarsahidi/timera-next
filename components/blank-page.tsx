"use client"

import type React from "react"

import { useAppContext } from "@/contexts/app-context"
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

export function BlankPage() {
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

