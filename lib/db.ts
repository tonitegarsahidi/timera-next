import Dexie, { type Table } from "dexie"
import { getSettingsFromSupabase, getSlidesFromSupabase, saveSettingsToSupabase, saveSlidesToSupabase } from "./supabase"
import { PrayerSettings } from "@/contexts/app-context"


// Define interfaces for our database tables
export interface SlideItem {
  id?: number
  imageData: string
  order: number
}

export interface Settings {
  id?: number
  key: string
  value: any
}

// Define the database
class MosqueTimerDB extends Dexie {
  slides!: Table<SlideItem>
  settings!: Table<Settings>

  constructor() {
    super("MosqueTimerDB")
    this.version(1).stores({
      slides: "++id, order",
      settings: "++id, key",
    })
  }
}

export const db = new MosqueTimerDB()

// Helper functions for database operations
export async function saveSettings(key: string, value: any): Promise<void> {
  const existingSetting = await db.settings.where("key").equals(key).first()

  if (existingSetting) {
    await db.settings.update(existingSetting.id!, { value })
  } else {
    await db.settings.add({ key, value })
  }
}

export async function getSettings(key: string, defaultValue: any = null): Promise<any> {
  const setting = await db.settings.where("key").equals(key).first()
  return setting ? setting.value : defaultValue
}

export async function saveSlides(slides: string[]): Promise<void> {
  // Clear existing slides
  await db.slides.clear()

  // Add new slides
  const slideItems = slides.map((imageData, index) => ({
    imageData,
    order: index,
  }))

  await db.slides.bulkAdd(slideItems)
}

export async function getSlides(): Promise<string[]> {
  const slideItems = await db.slides.orderBy("order").toArray()
  return slideItems.map((item) => item.imageData)
}

// Sync settings dari Supabase ke Dexie.js
export async function syncSettingsWithDexie(userId: string) {
  const settings = await getSettingsFromSupabase(userId)

  if (settings) {
    for (const key in settings) {
      await db.settings.put({ key, value: settings[key] })
    }
  }
}

// Sync settings dari Dexie.js ke Supabase
// Sync settings dari Dexie.js ke Supabase
export async function syncSettingsToSupabase(userId: string) {
  const settingsArray = await db.settings.toArray()

  // Pastikan acc memiliki tipe yang bisa menerima key-value
  const settingsObj: Partial<PrayerSettings> = settingsArray.reduce(
    (acc, setting) => {
      return {
        ...acc,
        [setting.key]: setting.value,
      }
    },
    {} as Partial<PrayerSettings>,
  )

  // Validasi apakah settingsObj sudah sesuai dengan PrayerSettings
  if (!isValidPrayerSettings(settingsObj)) {
    console.error("Invalid settings object:", settingsObj)
    return
  }

  await saveSettingsToSupabase(userId, settingsObj as PrayerSettings)
}

// Fungsi validasi untuk memastikan settingsObj cocok dengan PrayerSettings
function isValidPrayerSettings(obj: Partial<PrayerSettings>): obj is PrayerSettings {
  return (
    typeof obj.mosqueName === "string" &&
    typeof obj.afterIqamahMessage === "string" &&
    typeof obj.afterIqamahDuration === "number" &&
    typeof obj.coordinates?.latitude === "number" &&
    typeof obj.coordinates?.longitude === "number" &&
    typeof obj.cityName === "string" &&
    typeof obj.calculationMethod === "string" &&
    obj.adjustments !== undefined &&
    obj.iqamahTimes !== undefined
  )
}


// Sync slides dari Supabase ke Dexie.js
export async function syncSlidesWithDexie(userId: string) {
  const slides: string[] | null = await getSlidesFromSupabase(userId)

  if (slides) {
    await db.slides.clear()
    await db.slides.bulkAdd(
      slides.map((imageData: string, index: number) => ({ imageData, order: index }))
    )
  }
}


// Sync slides dari Dexie.js ke Supabase
export async function syncSlidesToSupabase(userId: string) {
  const slides = await db.slides.orderBy("order").toArray()
  await saveSlidesToSupabase(userId, slides.map((s) => s.imageData))
}
