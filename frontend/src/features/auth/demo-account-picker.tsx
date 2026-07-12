import { Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROLE_LABELS, USER_ROLES } from "@/types/auth"
import { DEMO_ACCOUNTS } from "@/features/auth/demo-accounts"

interface DemoAccountPickerProps {
  onSelect: (email: string) => void
  disabled?: boolean
}

export function DemoAccountPicker({ onSelect, disabled }: DemoAccountPickerProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Users2 className="size-3.5" />
        <span>Quick sign-in for evaluation</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {USER_ROLES.map((role) => (
          <Button
            key={role}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSelect(DEMO_ACCOUNTS[role])}
            className="justify-start"
          >
            {ROLE_LABELS[role]}
          </Button>
        ))}
      </div>
    </div>
  )
}
