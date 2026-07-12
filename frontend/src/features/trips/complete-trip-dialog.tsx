import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { FormField } from "@/components/form/form-field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { applyFormErrors } from "@/lib/api/mutation-error"
import type { Trip } from "@/types/domain"
import {
  completeTripSchema,
  type CompleteTripInput,
  type CompleteTripValues,
} from "@/features/trips/trip-schema"
import { useCompleteTrip } from "@/features/trips/use-trips"

interface CompleteTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: Trip
}

export function CompleteTripDialog({ open, onOpenChange, trip }: CompleteTripDialogProps) {
  const mutation = useCompleteTrip(trip.id)

  const { register, handleSubmit, reset, setError, formState } = useForm<
    CompleteTripInput,
    unknown,
    CompleteTripValues
  >({
    resolver: zodResolver(completeTripSchema),
    defaultValues: { endOdometer: "" as unknown as number, fuelConsumedL: "", actualDistanceKm: "", revenue: "" },
  })

  useEffect(() => {
    if (open) {
      reset({
        endOdometer: "" as unknown as number,
        fuelConsumedL: "",
        actualDistanceKm: "",
        revenue: trip.revenue ?? "",
      })
    }
  }, [open, trip, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values)
      onOpenChange(false)
    } catch (error) {
      applyFormErrors(error, setError)
    }
  })

  const errors = formState.errors

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete trip {trip.tripCode}</DialogTitle>
          <DialogDescription>
            Record the final readings to close out this trip.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <FormField label="End odometer (km)" htmlFor="endOdometer" required error={errors.endOdometer?.message}>
            <Input id="endOdometer" type="number" {...register("endOdometer")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Fuel consumed (L)" htmlFor="fuelConsumedL" error={errors.fuelConsumedL?.message}>
              <Input id="fuelConsumedL" type="number" step="0.01" {...register("fuelConsumedL")} />
            </FormField>
            <FormField label="Actual distance (km)" htmlFor="actualDistanceKm" error={errors.actualDistanceKm?.message}>
              <Input id="actualDistanceKm" type="number" step="0.01" {...register("actualDistanceKm")} />
            </FormField>
          </div>
          <FormField label="Revenue" htmlFor="revenue" error={errors.revenue?.message}>
            <Input id="revenue" type="number" step="0.01" {...register("revenue")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Complete trip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
