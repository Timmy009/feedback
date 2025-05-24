import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SplunkThemeProvider } from "@/components/splunk-theme-provider"
import { SplunkNavigation } from "@/components/splunk-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Core Dataset Feedback - Splunk Enterprise",
  description: "Report and track data entity issues in the Core Dataset using Splunk Enterprise",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplunkThemeProvider>
          <div className="splunk-app">
            <SplunkNavigation />
            <main className="splunk-main-content">{children}</main>
          </div>
        </SplunkThemeProvider>
      </body>
    </html>
  )
}
