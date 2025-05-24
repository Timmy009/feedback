"use client"

export function DatePicker({ value, onChange, placeholder }) {
  const handleChange = (e) => {
    onChange(e, { value: e.target.value })
  }

  return <input className="splunk-date-picker" type="date" value={value} onChange={handleChange} />
}
