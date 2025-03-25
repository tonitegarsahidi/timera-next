"use client"

import { useState, useEffect } from "react"
import { AppProvider } from "@/contexts/app-context"
import { SettingsContent } from "@/components/settings-content"

import { getSupabaseClient } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Login } from "@/components/login"

export default function AppSettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) return null

  return user ? (
    <AppProvider>
      <SettingsContent />
    </AppProvider>
  ) : (
    <AppProvider>
      <Login />
    </AppProvider>
  )
}
