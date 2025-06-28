"use client";

import type React from "react";

import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { calculatePrayerTimes, type PrayerName } from "@/lib/prayer-times";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Upload, X, Minus, Plus, Sun, Moon, Locate } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text-editor";
import { CardCustomizer } from "@/components/card-customizer";
import type { CardStyle } from "@/contexts/app-context";
import type { CalculationMethodName } from "@/lib/prayer-times";
import { AuthButton } from "@/components/auth-button";
import { SyncSettingsButton } from "@/components/sync-settings-button";
import type { User } from "firebase/auth"; // Mengubah tipe User ke Firebase User
import MapboxMap from "@/components/MapboxMap";
import { useRouter } from "next/navigation";
import { commonFonts } from "@/lib/ui-setting";
import { SlideItem } from "@/lib/db"; // Menambahkan import SlideItem

// Update the SettingsContent function to include the new fields and functionality
export function SettingsContent() {
  const {
    settings,
    updateSettings,
    slides,
    updateSlides,
    customText,
    updateCustomText,
    customTextStyle,
    updateCustomTextStyle,
    setForceShowPage,
    theme,
    setTheme,
    prayerTimes,
  } = useAppContext();

  const [localSettings, setLocalSettings] = useState(settings);
  const [localSlides, setLocalSlides] = useState<SlideItem[]>(slides); // Mengubah tipe localSlides
  const [localCustomText, setLocalCustomText] = useState(customText);
  const [localCustomTextStyle, setLocalCustomTextStyle] =
    useState(customTextStyle);
  const [richTextContent, setRichTextContent] = useState(
    "<p>Selamat datang di Masjid kami</p>"
  );

  // const [originalPrayerTimes, setOriginalPrayerTimes] = useState<Record<PrayerName, string>>({
  //   Fajr: "04:30",
  //   Sunrise: "06:00",
  //   Dhuhr: "12:00",
  //   Asr: "15:00",
  //   Maghrib: "18:00",
  //   Isha: "19:30",
  // })

  const [adjustedPrayerTimes, setAdjustedPrayerTimes] = useState<
    Record<PrayerName, string>
  >({
    Fajr: "",
    Sunrise: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const [originalPrayerTimes, setOriginalPrayerTimes] = useState<
    Record<PrayerName, string>
  >({
    Fajr: "",
    Sunrise: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const router = useRouter();

  // MEMBUAT WAKTU ORIGINAL TANPA DI APPLY ADJUSTMENT
  useEffect(() => {
    const currentTime = new Date();
    const originalTimes = calculatePrayerTimes(currentTime, settings, false);

    if (!originalTimes || !Array.isArray(originalTimes)) return;

    const originalPrayerTimesRecord: Record<PrayerName, string> = {
      Fajr: "",
      Sunrise: "",
      Dhuhr: "",
      Asr: "",
      Maghrib: "",
      Isha: "",
    };

    originalTimes.forEach((time) => {
      if (time?.name && time?.time) {
        originalPrayerTimesRecord[time.name] = time.time.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      }
    });

    setOriginalPrayerTimes(originalPrayerTimesRecord);
  }, [prayerTimes]);

  // MENGHITUNG ULANG WAKTU YANG DENGAN ADJUSTMENT
  useEffect(() => {
    if (prayerTimes) {
      const prayerTimesRecord: Record<PrayerName, string> = {
        Fajr: "",
        Sunrise: "",
        Dhuhr: "",
        Asr: "",
        Maghrib: "",
        Isha: "",
      };
      prayerTimes.forEach((prayerTime) => {
        prayerTimesRecord[prayerTime.name] = prayerTime.time.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      });

      setAdjustedPrayerTimes(prayerTimesRecord);
    }
  }, [prayerTimes]);

  // useEffect(() => {
  //   setAdjustedPrayerTimes(originalPrayerTimes);
  // }, [originalPrayerTimes]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  useEffect(() => {
    setLocalCustomText(customText);
    setRichTextContent(customText);
  }, [customText]);

  useEffect(() => {
    setLocalCustomTextStyle(customTextStyle);
  }, [customTextStyle]);

  // Calculate adjusted prayer times based on original times and adjustments
  useEffect(() => {
    const newAdjustedTimes: Record<PrayerName, string> = {} as Record<
      PrayerName,
      string
    >;

    Object.entries(adjustedPrayerTimes).forEach(([prayer, timeStr]) => {
      const prayerName = prayer as PrayerName;
      const adjustment = localSettings.adjustments[prayerName];

      // Parse the time string
      const [hours, minutes] = timeStr.split(":").map(Number);

      // Create a date object to handle time calculations
      const date = new Date();
      date.setHours(hours, minutes + adjustment, 0);

      // Format the adjusted time
      const adjustedHours = date.getHours().toString().padStart(2, "0");
      const adjustedMinutes = date.getMinutes().toString().padStart(2, "0");

      newAdjustedTimes[prayerName] = `${adjustedHours}:${adjustedMinutes}`;
    });

    // setAdjustedPrayerTimes(newAdjustedTimes)
  }, [adjustedPrayerTimes, localSettings.adjustments]);

  const handleSave = () => {
    updateSettings(localSettings);
    updateSlides(localSlides);
    updateCustomText(richTextContent);
    updateCustomTextStyle(localCustomTextStyle);

    // Reset any forced page
    setForceShowPage(null);

    alert("Pengaturan berhasil disimpan!");
  };

  const handleAddSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          // Membuat SlideItem baru dengan ID unik
          const newSlide: SlideItem = {
            id: localSlides.length > 0 ? Math.max(...localSlides.map(s => s.id || 0)) + 1 : 1,
            src: event.target.result,
            order: localSlides.length,
          };
          setLocalSlides([...localSlides, newSlide]);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSlide = (index: number) => {
    setLocalSlides(localSlides.filter((_, i) => i !== index));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setLocalSettings({
            ...localSettings,
            mosqueLogo: event.target.result,
          });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalSettings((prevSettings) => ({
            ...prevSettings,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          console.log("GeoLocation Detected : " + position.coords.latitude + " AND " + position.coords.longitude)
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const adjustPrayerTime = (prayer: PrayerName, amount: number) => {
    const currentTime = originalPrayerTimes[prayer];
    const [hours, minutes] = currentTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes + amount, 0, 0);
    const adjustedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Update local settings
    setLocalSettings({
      ...localSettings,
      adjustments: {
        ...localSettings.adjustments,
        [prayer]: localSettings.adjustments[prayer] + amount,
      },
    });

    // Update prayer times in appContext
    const updatedPrayerTimes = prayerTimes.map((prayerTime) => {
      if (prayerTime.name === prayer) {
        return { ...prayerTime, time: date };
      }
      return prayerTime;
    });
    updateSettings({
      ...localSettings,
      adjustments: {
        ...localSettings.adjustments,
        [prayer]: localSettings.adjustments[prayer] + amount,
      },
    });
    updateSlides(localSlides);
    updateCustomText(richTextContent);
    updateCustomTextStyle(localCustomTextStyle);
    setForceShowPage(null);
    updateSettings({
      ...localSettings,
      adjustments: {
        ...localSettings.adjustments,
        [prayer]: localSettings.adjustments[prayer] + amount,
      },
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const updatePrayerCardStyle = (prayer: PrayerName, style: CardStyle) => {
    setLocalSettings({
      ...localSettings,
      prayerCardStyles: {
        ...localSettings.prayerCardStyles,
        [prayer]: style,
      },
    });
  };

  const handleAuthChange = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 islamic-pattern">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/app" className="mr-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.location.href = "/app";
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Pengaturan</h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Auth Button */}
            <AuthButton onAuthChange={handleAuthChange} />

            {/* Sync Settings Button */}
            <SyncSettingsButton user={user} />

            {/* Theme toggle button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="appearance">Tampilan</TabsTrigger>
            <TabsTrigger value="backgrounds">Background</TabsTrigger>
            <TabsTrigger value="prayer-times">Jadwal Sholat</TabsTrigger>
            <TabsTrigger value="iqamah">Iqamah</TabsTrigger>
            <TabsTrigger value="slides">Slide</TabsTrigger>
            <TabsTrigger value="custom-text">Teks Kustom</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Atur informasi umum masjid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mosque-name">Nama Masjid</Label>
                  <Input
                    id="mosque-name"
                    value={localSettings.mosqueName}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        mosqueName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Mosque Logo */}
                <div className="space-y-2">
                  <Label htmlFor="mosque-logo">Logo Masjid</Label>
                  <div className="flex items-center gap-4">
                    {localSettings.mosqueLogo ? (
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={localSettings.mosqueLogo || "/placeholder.svg"}
                          alt="Logo Masjid"
                          fill
                          className="object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-5 w-5"
                          onClick={() =>
                            setLocalSettings({
                              ...localSettings,
                              mosqueLogo: "",
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-primary/50 rounded-md flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="border border-input rounded-md p-2 text-center hover:bg-muted/50 transition-colors">
                          {localSettings.mosqueLogo
                            ? "Ganti Logo"
                            : "Unggah Logo"}
                        </div>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Mosque Description */}
                <div className="space-y-2">
                  <Label htmlFor="mosque-description">Keterangan Masjid</Label>
                  <Textarea
                    id="mosque-description"
                    placeholder="Alamat, dikelola oleh, dll."
                    value={localSettings.mosqueDescription}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        mosqueDescription: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="after-iqamah-message">
                    Pesan Setelah Iqamah
                  </Label>
                  <Input
                    id="after-iqamah-message"
                    value={localSettings.afterIqamahMessage}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        afterIqamahMessage: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="after-iqamah-duration">
                    Durasi Estimasi Waktu Sholat (menit):{" "}
                    {localSettings.afterIqamahDuration}
                  </Label>
                  <Slider
                    id="after-iqamah-duration"
                    min={1}
                    max={20}
                    step={1}
                    value={[localSettings.afterIqamahDuration]}
                    onValueChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        afterIqamahDuration: value[0],
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="after-prayer-duration">
                    Durasi Halaman Kosong Setelah Sholat Selesai (menit):{" "}
                    {localSettings.afterPrayerDuration}
                  </Label>
                  <Slider
                    id="after-prayer-duration"
                    min={1}
                    max={30}
                    step={1}
                    value={[localSettings.afterPrayerDuration]}
                    onValueChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        afterPrayerDuration: value[0],
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Tampilan</CardTitle>
                <CardDescription>Atur tampilan aplikasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="font-family">Jenis Font</Label>
                  <Select
                    value={localSettings.fontFamily}
                    onValueChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        fontFamily: value,
                      })
                    }
                  >
                    <SelectTrigger id="font-family">
                      <SelectValue placeholder="Pilih jenis font" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonFonts.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>
                            {font.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Ukuran Font</Label>
                  <Select
                    value={localSettings.fontSize}
                    onValueChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        fontSize: value,
                      })
                    }
                  >
                    <SelectTrigger id="font-size">
                      <SelectValue placeholder="Pilih ukuran font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Kecil</SelectItem>
                      <SelectItem value="medium">Sedang (Default)</SelectItem>
                      <SelectItem value="large">Besar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme-mode">Mode Tema</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex-1 justify-start"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-5 w-5 mr-2" />
                      Terang
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex-1 justify-start"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-5 w-5 mr-2" />
                      Gelap
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <div
                    className="p-4 bg-card rounded-lg"
                    style={{
                      fontFamily: localSettings.fontFamily,
                      fontSize:
                        localSettings.fontSize === "small"
                          ? "0.875rem"
                          : localSettings.fontSize === "large"
                          ? "1.25rem"
                          : "1rem",
                    }}
                  >
                    <p>
                      Ini adalah contoh teks dengan font{" "}
                      {localSettings.fontFamily} dan ukuran{" "}
                      {localSettings.fontSize === "small"
                        ? "kecil"
                        : localSettings.fontSize === "large"
                        ? "besar"
                        : "sedang"}
                      .
                    </p>
                    <p className="mt-2">
                      Jadwal Sholat Masjid {localSettings.mosqueName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backgrounds Tab */}
          <TabsContent value="backgrounds">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Background & Kartu</CardTitle>
                <CardDescription>
                  Atur background aplikasi dan kartu waktu sholat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Background Aplikasi</h3>
                  <CardCustomizer
                    value={{
                      background: localSettings.appBackground,
                      fontFamily: localSettings.fontFamily || "inherit",
                      fontColor: "inherit",
                    }}
                    onChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        appBackground: value.background,
                        fontFamily: value.fontFamily,
                      })
                    }
                    label="Background Utama Aplikasi"
                    previewSize="large"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Kartu Informasi</h3>
                  <CardCustomizer
                    value={localSettings.currentTimeCardStyle}
                    onChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        currentTimeCardStyle: value,
                      })
                    }
                    label="Kartu Waktu Sekarang"
                  />

                  <CardCustomizer
                    value={localSettings.countdownCardStyle}
                    onChange={(value) =>
                      setLocalSettings({
                        ...localSettings,
                        countdownCardStyle: value,
                      })
                    }
                    label="Kartu Countdown"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Kartu Waktu Sholat</h3>
                  <div className="space-y-4">
                    {(
                      [
                        "Fajr",
                        "Sunrise",
                        "Dhuhr",
                        "Asr",
                        "Maghrib",
                        "Isha",
                      ] as PrayerName[]
                    ).map((prayer) => (
                      <CardCustomizer
                        key={prayer}
                        value={localSettings.prayerCardStyles[prayer]}
                        onChange={(value) =>
                          updatePrayerCardStyle(prayer, value)
                        }
                        label={
                          prayer === "Fajr"
                            ? "Subuh"
                            : prayer === "Sunrise"
                            ? "Syuruq"
                            : prayer === "Dhuhr"
                            ? "Dzuhur"
                            : prayer === "Asr"
                            ? "Ashar"
                            : prayer === "Maghrib"
                            ? "Maghrib"
                            : "Isya"
                        }
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prayer-times">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Jadwal Sholat</CardTitle>
                <CardDescription>
                  Atur lokasi dan penyesuaian waktu sholat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location Settings */}
                <div className="space-y-2">
                  <Label>Lokasi Masjid</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        type="number"
                        id="latitude"
                        value={localSettings.coordinates.latitude}
                        onChange={(e) => {
                          const newLatitude = parseFloat(e.target.value);
                          setLocalSettings((prevSettings) => ({
                            ...prevSettings,
                            coordinates: {
                              ...prevSettings.coordinates,
                              latitude: newLatitude,
                            },
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        type="number"
                        id="longitude"
                        value={localSettings.coordinates.longitude}
                        onChange={(e) => {
                          const newLongitude = parseFloat(e.target.value);
                          setLocalSettings((prevSettings) => ({
                            ...prevSettings,
                            coordinates: {
                              ...prevSettings.coordinates,
                              longitude: newLongitude,
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Detect Location Button */}
                <Button
                  variant="default"
                  onClick={detectLocation}
                  className="w-full"
                >
                    <Locate className="h-5 w-5" /> 
                  Deteksi Lokasi Saya
                </Button>

                <MapboxMap
                  initialCoordinates={localSettings.coordinates}
                  accessToken="pk.eyJ1IjoidG9uaXRlZ2Fyc2FoaWRpIiwiYSI6ImNtOG83aDR5czA4eG0ycXM4NzlqMDR1N24ifQ.0J2BjGQynzgDaXyKrEeIkw"
                  onCoordinatesChange={(newCoordinates) => {
                    setLocalSettings((prevSettings) => ({
                      ...prevSettings,
                      coordinates: {
                        latitude: newCoordinates.latitude,
                        longitude: newCoordinates.longitude,
                      },
                    }));
                  }}
                />

                {/* WIP */}
                {/* <div className="space-y-2">
                  <Label htmlFor="city-name">Nama Kota</Label>
                  <Input
                    id="city-name"
                    value={localSettings.cityName}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        cityName: e.target.value,
                      })
                    }
                  />
                </div> */}
                {/* <div className="space-y-2 mt-4">
                  <Label htmlFor="calculation-method">Metode Perhitungan</Label>
                  <Select
                    value={localSettings.calculationMethod}
                    onValueChange={(value: CalculationMethodName) =>
                      setLocalSettings({
                        ...localSettings,
                        calculationMethod: value,
                      })
                    }
                  >
                    <SelectTrigger id="calculation-method">
                      <SelectValue placeholder="Pilih metode perhitungan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MWL">Muslim World League</SelectItem>
                      <SelectItem value="ISNA">Islamic Society of North America</SelectItem>
                      <SelectItem value="Egypt">Egyptian General Authority of Survey</SelectItem>
                      <SelectItem value="Makkah">Umm al-Qura University, Makkah</SelectItem>
                      <SelectItem value="Karachi">University of Islamic Sciences, Karachi</SelectItem>
                      <SelectItem value="Tehran">Institute of Geophysics, University of Tehran</SelectItem>
                      <SelectItem value="Jafari">Shia Ithna Ashari, Leva Research Institute, Qum</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Metode perhitungan yang berbeda menggunakan sudut matahari yang berbeda untuk menentukan waktu
                    sholat.
                  </p>
                </div> */}

                <h3 className="text-lg font-medium pt-4">
                  Penyesuaian Waktu (menit)
                </h3>
                <div className="space-y-4">
                  {(
                    [
                      "Fajr",
                      "Sunrise",
                      "Dhuhr",
                      "Asr",
                      "Maghrib",
                      "Isha",
                    ] as PrayerName[]
                  ).map((prayer) => (
                    <div
                      key={prayer}
                      className="grid grid-cols-3 gap-2 items-center"
                    >
                      <div>
                        <Label className="text-sm">
                          {prayer === "Fajr"
                            ? "Subuh"
                            : prayer === "Sunrise"
                            ? "Syuruq"
                            : prayer === "Dhuhr"
                            ? "Dzuhur"
                            : prayer === "Asr"
                            ? "Ashar"
                            : prayer === "Maghrib"
                            ? "Maghrib"
                            : "Isya"}
                        </Label>
                        <div className="text-lg font-medium">
                          {originalPrayerTimes[prayer]}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustPrayerTime(prayer, -1)}
                          disabled={localSettings.adjustments[prayer] <= -30}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-12 text-center">
                          {localSettings.adjustments[prayer] > 0 ? "+" : ""}
                          {localSettings.adjustments[prayer]}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => adjustPrayerTime(prayer, 1)}
                          disabled={localSettings.adjustments[prayer] >= 30}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label className="text-sm">
                          {prayer === "Fajr"
                            ? "Subuh"
                            : prayer === "Sunrise"
                            ? "Syuruq"
                            : prayer === "Dhuhr"
                            ? "Dzuhur"
                            : prayer === "Asr"
                            ? "Ashar"
                            : prayer === "Maghrib"
                            ? "Maghrib"
                            : "Isya"}
                        </Label>
                        <div className="text-lg font-medium text-primary">
                          {adjustedPrayerTimes[prayer]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iqamah">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Iqamah</CardTitle>
                <CardDescription>
                  Atur durasi waktu iqamah untuk setiap sholat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as Exclude<
                      PrayerName,
                      "Sunrise"
                    >[]
                  ).map((prayer) => (
                    <div key={prayer} className="space-y-2">
                      <Label htmlFor={`iqamah-${prayer}`}>
                        {prayer === "Fajr"
                          ? "Subuh"
                          : prayer === "Dhuhr"
                          ? "Dzuhur"
                          : prayer === "Asr"
                          ? "Ashar"
                          : prayer === "Maghrib"
                          ? "Maghrib"
                          : "Isya"}
                        : {localSettings.iqamahTimes[prayer]} menit
                      </Label>
                      <Slider
                        id={`iqamah-${prayer}`}
                        min={1}
                        max={30}
                        step={1}
                        value={[localSettings.iqamahTimes[prayer]]}
                        onValueChange={(value) =>
                          setLocalSettings({
                            ...localSettings,
                            iqamahTimes: {
                              ...localSettings.iqamahTimes,
                              [prayer]: value[0],
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slides">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Slide</CardTitle>
                <CardDescription>
                  Tambahkan gambar untuk ditampilkan di halaman jadwal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="add-slide" className="cursor-pointer">
                    <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center hover:bg-primary/5 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p>Klik untuk menambahkan gambar</p>
                    </div>
                    <Input
                      id="add-slide"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAddSlide}
                    />
                  </Label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {localSlides.map((slide, index) => (
                    <div key={slide.id || index} className="relative group"> {/* Menggunakan slide.id sebagai key */}
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={String(slide.src) || "/placeholder.svg"} // Memastikan src adalah string
                          alt={`Slide ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveSlide(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-text">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Teks Kustom</CardTitle>
                <CardDescription>
                  Atur teks yang ditampilkan di bawah slide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-text">Teks Kustom</Label>
                  <RichTextEditor
                    value={richTextContent}
                    onChange={setRichTextContent}
                  />
                </div>

                <div className="mt-4 p-4 border rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <div
                    className="p-4 bg-card rounded-lg"
                    dangerouslySetInnerHTML={{ __html: richTextContent }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Simpan Pengaturan</Button>
        </div>
      </div>
    </div>
  );
}
