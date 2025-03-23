"use client";

import { useAppContext } from "@/contexts/app-context";
import { SchedulePage } from "@/components/schedule-page";
import { CountdownPage } from "@/components/countdown-page";
import { IqamahPage } from "@/components/iqamah-page";
import { BlankPage } from "@/components/blank-page";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function AppPage() {
  const { currentPage, forceShowPage, setForceShowPage } = useAppContext();

  const searchParams = useSearchParams();
  const isDebug = searchParams.get("isDebug") === "true"; // Cek apakah isDebug=true

  // If a page is forced to be shown, show it
  const displayPage = forceShowPage || currentPage;

  return (
    <main className="min-h-screen islamic-pattern">
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

      {displayPage === "schedule" && <SchedulePage />}
      {displayPage === "countdown" && <CountdownPage />}
      {displayPage === "iqamah" && <IqamahPage />}
      {displayPage === "blank" && <BlankPage />}

      {isDebug && (
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setForceShowPage("schedule")}
          className="bg-background/80 backdrop-blur-sm"
        >
          Jadwal
        </Button>
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
      )}
    </main>
  );
}
