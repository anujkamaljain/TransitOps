import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatusTone } from "@/config/labels"

const BAR_TONE: Record<StatusTone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-neutral",
}

export interface DistributionSegment {
  label: string
  value: number
  tone: StatusTone
}

interface StatusDistributionProps {
  title: string
  segments: DistributionSegment[]
}

export function StatusDistribution({ title, segments }: StatusDistributionProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0)

  return (
    <Card className="animate-rise">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
          {segments.map((seg) =>
            total > 0 && seg.value > 0 ? (
              <div
                key={seg.label}
                className={cn("transition-all", BAR_TONE[seg.tone])}
                style={{ width: `${(seg.value / total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={cn("size-2 rounded-full", BAR_TONE[seg.tone])} />
                {seg.label}
              </span>
              <span className="text-sm font-medium text-foreground">{seg.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
