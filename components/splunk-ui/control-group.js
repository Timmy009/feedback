"use client"

export function ControlGroup({ label, help, children }) {
  return (
    <div className="splunk-control-group">
      <label className="splunk-control-label">{label}</label>
      {children}
      {help && <div className="splunk-control-help">{help}</div>}
    </div>
  )
}
