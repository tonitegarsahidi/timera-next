"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, ImageIcon, Palette, Type, Paintbrush } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BackgroundSetting } from "@/contexts/app-context"

interface BackgroundPickerProps {
  value: BackgroundSetting & {
    fontFamily?: string
    fontColor?: string
  }
  onChange: (
    value: BackgroundSetting & {
      fontFamily?: string
      fontColor?: string
    },
  ) => void
  label?: string
  previewSize?: "small" | "medium" | "large"
}

export function BackgroundPicker({
  value,
  onChange,
  label = "Background",
  previewSize = "medium",
}: BackgroundPickerProps) {
  const [activeTab, setActiveTab] = useState<"color" | "image" | "font" | "fontColor">("color")

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      type: "color",
      value: e.target.value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          onChange({
            ...value,
            type: "image",
            value: event.target.result,
          })
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const clearBackground = () => {
    onChange({
      ...value,
      type: activeTab === "color" || activeTab === "fontColor" ? "color" : "image",
      value: activeTab === "color" ? "transparent" : "",
    })
  }

  const handleFontFamilyChange = (fontFamily: string) => {
    onChange({
      ...value,
      fontFamily,
    })
  }

  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      fontColor: e.target.value,
    })
  }

  // Determine preview size
  const getPreviewSize = () => {
    switch (previewSize) {
      case "small":
        return "w-12 h-12"
      case "large":
        return "w-32 h-20"
      default:
        return "w-20 h-16"
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="color" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span>Warna BG</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span>Gambar</span>
          </TabsTrigger>
          <TabsTrigger value="font" className="flex items-center gap-1">
            <Type className="h-4 w-4" />
            <span>Font</span>
          </TabsTrigger>
          <TabsTrigger value="fontColor" className="flex items-center gap-1">
            <Paintbrush className="h-4 w-4" />
            <span>Warna Font</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={value.type === "color" ? value.value : "#ffffff"}
              onChange={handleColorChange}
              className="w-12 h-10 p-1"
            />
            <div className="flex-1">
              <Input
                type="text"
                value={value.type === "color" ? value.value : "#ffffff"}
                onChange={handleColorChange}
                placeholder="#RRGGBB atau nama warna"
              />
            </div>
            <Button variant="outline" size="icon" onClick={clearBackground} title="Reset warna">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            {value.type === "image" && value.value ? (
              <div className="relative">
                <div className={`${getPreviewSize()} rounded-md overflow-hidden border relative`}>
                  <Image src={value.value || "/placeholder.svg"} alt="Background" fill className="object-cover" />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={clearBackground}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Label htmlFor="bg-upload" className="cursor-pointer">
                <div
                  className={`${getPreviewSize()} border-2 border-dashed border-primary/50 rounded-md flex items-center justify-center`}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <Input id="bg-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </Label>
            )}
            <div className="flex-1">
              <Label htmlFor="bg-upload-btn" className="cursor-pointer">
                <div className="border border-input rounded-md p-2 text-center hover:bg-muted/50 transition-colors">
                  {value.type === "image" && value.value ? "Ganti Gambar" : "Unggah Gambar"}
                </div>
                <Input
                  id="bg-upload-btn"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="font" className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor={`font-family-${label}`}>Jenis Font</Label>
            <Select value={value.fontFamily || "inherit"} onValueChange={handleFontFamilyChange}>
              <SelectTrigger id={`font-family-${label}`}>
                <SelectValue placeholder="Pilih jenis font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">Default</SelectItem>
                <SelectItem value="Inter">
                  <span style={{ fontFamily: "Inter" }}>Inter</span>
                </SelectItem>
                <SelectItem value="Arial">
                  <span style={{ fontFamily: "Arial" }}>Arial</span>
                </SelectItem>
                <SelectItem value="Roboto">
                  <span style={{ fontFamily: "Roboto" }}>Roboto</span>
                </SelectItem>
                <SelectItem value="Poppins">
                  <span style={{ fontFamily: "Poppins" }}>Poppins</span>
                </SelectItem>
                <SelectItem value="Montserrat">
                  <span style={{ fontFamily: "Montserrat" }}>Montserrat</span>
                </SelectItem>
                <SelectItem value="'Noto Sans'">
                  <span style={{ fontFamily: "Noto Sans" }}>Noto Sans</span>
                </SelectItem>
                <SelectItem value="'Noto Serif'">
                  <span style={{ fontFamily: "Noto Serif" }}>Noto Serif</span>
                </SelectItem>
                <SelectItem value="'Playfair Display'">
                  <span style={{ fontFamily: "Playfair Display" }}>Playfair Display</span>
                </SelectItem>
                <SelectItem value="'Merriweather'">
                  <span style={{ fontFamily: "Merriweather" }}>Merriweather</span>
                </SelectItem>
                <SelectItem value="'Lato'">
                  <span style={{ fontFamily: "Lato" }}>Lato</span>
                </SelectItem>
                <SelectItem value="'Open Sans'">
                  <span style={{ fontFamily: "Open Sans" }}>Open Sans</span>
                </SelectItem>
                <SelectItem value="'Raleway'">
                  <span style={{ fontFamily: "Raleway" }}>Raleway</span>
                </SelectItem>
                <SelectItem value="'Nunito'">
                  <span style={{ fontFamily: "Nunito" }}>Nunito</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 border rounded-md">
            <p style={{ fontFamily: value.fontFamily || "inherit" }}>
              Contoh teks dengan font{" "}
              {value.fontFamily === "inherit" || !value.fontFamily ? "default" : value.fontFamily}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="fontColor" className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={value.fontColor || "#000000"}
              onChange={handleFontColorChange}
              className="w-12 h-10 p-1"
            />
            <div className="flex-1">
              <Input
                type="text"
                value={value.fontColor || "#000000"}
                onChange={handleFontColorChange}
                placeholder="#RRGGBB atau nama warna"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onChange({ ...value, fontColor: "inherit" })}
              title="Reset warna"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-3 border rounded-md">
            <p style={{ color: value.fontColor || "inherit" }}>
              Contoh teks dengan warna {value.fontColor === "inherit" || !value.fontColor ? "default" : value.fontColor}
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-3 border rounded-md">
        <div
          className="p-3 rounded-md flex items-center justify-center"
          style={{
            ...(value.type === "color"
              ? { backgroundColor: value.value }
              : value.type === "image" && value.value
                ? {
                    backgroundImage: `url(${value.value})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}),
            fontFamily: value.fontFamily !== "inherit" && value.fontFamily ? value.fontFamily : undefined,
            color: value.fontColor !== "inherit" && value.fontColor ? value.fontColor : undefined,
          }}
        >
          <span className="text-lg">Preview dengan semua pengaturan</span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Font: {value.fontFamily === "inherit" || !value.fontFamily ? "Default" : value.fontFamily}</p>
          <p>Warna Font: {value.fontColor === "inherit" || !value.fontColor ? "Default" : value.fontColor}</p>
          <p>Background: {value.type === "color" ? value.value : "Gambar"}</p>
        </div>
      </div>
    </div>
  )
}

