"use client"

import { Button } from "@/components/ui/button"
import { User, Loader2 } from "lucide-react"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

export function Login() {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      // Tidak perlu setLoading(false) karena user akan diarahkan ke halaman lain
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setLoading(false) // Set loading ke false jika ada error
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="mb-4 text-xl font-semibold">Masuk untuk Mengakses Pengaturan</h2>
      <Button onClick={handleSignIn} variant="outline" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memuat...
          </>
        ) : (
          <>
            <User className="mr-2 h-4 w-4" />
            Masuk dengan Google
          </>
        )}
      </Button>
    </div>
  )
}
