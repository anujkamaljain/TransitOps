import { useState } from "react"
import { CheckCircle2, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { notifyError } from "@/lib/api/mutation-error"
import type { MaintenanceLog } from "@/types/domain"
import {
  useCloseMaintenance,
  useDeleteMaintenance,
} from "@/features/maintenance/use-maintenance"

type Pending = "close" | "delete" | null

export function MaintenanceRowActions({
  record,
  onEdit,
}: {
  record: MaintenanceLog
  onEdit: (record: MaintenanceLog) => void
}) {
  const [pending, setPending] = useState<Pending>(null)
  const closeMutation = useCloseMaintenance()
  const deleteMutation = useDeleteMaintenance()
  const isActive = record.status === "ACTIVE"

  async function confirm() {
    try {
      if (pending === "close") await closeMutation.mutateAsync(record.id)
      else if (pending === "delete") await deleteMutation.mutateAsync(record.id)
      setPending(null)
    } catch (error) {
      notifyError(error)
    }
  }

  const config =
    pending === "close"
      ? {
          title: "Close this maintenance?",
          description: `${record.vehicle?.registrationNumber ?? "The vehicle"} will return to service if no other work is open.`,
          confirmLabel: "Close",
          destructive: false,
        }
      : {
          title: "Delete this record?",
          description: "This maintenance record will be permanently removed.",
          confirmLabel: "Delete",
          destructive: true,
        }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Maintenance actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={!isActive} onClick={() => onEdit(record)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!isActive} onClick={() => setPending("close")}>
            <CheckCircle2 className="size-4" />
            Close
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setPending("delete")}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={config.title}
        description={config.description}
        confirmLabel={config.confirmLabel}
        destructive={config.destructive}
        loading={closeMutation.isPending || deleteMutation.isPending}
        onConfirm={confirm}
      />
    </>
  )
}
