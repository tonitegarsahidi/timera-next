"use client"

import { AppProvider } from "@/contexts/app-context"
import { SettingsContent } from "@/components/settings-content"

export default function AppSettingsPage() {
  return (
    <AppProvider>
      <SettingsContent />
    </AppProvider>
  )
}

