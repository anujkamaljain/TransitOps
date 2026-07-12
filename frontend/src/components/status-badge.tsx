import { cn } from "@/lib/utils"
import type { StatusTone } from "@/config/labels"

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success/10 text-success ring-success/25",
  info: "bg-info/10 text-info ring-info/25",
  warning: "bg-warning/10 text-warning ring-warning/25",
  danger: "bg-danger/10 text-danger ring-danger/25",
  neutral: "bg-neutral/10 text-neutral ring-neutral/25",
}

interface StatusBadgeProps {
  tone: StatusTone
  label: string
  className?: string
}

export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
