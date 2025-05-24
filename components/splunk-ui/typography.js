"use client"

export function Heading({ level, children }) {
  const Tag = `h${level}`
  return <Tag className={`splunk-heading splunk-heading-${level}`}>{children}</Tag>
}

export function P({ children }) {
  return <p className="splunk-paragraph">{children}</p>
}
