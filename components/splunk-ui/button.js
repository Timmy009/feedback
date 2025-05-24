"use client"

export function Button({
  children,
  appearance = "secondary",
  disabled = false,
  onClick,
  type = "button",
  style,
  className = "",
  ...props
}) {
  const baseClasses = "splunk-button"
  const appearanceClass = `splunk-button-${appearance}`
  const combinedClasses = `${baseClasses} ${appearanceClass} ${className}`.trim()

  return (
    <button className={combinedClasses} disabled={disabled} onClick={onClick} type={type} style={style} {...props}>
      {children}
    </button>
  )
}
