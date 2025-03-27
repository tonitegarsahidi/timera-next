import { createClient } from "@supabase/supabase-js"
import type { PrayerSettings } from "@/contexts/app-context"
import { SlideItem } from "./db"

// Membuat client Supabase untuk sisi client
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  })
}

// Singleton pattern untuk client-side Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    console.log("Initializing Supabase Client") // Tambahkan log untuk debug
    supabaseClient = createSupabaseClient()
  }
  return supabaseClient
}

// Membuat client Supabase untuk sisi server
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Fungsi untuk menyimpan pengaturan ke Supabase
export async function saveSettingsToSupabase(userId: string, settings: PrayerSettings) {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      settings: settings,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    },
  )

  if (error) {
    console.error("Error saving settings to Supabase:", error)
    throw error
  }

  return true
}

// Fungsi untuk mengambil pengaturan dari Supabase
export async function getSettingsFromSupabase(userId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("user_settings").select("settings").eq("user_id", userId).single()

  if (error) {
    console.error("Error getting settings from Supabase:", error)
    return null
  }

  return data?.settings
}

// Fungsi untuk menyimpan slides ke Supabase
export async function saveSlidesToSupabase(userId: string, slides: SlideItem[]) {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("user_slides").upsert(
    {
      user_id: userId,
      slides: JSON.stringify(slides), // Simpan sebagai JSON
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  )

  if (error) {
    console.error("Error saving slides to Supabase:", error)
    throw error
  }

  return true
}

export async function getSlidesFromSupabase(userId: string): Promise<SlideItem[] | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("user_slides").select("slides").eq("user_id", userId).single()

  if (error) {
    console.error("Error getting slides from Supabase:", error)
    return null
  }

  return data?.slides ? JSON.parse(data.slides) : []
}


