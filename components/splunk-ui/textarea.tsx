"use client"

import type React from "react"

interface TextAreaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>, data: { value: string }) => void
  placeholder?: string
  rows?: number
}

export function TextArea({ value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e, { value: e.target.value })
  }

  return (
    <textarea className="splunk-textarea" value={value} onChange={handleChange} placeholder={placeholder} rows={rows} />
  )
}
