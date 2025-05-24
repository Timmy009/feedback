"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SplunkThemeContext = createContext(undefined)

export function useSplunkTheme() {
  const context = useContext(SplunkThemeContext)
  if (!context) {
    throw new Error("useSplunkTheme must be used within a SplunkThemeProvider")
  }
  return context
}

export function SplunkThemeProvider({ children }) {
  const [theme, setTheme] = useState("enterprise")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("splunk-theme")
    if (savedTheme && ["enterprise", "enterprise-dark", "lite"].includes(savedTheme)) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("splunk-theme", theme)
      // Apply theme class to document
      document.documentElement.className = `splunk-theme-${theme}`
    }
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  return (
    <SplunkThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`splunk-theme-${theme}`}>{children}</div>
    </SplunkThemeContext.Provider>
  )
}
