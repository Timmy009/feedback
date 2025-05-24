"use client"

export function Menu({ children }) {
  return <div className="splunk-menu">{children}</div>
}

function MenuItem({ children, selected, onClick }) {
  return (
    <div className={`splunk-menu-item ${selected ? "selected" : ""}`} onClick={onClick}>
      {children}
    </div>
  )
}

Menu.Item = MenuItem
