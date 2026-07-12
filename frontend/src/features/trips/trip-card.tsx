import { useState } from "react"
import { ArrowRight, CheckCircle2, Pencil, Send, Trash2, XCircle } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TRIP_STATUS_LABELS, TRIP_STATUS_TONES } from "@/config/labels"
import { formatCurrency, formatNumber } from "@/lib/format"
import { notifyError } from "@/lib/api/mutation-error"
import { cn } from "@/lib/utils"
import type { Trip } from "@/types/domain"
import { CompleteTripDialog } from "@/features/trips/complete-trip-dialog"
import { useCancelTrip, useDeleteTrip, useDispatchTrip } from "@/features/trips/use-trips"

interface TripCardProps {
  trip: Trip
  canManage: boolean
  onEdit: (trip: Trip) => void
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium">{value}</p>
    </div>
  )
}

export function TripCard({ trip, canManage, onEdit }: TripCardProps) {
  const [pending, setPending] = useState<"cancel" | "delete" | null>(null)
  const [completeOpen, setCompleteOpen] = useState(false)
  const dispatchMutation = useDispatchTrip()
  const cancelMutation = useCancelTrip()
  const deleteMutation = useDeleteTrip()

  const isDraft = trip.status === "DRAFT"
  const isDispatched = trip.status === "DISPATCHED"
  const canDispatch = isDraft && Boolean(trip.vehicleId && trip.driverId)

  async function run(fn: () => Promise<unknown>, after?: () => void) {
    try {
      await fn()
      after?.()
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Card className="animate-rise">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{trip.tripCode}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {trip.source}
              <ArrowRight className="size-3.5" />
              {trip.destination}
            </p>
          </div>
          <StatusBadge tone={TRIP_STATUS_TONES[trip.status]} label={TRIP_STATUS_LABELS[trip.status]} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Meta label="Vehicle" value={trip.vehicle?.registrationNumber ?? "Unassigned"} />
          <Meta label="Driver" value={trip.driver?.fullName ?? "Unassigned"} />
          <Meta label="Cargo" value={`${formatNumber(trip.cargoWeightKg)} kg`} />
          <Meta label="Revenue" value={trip.revenue ? formatCurrency(trip.revenue) : "—"} />
        </div>

        {canManage && trip.status !== "COMPLETED" && trip.status !== "CANCELLED" && (
          <div className={cn("flex flex-wrap gap-2 border-t pt-3")}>
            {isDraft && (
              <>
                <Button variant="outline" size="sm" onClick={() => onEdit(trip)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  disabled={!canDispatch || dispatchMutation.isPending}
                  title={canDispatch ? undefined : "Assign a vehicle and driver first"}
                  onClick={() => run(() => dispatchMutation.mutateAsync(trip.id))}
                >
                  <Send className="size-4" />
                  Dispatch
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPending("delete")}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </>
            )}
            {isDispatched && (
              <>
                <Button size="sm" onClick={() => setCompleteOpen(true)}>
                  <CheckCircle2 className="size-4" />
                  Complete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPending("cancel")}>
                  <XCircle className="size-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={pending === "delete"}
        onOpenChange={(open) => !open && setPending(null)}
        title="Delete this trip?"
        description={`Draft trip ${trip.tripCode} will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => run(() => deleteMutation.mutateAsync(trip.id), () => setPending(null))}
      />
      <ConfirmDialog
        open={pending === "cancel"}
        onOpenChange={(open) => !open && setPending(null)}
        title="Cancel this trip?"
        description={`Trip ${trip.tripCode} will be cancelled and its vehicle and driver released.`}
        confirmLabel="Cancel trip"
        destructive
        loading={cancelMutation.isPending}
        onConfirm={() => run(() => cancelMutation.mutateAsync(trip.id), () => setPending(null))}
      />
      {completeOpen && (
        <CompleteTripDialog open={completeOpen} onOpenChange={setCompleteOpen} trip={trip} />
      )}
    </Card>
  )
}
