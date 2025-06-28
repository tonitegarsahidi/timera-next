"use client"

import { useState, useEffect } from "react"
import { AppProvider } from "@/contexts/app-context"
import { SettingsContent } from "@/components/settings-content"

import { auth } from "@/lib/firebase"
import { User, onAuthStateChanged } from "firebase/auth"
import { Login } from "@/components/login"

export default function AppSettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
