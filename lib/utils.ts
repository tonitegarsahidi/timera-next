import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeWithSeconds(date: Date | null): string {
  if (date === null) return "Loading clock";

  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(/\./g, " : ");
}

export function formatTimeWithoutSeconds(date: Date): string  {
  if (date === null) return "Loading clock";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  .replace(/\./g, " : "); // Ganti semua titik dengan colon
}
