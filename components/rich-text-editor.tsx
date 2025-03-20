"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, RefreshCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(value)
  const [plainText, setPlainText] = useState("")
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  // Initialize editor content
  useEffect(() => {
    setEditorContent(value)
    // Extract plain text from HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = value
    setPlainText(tempDiv.textContent || tempDiv.innerText || "")
  }, [value])

  // Handle content changes in the WYSIWYG editor
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setEditorContent(newContent)
      onChange(newContent)

      // Update plain text
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = newContent
      setPlainText(tempDiv.textContent || tempDiv.innerText || "")
    }
  }

  // Handle content changes in the HTML editor
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value
    setEditorContent(newHtml)
    onChange(newHtml)

    // Update plain text
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = newHtml
    setPlainText(tempDiv.textContent || tempDiv.innerText || "")
  }

  // Handle content changes in the plain text editor
  const handlePlainTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setPlainText(newText)
    setEditorContent(`<p>${newText}</p>`)
    onChange(`<p>${newText}</p>`)
  }

  // Apply formatting commands
  const applyFormat = (command: string, value = "") => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setEditorContent(newContent)
      onChange(newContent)
    }
  }

  // Handle font size changes
  const handleFontSizeChange = (size: string) => {
    let fontSize
    switch (size) {
      case "small":
        fontSize = "2"
        break
      case "normal":
        fontSize = "3"
        break
      case "large":
        fontSize = "4"
        break
      case "xlarge":
        fontSize = "5"
        break
      default:
        fontSize = "3"
    }
    applyFormat("fontSize", fontSize)
  }

  // Handle font color changes
  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFormat("foreColor", e.target.value)
  }

  // Toggle between WYSIWYG, HTML, and plain text modes
  const toggleMode = () => {
    setIsHtmlMode((prev) => !prev)
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b">
        {/* Formatting toolbar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("bold")}
          className="h-8 w-8 p-0"
          disabled={isHtmlMode}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("italic")}
          className="h-8 w-8 p-0"
          disabled={isHtmlMode}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("underline")}
          className="h-8 w-8 p-0"
          disabled={isHtmlMode}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("justifyLeft")}
          className="h-8 w-8 p-0"
          disabled={isHtmlMode}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("justifyCenter")}
          className="h-8 w-8 p-0"
          disabled={isHtmlMode}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => applyFormat("justifyRight")}
          className="h-8 w-8 p-0"
          disabled={isHtmlMode}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <div className="flex items-center gap-1">
          <Type className="h-4 w-4" />
          <Select onValueChange={handleFontSizeChange} disabled={isHtmlMode}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xlarge">X-Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Input type="color" onChange={handleFontColorChange} className="h-8 w-8 p-1" disabled={isHtmlMode} />
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={toggleMode} className="h-8">
            <RefreshCcw className="h-4 w-4 mr-2" />
            {isHtmlMode ? "Visual Editor" : "HTML Editor"}
          </Button>
        </div>
      </div>

      {/* Editor area */}
      {isHtmlMode ? (
        <div className="p-3">
          <Textarea
            value={editorContent}
            onChange={handleHtmlChange}
            className="min-h-[150px] font-mono text-sm"
            placeholder="Edit HTML directly..."
          />
          <div className="mt-2">
            <Textarea
              value={plainText}
              onChange={handlePlainTextChange}
              className="min-h-[80px]"
              placeholder="Or edit as plain text..."
            />
          </div>
        </div>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          className="p-3 min-h-[150px] focus:outline-none"
          dangerouslySetInnerHTML={{ __html: editorContent }}
          onInput={handleContentChange}
        />
      )}
    </div>
  )
}

