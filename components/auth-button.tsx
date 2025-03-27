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
  const listenerRef = useRef<boolean>(false) // ⬅️ Cegah duplikasi listener
  const supabase = getSupabaseClient()

  // Ambil user pertama kali
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getSession()

      if (data.session?.user?.id !== userRef.current?.id) {
        userRef.current = data.session?.user || null
        setUser(userRef.current)
        onAuthChange?.(userRef.current)
      }

      setLoading(false)
    }

    checkUser()
  }, []) // ⬅️ Pastikan hanya dipanggil sekali

  // Pastikan `onAuthStateChange` hanya dijalankan sekali
  useEffect(() => {
    if (listenerRef.current) return // ⬅️ Cegah listener dobel

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null

      if (newUser?.id !== userRef.current?.id) {
        userRef.current = newUser
        setUser(newUser)
        onAuthChange?.(newUser)
      }
    })

    listenerRef.current = true // ⬅️ Tandai bahwa listener sudah dibuat

    return () => {
      authListener.subscription.unsubscribe()
      listenerRef.current = false // ⬅️ Reset saat unmount
    }
  }, [onAuthChange]) // ⬅️ Pastikan tidak bergantung ke `supabase`

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
    setUser(null)
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
