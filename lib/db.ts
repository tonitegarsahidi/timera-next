import Dexie, { type Table } from "dexie"
import { PrayerSettings } from "@/contexts/app-context"
import {
  getSettingsFromFirestore,
  saveSettingsToFirestore,
  getSlidesFromFirestore,
  saveSlidesToFirestore,
} from "./firestore"

// Define interfaces for our database tables
export interface SlideItem {
  id?: number
  src: string // Mengubah imageData menjadi src agar konsisten dengan app-context
  order: number
}

export interface Settings {
  id?: string
  key: string // Pastikan 'key' ada dan diindeks
  value: any
}

// Define the database
class MosqueTimerDB extends Dexie {
  slides!: Table<SlideItem, number> // Menggunakan number untuk id
  settings!: Table<Settings, string> // Menggunakan string untuk id

  constructor() {
    super("TimeraDB")
    this.version(3).stores({ // Meningkatkan versi database ke 3
      slides: "++id, order",
      settings: "&id, key", // Menambahkan 'key' sebagai indeks eksplisit
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
    await db.settings.add({ id: key, key, value }) // Menambahkan 'id: key'
  }
}

export async function getSettings(key: string, defaultValue: any = null): Promise<any> {
  const setting = await db.settings.where("key").equals(key).first()
  return setting ? setting.value : defaultValue
}

export async function saveSlides(slides: SlideItem[]): Promise<void> { // Mengubah tipe parameter menjadi SlideItem[]
  // Clear existing slides
  await db.slides.clear()

  // Add new slides
  await db.slides.bulkAdd(slides) // Langsung tambahkan slides
}

export async function getSlides(): Promise<SlideItem[]> { // Mengubah tipe return menjadi SlideItem[]
  return await db.slides.orderBy("order").toArray()
}

// Sync settings dari Firestore ke Dexie.js
export async function syncSettingsWithDexie(userId: string) {
  try {
    const remoteSettings = await getSettingsFromFirestore(userId)
    if (remoteSettings) {
      await db.settings.put({ id: "prayerSettings", key: "prayerSettings", value: remoteSettings })
      console.log("Settings synced from Firestore to Dexie.js")
    } else {
      console.log("No remote settings found for user, checking local settings.")
      const localSettings = await db.settings.get("prayerSettings")
      if (localSettings && localSettings.value) {
        await saveSettingsToFirestore(userId, localSettings.value)
        console.log("Local settings synced from Dexie.js to Firestore")
      }
    }
  } catch (error) {
    console.error("Error syncing settings with Firestore:", error)
  }
}

export async function syncSlidesWithDexie(userId: string) {
  try {
    const remoteSlides = await getSlidesFromFirestore(userId)
    if (remoteSlides && remoteSlides.length > 0) {
      await db.slides.clear()
      await db.slides.bulkAdd(remoteSlides) // remoteSlides sudah SlideItem[]
      console.log("Slides synced from Firestore to Dexie.js")
    } else {
      console.log("No remote slides found for user, checking local slides.")
      const localSlides = await db.slides.orderBy("order").toArray()
      if (localSlides && localSlides.length > 0) {
        await saveSlidesToFirestore(userId, localSlides) // localSlides sudah SlideItem[]
        console.log("Local slides synced from Dexie.js to Firestore")
      }
    }
  } catch (error) {
    console.error("Error syncing slides with Firestore:", error)
  }
}
