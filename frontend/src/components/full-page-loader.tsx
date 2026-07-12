import { Loader2 } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

export function FullPageLoader() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background">
      <BrandLogo tagline className="animate-fade-in" />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span>Preparing your workspace…</span>
      </div>
    </div>
  )
}
