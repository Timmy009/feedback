"use client"

export function TextArea({ value, onChange, placeholder, rows = 3 }) {
  const handleChange = (e) => {
    onChange(e, { value: e.target.value })
  }

  return (
    <textarea className="splunk-textarea" value={value} onChange={handleChange} placeholder={placeholder} rows={rows} />
  )
}
