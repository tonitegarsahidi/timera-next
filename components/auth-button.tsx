"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase"
import { User, LogOut, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AuthButtonProps {
  onAuthChange?: (user: SupabaseUser | null) => void
}

export function AuthButton({ onAuthChange }: AuthButtonProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const userRef = useRef<SupabaseUser | null>(null)
  const supabase = getSupabaseClient()

  // 1️⃣ Hanya ambil user pertama kali
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      // Update hanya jika user berubah
      if (user?.id !== userRef.current?.id) {
        userRef.current = user
        setUser(user)
        if (onAuthChange) onAuthChange(user)
      }
      setLoading(false)
    }

    checkUser()
  }, []) // ⬅️ Hanya dijalankan sekali saat mount

  // 2️⃣ Hanya update user jika `onAuthStateChange` berubah
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null

        // Hindari update jika user tidak berubah
        if (newUser?.id !== userRef.current?.id) {
          userRef.current = newUser
          setUser(newUser)
          if (onAuthChange) onAuthChange(newUser)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [onAuthChange]) // ⬅️ Tidak pakai `supabase`, agar tidak trigger loop

  const handleSignIn = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    })
  }

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
              <AvatarFallback>{user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>{user.user_metadata.full_name || user.email}</DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleSignIn} variant="outline">
      <User className="mr-2 h-4 w-4" />
      Masuk dengan Google
    </Button>
  )
}
