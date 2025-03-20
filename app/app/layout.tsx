import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/contexts/app-context"

const inter = Inter({ subsets: ["latin"] })

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  )
}

