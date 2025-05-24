"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export function ThemeDemo() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize the appearance of the application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-6 w-6" />
              <span>Light Mode</span>
              {theme === "light" && <Badge className="absolute top-2 right-2">Active</Badge>}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-6 w-6" />
              <span>Dark Mode</span>
              {theme === "dark" && <Badge className="absolute top-2 right-2">Active</Badge>}
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-6 w-6" />
              <span>System Mode</span>
              {theme === "system" && <Badge className="absolute top-2 right-2">Active</Badge>}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-medium">{theme?.charAt(0).toUpperCase() + theme?.slice(1)}</span>
          </p>
          <Button variant="outline" onClick={() => setTheme("system")}>
            Reset to System
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>See how different elements look in the current theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Text Elements</h3>
              <p>This is regular text in the current theme.</p>
              <p className="text-muted-foreground">This is muted text in the current theme.</p>
              <p className="text-primary">This is primary colored text.</p>
              <p className="text-destructive">This is destructive colored text.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Background Elements</h3>
              <div className="p-4 bg-card rounded-md border">Card Background</div>
              <div className="p-4 bg-primary text-primary-foreground rounded-md">Primary Background</div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded-md">Secondary Background</div>
              <div className="p-4 bg-muted text-muted-foreground rounded-md">Muted Background</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UI Components</CardTitle>
            <CardDescription>Preview of UI components in the current theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Form Elements</h3>
              <div className="grid gap-2">
                <input
                  type="text"
                  placeholder="Text Input"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option>Select Option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
