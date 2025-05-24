"use client"

import type React from "react"

interface MenuProps {
  children: React.ReactNode
}

interface MenuItemProps {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
}

export function Menu({ children }: MenuProps) {
  return <div className="splunk-menu">{children}</div>
}

Menu.Item = function MenuItem({ children, selected, onClick }: MenuItemProps) {
  return (
    <div className={`splunk-menu-item ${selected ? "selected" : ""}`} onClick={onClick}>
      {children}
    </div>
  )
}
