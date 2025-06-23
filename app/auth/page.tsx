"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { syncSettingsWithDexie, syncSlidesWithDexie } from "@/lib/db"
import { auth } from "@/lib/firebase"
import { User, onAuthStateChanged } from "firebase/auth"

export default function Auth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "SIGNED_IN" : "SIGNED_OUT") // Debugging
      setUser(firebaseUser)

      if (firebaseUser) {
        // Pastikan user ID tersedia sebelum sinkronisasi
        await syncSettingsWithDexie(firebaseUser.uid)
        await syncSlidesWithDexie(firebaseUser.uid)
        router.replace("/")
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [router])

  // Jika masih loading, tampilkan indikator atau kosongkan
  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Auth Page</h1>
      {user ? (
        <pre>Please wait, we will redirect you... </pre>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  )
}
