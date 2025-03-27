"use client";

import type React from "react";

import { useAppContext } from "@/contexts/app-context";
import { formatTimeUntilMinutes, getPreviousPrayer } from "@/lib/prayer-times";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { BackgroundSetting } from "@/contexts/app-context";
import { formatTimeWithoutSeconds, formatTimeWithSeconds } from "@/lib/utils";

// Helper function to generate background style
function getBackgroundStyle(bg: BackgroundSetting): React.CSSProperties {
  if (bg.type === "color" && bg.value) {
    return { backgroundColor: bg.value };
  } else if (bg.type === "image" && bg.value) {
    return {
      backgroundImage: `url(${bg.value})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
}

export function IqamahPage() {
  const {
    nextPrayer,
    previousPrayer,
    settings,
    iqamahTimeRemaining,
    afterIqamahTimeRemaining,
    isAdhanTime,
    currentTime
  } = useAppContext();

  const [countdown, setCountdown] = useState(iqamahTimeRemaining);
  const isAfterIqamah = iqamahTimeRemaining <= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAfterIqamah) {
      setCountdown(afterIqamahTimeRemaining);
    } else {
      setCountdown(iqamahTimeRemaining);
    }
  }, [iqamahTimeRemaining, afterIqamahTimeRemaining, isAfterIqamah]);

  // Get app background style
  const appBackgroundStyle = getBackgroundStyle(settings.appBackground);

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
    : {};

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center countdown-container"
      style={
        settings.appBackground.type === "color" &&
        settings.appBackground.value === "transparent"
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
              <p className="text-sm text-muted-foreground">
                {settings.mosqueDescription}
              </p>
            )}
          </div>
        </div>
      </header>

      <div
        className="flex-1 flex flex-col items-center justify-center p-8"
        style={fontStyle}
      >
        {!isAfterIqamah ? (
          <>
            {isAdhanTime ? (
              <h1 className="text-4xl md:text-6xl font-bold mb-8">
                Adzan {previousPrayer?.indonesianName}
              </h1>
            ) : (
              <>
                <h2 className="text-4xl sm:text-4xl md:text-8xl font-bold mb-8">
                  Iqamah {previousPrayer?.indonesianName}
                </h2>
                <div className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[20rem] font-bold tabular-nums leading-none mb-8">

                  {formatTimeUntilMinutes(countdown)}
                </div>
                <p className="text-2xl md:text-4xl text-muted-foreground">
                  Bersiap untuk sholat berjamaah
                </p>
              </>
            )}
          </>
        ) : (
          <>
          <h2 className="text-4xl md:text-9xl font-bold text-center">
            {settings.afterIqamahMessage}
          </h2>
          
          <p className="text-2xl md:text-8xl text-muted-foreground mt-20">
            {formatTimeWithSeconds(currentTime)}
                </p>
          </>
        )}
      </div>
    </div>
  );
}
