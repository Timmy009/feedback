"use client"

import type React from "react"

interface ControlGroupProps {
  label: string
  help?: string
  children: React.ReactNode
}

export function ControlGroup({ label, help, children }: ControlGroupProps) {
  return (
    <div className="splunk-control-group">
      <label className="splunk-control-label">{label}</label>
      {children}
      {help && <div className="splunk-control-help">{help}</div>}
    </div>
  )
}
