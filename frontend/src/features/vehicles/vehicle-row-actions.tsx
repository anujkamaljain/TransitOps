import { useState } from "react"
import { Archive, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react"
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
import type { Vehicle } from "@/types/domain"
import { useDeleteVehicle, useVehicleStatus } from "@/features/vehicles/use-vehicles"

type PendingAction = "retire" | "restore" | "delete" | null

export function VehicleRowActions({
  vehicle,
  onEdit,
}: {
  vehicle: Vehicle
  onEdit: (vehicle: Vehicle) => void
}) {
  const [pending, setPending] = useState<PendingAction>(null)
  const statusMutation = useVehicleStatus()
  const deleteMutation = useDeleteVehicle()
  const loading = statusMutation.isPending || deleteMutation.isPending

  async function confirm() {
    try {
      if (pending === "delete") {
        await deleteMutation.mutateAsync(vehicle.id)
      } else if (pending === "retire") {
        await statusMutation.mutateAsync({ id: vehicle.id, status: "RETIRED" })
      } else if (pending === "restore") {
        await statusMutation.mutateAsync({ id: vehicle.id, status: "AVAILABLE" })
      }
      setPending(null)
    } catch (error) {
      notifyError(error)
    }
  }

  const config = {
    retire: {
      title: "Retire this vehicle?",
      description: `${vehicle.registrationNumber} will be marked as retired and removed from dispatch.`,
      confirmLabel: "Retire",
      destructive: true,
    },
    restore: {
      title: "Restore this vehicle?",
      description: `${vehicle.registrationNumber} will become available for dispatch.`,
      confirmLabel: "Restore",
      destructive: false,
    },
    delete: {
      title: "Delete this vehicle?",
      description: `${vehicle.registrationNumber} will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    },
  } as const

  const active = pending ? config[pending] : null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Vehicle actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(vehicle)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          {vehicle.status === "RETIRED" ? (
            <DropdownMenuItem onClick={() => setPending("restore")}>
              <RotateCcw className="size-4" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setPending("retire")}>
              <Archive className="size-4" />
              Retire
            </DropdownMenuItem>
          )}
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
        title={active?.title ?? ""}
        description={active?.description ?? ""}
        confirmLabel={active?.confirmLabel}
        destructive={active?.destructive}
        loading={loading}
        onConfirm={confirm}
      />
    </>
  )
}
