"use client"

import { useState } from "react"
import { Button } from "./splunk-ui/button"
import { Menu } from "./splunk-ui/menu"
import { Popover } from "./splunk-ui/popover"
import { useSplunkTheme } from "./splunk-theme-provider"

export function SplunkThemeToggle() {
  const { theme, setTheme } = useSplunkTheme()
  const [open, setOpen] = useState(false)

  const themeOptions = [
    { value: "enterprise", label: "Enterprise Light" },
    { value: "enterprise-dark", label: "Enterprise Dark" },
    { value: "lite", label: "Lite" },
  ]

  const currentTheme = themeOptions.find((t) => t.value === theme)

  return (
    <Popover open={open} onRequestClose={() => setOpen(false)}>
      <Popover.Trigger>
        <Button appearance="pill" onClick={() => setOpen(!open)}>
          Theme: {currentTheme?.label}
        </Button>
      </Popover.Trigger>
      <Popover.Body>
        <Menu>
          {themeOptions.map((option) => (
            <Menu.Item
              key={option.value}
              selected={theme === option.value}
              onClick={() => {
                setTheme(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </Menu.Item>
          ))}
        </Menu>
      </Popover.Body>
    </Popover>
  )
}
