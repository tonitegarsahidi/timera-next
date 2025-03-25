"use client"

import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase"
import { User, Loader2 } from "lucide-react"
import { useState } from "react"

export function Login() {
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseClient()

  const handleSignIn = async () => {
    setLoading(true)

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`, // Dinamis, berfungsi di lokal & produksi
      },
    })

    // Tidak perlu setLoading(false) karena user akan diarahkan ke halaman lain
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
