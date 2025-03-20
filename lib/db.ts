import Dexie, { type Table } from "dexie"

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

