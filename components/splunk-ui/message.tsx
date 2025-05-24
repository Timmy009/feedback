"use client"

import type React from "react"

interface MessageProps {
  children: React.ReactNode
  appearance?: "success" | "error" | "warning" | "info"
  style?: React.CSSProperties
}

export function Message({ children, appearance = "info", style }: MessageProps) {
  return (
    <div className={`splunk-message splunk-message-${appearance}`} style={style}>
      {children}
    </div>
  )
}
