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
  const [authListener, setAuthListener] = useState<any>(null)

  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession() // Ambil session dari cache
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    checkAuth()

    if (!authListener) {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
      })
      setAuthListener(listener)
    }

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase, authListener])

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
