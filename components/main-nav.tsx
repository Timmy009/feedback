"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Home
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/troubleshoot"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/troubleshoot" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Troubleshoot
      </Link>
      <Link
        href="/settings/theme"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/settings/theme" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Theme
      </Link>
    </nav>
  )
}
