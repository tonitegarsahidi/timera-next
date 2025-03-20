"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 islamic-pattern">
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-6">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
        <Link href="/">
          <Button className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  )
}

