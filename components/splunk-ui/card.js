"use client"

export function Card({ children, style }) {
  return (
    <div className="splunk-card" style={style}>
      {children}
    </div>
  )
}

function CardHeader({ children }) {
  return <div className="splunk-card-header">{children}</div>
}

function CardBody({ children }) {
  return <div className="splunk-card-body">{children}</div>
}

Card.Header = CardHeader
Card.Body = CardBody
