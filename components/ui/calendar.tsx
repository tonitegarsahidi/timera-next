"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CalendarProps extends React.ComponentProps<typeof DatePicker> {
  className?: string;
}

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <DatePicker
      className={cn("p-3", className)}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
