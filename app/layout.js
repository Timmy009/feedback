import { Inter } from "next/font/google"
import "./globals.css"
import { SplunkThemeProvider } from "@/components/splunk-theme-provider"
import { SplunkNavigation } from "@/components/splunk-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Core Dataset Feedback",
  description: "Feedback collection system for core datasets",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplunkThemeProvider>
          <div className="min-h-screen bg-background">
            <SplunkNavigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </SplunkThemeProvider>
      </body>
    </html>
  )
}
