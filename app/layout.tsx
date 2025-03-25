"use client"
import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const [user, setUser] = useState<User | null>(null)
  // const [loading, setLoading] = useState(true) // Tambahkan state loading

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setLoading(true) // Mulai loading
  //     const { data: { session } } = await supabase.auth.getSession()

  //     if (session?.user) {
  //       setUser(session.user)
  //       syncSettingsWithDexie(session.user.id)
  //       syncSlidesWithDexie(session.user.id)
  //     }

  //     setLoading(false) // Selesai loading
  //   }

  //   // setLoading(true)

  //   checkAuth()

  //   const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
  //     setUser(session?.user ?? null)

  //     if (session?.user) {
  //       syncSettingsWithDexie(session.user.id)
  //       syncSlidesWithDexie(session.user.id)
  //     }
  //   })

  //   return () => {
  //     authListener.subscription.unsubscribe()
  //   }
  // }, [])

  // // Hindari render saat masih loading
  // if (loading) return null

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
