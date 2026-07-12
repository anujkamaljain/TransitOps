import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { applyFormErrors } from "@/lib/api/mutation-error"
import type { Trip } from "@/types/domain"
import {
  tripFormSchema,
  type TripFormInput,
  type TripFormValues,
} from "@/features/trips/trip-schema"
import { CapacityHint } from "@/features/trips/capacity-hint"
import { useCreateTrip, useUpdateTrip } from "@/features/trips/use-trips"
import { useDriverOptions, useVehicleOptions } from "@/features/shared/reference-data"

interface TripFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip?: Trip | null
}

const NONE = "none"

const EMPTY: TripFormInput = {
  source: "",
  destination: "",
  cargoWeightKg: "" as unknown as number,
  plannedDistanceKm: "" as unknown as number,
  vehicleId: "",
  driverId: "",
  revenue: "",
  etaMinutes: "",
  notes: "",
}

export function TripFormDialog({ open, onOpenChange, trip }: TripFormDialogProps) {
  const isEdit = Boolean(trip)
  const createMutation = useCreateTrip()
  const updateMutation = useUpdateTrip(trip?.id ?? "")
  const mutation = isEdit ? updateMutation : createMutation

  const vehicles = useVehicleOptions(open)
  const drivers = useDriverOptions(open)
  const availableVehicles = (vehicles.data ?? []).filter((v) => v.status === "AVAILABLE")
  const availableDrivers = (drivers.data ?? []).filter((d) => d.status === "AVAILABLE")

  const { register, control, handleSubmit, reset, setError, formState } = useForm<
    TripFormInput,
    unknown,
    TripFormValues
  >({ resolver: zodResolver(tripFormSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      trip
        ? {
            source: trip.source,
            destination: trip.destination,
            cargoWeightKg: Number(trip.cargoWeightKg),
            plannedDistanceKm: Number(trip.plannedDistanceKm),
            vehicleId: trip.vehicleId ?? "",
            driverId: trip.driverId ?? "",
            revenue: trip.revenue ?? "",
            etaMinutes: trip.etaMinutes ?? "",
            notes: trip.notes ?? "",
          }
        : EMPTY,
    )
  }, [open, trip, reset])

  const watchedVehicle = useWatch({ control, name: "vehicleId" })
  const watchedCargo = useWatch({ control, name: "cargoWeightKg" })
  const selectedVehicle = availableVehicles.find((v) => v.id === watchedVehicle)

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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit trip" : "Create trip"}</DialogTitle>
          <DialogDescription>
            Assign a vehicle and driver, then dispatch when ready.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Source" htmlFor="source" required error={errors.source?.message}>
              <Input id="source" placeholder="Mumbai" {...register("source")} />
            </FormField>
            <FormField label="Destination" htmlFor="destination" required error={errors.destination?.message}>
              <Input id="destination" placeholder="Pune" {...register("destination")} />
            </FormField>
            <FormField label="Cargo weight (kg)" htmlFor="cargoWeightKg" required error={errors.cargoWeightKg?.message}>
              <Input id="cargoWeightKg" type="number" step="0.01" {...register("cargoWeightKg")} />
            </FormField>
            <FormField label="Planned distance (km)" htmlFor="plannedDistanceKm" required error={errors.plannedDistanceKm?.message}>
              <Input id="plannedDistanceKm" type="number" step="0.01" {...register("plannedDistanceKm")} />
            </FormField>
            <FormField label="Vehicle" error={errors.vehicleId?.message}>
              <Controller
                control={control}
                name="vehicleId"
                render={({ field }) => (
                  <Select
                    value={field.value || NONE}
                    onValueChange={(value) => field.onChange(value === NONE ? "" : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Unassigned</SelectItem>
                      {availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNumber} · {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Driver" error={errors.driverId?.message}>
              <Controller
                control={control}
                name="driverId"
                render={({ field }) => (
                  <Select
                    value={field.value || NONE}
                    onValueChange={(value) => field.onChange(value === NONE ? "" : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Unassigned</SelectItem>
                      {availableDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Revenue" htmlFor="revenue" error={errors.revenue?.message}>
              <Input id="revenue" type="number" step="0.01" {...register("revenue")} />
            </FormField>
            <FormField label="ETA (minutes)" htmlFor="etaMinutes" error={errors.etaMinutes?.message}>
              <Input id="etaMinutes" type="number" {...register("etaMinutes")} />
            </FormField>
          </div>

          <CapacityHint vehicle={selectedVehicle} cargoWeightKg={Number(watchedCargo)} />

          <FormField label="Notes" htmlFor="notes" error={errors.notes?.message}>
            <Textarea id="notes" rows={2} placeholder="Optional notes" {...register("notes")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
