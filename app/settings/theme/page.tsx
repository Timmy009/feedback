import { ThemeDemo } from "@/components/theme-demo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ThemeSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Theme Settings</h1>
            <p className="text-muted-foreground">Customize the appearance of the Core Dataset Feedback system</p>
          </div>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <ThemeDemo />
      </div>
    </div>
  )
}
