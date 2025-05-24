"use client"

import type React from "react"

interface TextProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => void
  placeholder?: string
  required?: boolean
  type?: string
  style?: React.CSSProperties
}

export function Text({ value, onChange, placeholder, required, type = "text", style }: TextProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e, { value: e.target.value })
  }

  return (
    <input
      className="splunk-text-input"
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      style={style}
    />
  )
}
