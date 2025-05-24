"use client"

import type React from "react"

interface DatePickerProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => void
  placeholder?: string
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e, { value: e.target.value })
  }

  return <input className="splunk-date-picker" type="date" value={value} onChange={handleChange} />
}
