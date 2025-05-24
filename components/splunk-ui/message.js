"use client"

export function Message({ children, appearance = "info", style }) {
  return (
    <div className={`splunk-message splunk-message-${appearance}`} style={style}>
      {children}
    </div>
  )
}
