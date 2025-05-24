"use client"

export function AppBar({ brand, menu, rightItems }) {
  return (
    <div className="splunk-app-bar">
      <div className="splunk-app-bar-content">
        <div className="splunk-app-bar-left">
          <div className="splunk-app-bar-brand">{brand}</div>
          {menu && <div className="splunk-app-bar-menu">{menu}</div>}
        </div>
        {rightItems && (
          <div className="splunk-app-bar-right">
            {rightItems.map((item, index) => (
              <div key={index} className="splunk-app-bar-item">
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
