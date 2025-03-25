"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { syncSettingsWithDexie, syncSlidesWithDexie } from "@/lib/db"
import { getSupabaseClient } from "@/lib/supabase"
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js"

export default function Auth() {
  const supabase = getSupabaseClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          syncSettingsWithDexie(session.user.id)
          syncSlidesWithDexie(session.user.id)

          // Redirect ke halaman utama setelah login sukses
          router.replace("/")
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  // Jika masih loading, tampilkan indikator atau kosongkan
  if (loading) return <p>Loading...</p>

  return <div>
  <h1>Auth Page</h1>
  {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : <p>Loading user...</p>}
</div>
}
