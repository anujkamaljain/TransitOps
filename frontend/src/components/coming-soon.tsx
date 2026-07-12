import { Construction } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ComingSoonProps {
  icon?: LucideIcon
  title: string
  note: string
}

export function ComingSoon({ icon: Icon = Construction, title, note }: ComingSoonProps) {
  return (
    <Card className="animate-rise border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="size-7" />
        </span>
        <div className="space-y-1.5">
          <p className="text-lg font-medium text-foreground">{title}</p>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{note}</p>
        </div>
      </CardContent>
    </Card>
  )
}
