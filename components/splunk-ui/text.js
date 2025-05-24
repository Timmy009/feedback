"use client"

export function Text({ value, onChange, placeholder, required, type = "text", style }) {
  const handleChange = (e) => {
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
