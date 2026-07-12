import { useState } from "react"
import { Ban, CircleCheck, MoreHorizontal, Pencil, PowerOff, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { notifyError } from "@/lib/api/mutation-error"
import type { Driver } from "@/types/domain"
import type { ManageableDriverStatus } from "@/features/drivers/driver.api"
import { useDeleteDriver, useDriverStatus } from "@/features/drivers/use-drivers"

export function DriverRowActions({
  driver,
  onEdit,
}: {
  driver: Driver
  onEdit: (driver: Driver) => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const statusMutation = useDriverStatus()
  const deleteMutation = useDeleteDriver()
  const onTrip = driver.status === "ON_TRIP"

  async function setStatus(status: ManageableDriverStatus) {
    try {
      await statusMutation.mutateAsync({ id: driver.id, status })
    } catch (error) {
      notifyError(error)
    }
  }

  async function confirmDeletion() {
    try {
      await deleteMutation.mutateAsync(driver.id)
      setConfirmDelete(false)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Driver actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(driver)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {onTrip ? "On a trip — status locked" : "Set status"}
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={onTrip || driver.status === "AVAILABLE"}
            onClick={() => setStatus("AVAILABLE")}
          >
            <CircleCheck className="size-4" />
            Mark available
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={onTrip || driver.status === "OFF_DUTY"}
            onClick={() => setStatus("OFF_DUTY")}
          >
            <PowerOff className="size-4" />
            Mark off duty
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={onTrip || driver.status === "SUSPENDED"}
            onClick={() => setStatus("SUSPENDED")}
          >
            <Ban className="size-4" />
            Suspend
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this driver?"
        description={`${driver.fullName} will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDeletion}
      />
    </>
  )
}
