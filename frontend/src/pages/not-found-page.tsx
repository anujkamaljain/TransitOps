import { Compass } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Compass className="size-8" />
      </span>
      <div className="space-y-2">
        <p className="text-4xl font-semibold tracking-tight">404</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn't find that page. It may have moved or never existed.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Back to workspace</Link>
      </Button>
    </div>
  )
}
