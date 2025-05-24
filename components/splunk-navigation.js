"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AppBar } from "./splunk-ui/app-bar"
import { Menu } from "./splunk-ui/menu"
import { SplunkThemeToggle } from "./splunk-theme-toggle"

export function SplunkNavigation() {
  const pathname = usePathname()

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Troubleshoot", href: "/troubleshoot" },
  ]

  return (
    <AppBar
      brand={
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          Core Dataset Feedback
        </Link>
      }
      menu={
        <Menu>
          {menuItems.map((item) => (
            <Menu.Item key={item.href} selected={pathname === item.href}>
              <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
                {item.label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      }
      rightItems={[<SplunkThemeToggle key="theme-toggle" />]}
    />
  )
}
