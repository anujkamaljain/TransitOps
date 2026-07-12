import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { StatusTone } from "@/config/labels"

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-primary/10 text-primary",
}

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: StatusTone
  hint?: string
}

export function KpiCard({ label, value, icon: Icon, tone = "neutral", hint }: KpiCardProps) {
  return (
    <Card className="animate-rise transition-shadow hover:shadow-md">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TONE_CLASSES[tone])}>
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
