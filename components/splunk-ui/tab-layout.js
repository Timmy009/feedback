"use client"

import React, { useState, useEffect } from "react"

export function TabLayout({ children }) {
  const [activeTab, setActiveTab] = useState("")

  // Extract panels from children
  const panels = React.Children.toArray(children)

  // Set default active tab
  useEffect(() => {
    if (panels.length > 0 && !activeTab) {
      setActiveTab(panels[0].props.panelId)
    }
  }, [panels, activeTab])

  return (
    <div className="splunk-tab-layout">
      <div className="splunk-tab-nav">
        {panels.map((panel) => (
          <button
            key={panel.props.panelId}
            className={`splunk-tab-button ${activeTab === panel.props.panelId ? "active" : ""}`}
            onClick={() => setActiveTab(panel.props.panelId)}
          >
            {panel.props.label}
          </button>
        ))}
      </div>
      <div className="splunk-tab-content">
        {panels.map((panel) => (
          <div
            key={panel.props.panelId}
            className={`splunk-tab-panel ${activeTab === panel.props.panelId ? "active" : ""}`}
          >
            {activeTab === panel.props.panelId && panel.props.children}
          </div>
        ))}
      </div>
    </div>
  )
}

function TabPanel({ children }) {
  return <>{children}</>
}

TabLayout.Panel = TabPanel
