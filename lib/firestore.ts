import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import type { PrayerSettings } from "@/contexts/app-context";
import { SlideItem } from "./db";

// Fungsi untuk menyimpan pengaturan ke Firestore
export async function saveSettingsToFirestore(
  userId: string,
  settings: PrayerSettings
) {
  try {
    const userSettingsRef = doc(db, "user_settings", userId);
    await setDoc(userSettingsRef, { settings, updated_at: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving settings to Firestore:", error);
    throw error;
  }
}

// Fungsi untuk mengambil pengaturan dari Firestore
export async function getSettingsFromFirestore(userId: string) {
  try {
    const userSettingsRef = doc(db, "user_settings", userId);
    const docSnap = await getDoc(userSettingsRef);

    if (docSnap.exists()) {
      return docSnap.data().settings;
    } else {
      console.log("No such document for user settings!");
      return null;
    }
  } catch (error) {
    console.error("Error getting settings from Firestore:", error);
    return null;
  }
}

// Fungsi untuk menyimpan slides ke Firestore
export async function saveSlidesToFirestore(userId: string, slides: SlideItem[]) {
  try {
    const userSlidesRef = doc(db, "user_slides", userId);
    await setDoc(userSlidesRef, { slides, updated_at: new Date().toISOString() }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving slides to Firestore:", error);
    throw error;
  }
}

// Fungsi untuk mengambil slides dari Firestore
export async function getSlidesFromFirestore(userId: string): Promise<SlideItem[] | null> {
  try {
    const userSlidesRef = doc(db, "user_slides", userId);
    const docSnap = await getDoc(userSlidesRef);

    if (docSnap.exists()) {
      return docSnap.data().slides;
    } else {
      console.log("No such document for user slides!");
      return null;
    }
  } catch (error) {
    console.error("Error getting slides from Firestore:", error);
    return null;
  }
  
}