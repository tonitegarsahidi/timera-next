"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/contexts/app-context"
import {
  saveSettingsToFirestore,
  saveSlidesToFirestore,
  getSettingsFromFirestore,
  getSlidesFromFirestore,
} from "@/lib/firestore" // Mengubah import ke firestore
import { Cloud, Download, Upload, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { User } from "firebase/auth" // Mengubah tipe User ke Firebase User

interface SyncSettingsButtonProps {
  user: User | null
}

export function SyncSettingsButton({ user }: SyncSettingsButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { settings, updateSettings, slides, updateSlides } = useAppContext()

  if (!user) {
    return null
  }

  const handleUploadSettings = async () => {
    try {
      setLoading(true)
      await saveSettingsToFirestore(user.uid, settings) // Menggunakan user.uid
      await saveSlidesToFirestore(user.uid, slides) // Menggunakan user.uid
      toast({
        title: "Sinkronisasi berhasil",
        description: "Pengaturan dan slide berhasil disimpan ke cloud",
      })
    } catch (error) {
      console.error("Error uploading settings:", error)
      toast({
        title: "Gagal menyimpan pengaturan",
        description: "Terjadi kesalahan saat menyimpan pengaturan ke cloud",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadSettings = async () => {
    try {
      setLoading(true)
      const savedSettings = await getSettingsFromFirestore(user.uid) // Menggunakan user.uid
      const savedSlides = await getSlidesFromFirestore(user.uid) // Menggunakan user.uid

      if (savedSettings) {
        updateSettings(savedSettings)
      }

      if (savedSlides) {
        updateSlides(savedSlides)
      }

      toast({
        title: "Pengaturan diambil",
        description: "Pengaturan dan slide berhasil diambil dari cloud",
      })
    } catch (error) {
      console.error("Error downloading settings:", error)
      toast({
        title: "Gagal mengambil pengaturan",
        description: "Terjadi kesalahan saat mengambil pengaturan dari cloud",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Sinkronisasi...
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Cloud className="mr-2 h-4 w-4" />
          Sinkronisasi Pengaturan
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUploadSettings}>
          <Upload className="mr-2 h-4 w-4" />
          <span>Simpan ke Cloud</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadSettings}>
          <Download className="mr-2 h-4 w-4" />
          <span>Ambil dari Cloud</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

