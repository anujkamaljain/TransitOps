import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  showText?: boolean
  tagline?: boolean
  invert?: boolean
}

export function BrandLogo({
  className,
  showText = true,
  tagline = false,
  invert = false,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br from-primary to-amber-600 shadow-sm ring-1 ring-primary/30">
        <span className="grid size-4 grid-cols-2 grid-rows-2 overflow-hidden rounded-[3px]">
          <span className="bg-primary-foreground/90" />
          <span className="bg-primary-foreground/30" />
          <span className="bg-primary-foreground/30" />
          <span className="bg-primary-foreground/90" />
        </span>
      </span>
      {showText && (
        <div className="leading-tight">
          <p
            className={cn(
              "text-base font-semibold tracking-tight",
              invert ? "text-white" : "text-foreground",
            )}
          >
            TransitOps
          </p>
          {tagline && (
            <p
              className={cn(
                "text-xs",
                invert ? "text-slate-400" : "text-muted-foreground",
              )}
            >
              Smart Transport Operations
            </p>
          )}
        </div>
      )}
    </div>
  )
}
