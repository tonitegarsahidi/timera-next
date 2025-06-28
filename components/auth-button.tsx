"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
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
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth"

interface AuthButtonProps {
  onAuthChange?: (user: FirebaseUser | null) => void
}

export function AuthButton({ onAuthChange }: AuthButtonProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const userRef = useRef<FirebaseUser | null>(null)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser?.uid !== userRef.current?.uid) {
        userRef.current = firebaseUser
        setUser(firebaseUser)
        onAuthChange?.(firebaseUser)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [onAuthChange])

  const handleSignIn = async () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
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
              <AvatarImage src={user.photoURL || "/placeholder-user.jpg"} alt={user.displayName || user.email || "User"} />
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>{user.displayName || user.email}</DropdownMenuItem>
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
