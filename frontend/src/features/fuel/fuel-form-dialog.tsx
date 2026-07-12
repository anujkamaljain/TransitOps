import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import { FUEL_TYPE_LABELS } from "@/config/labels"
import { applyFormErrors } from "@/lib/api/mutation-error"
import { usePermission } from "@/hooks/use-permission"
import { FUEL_TYPES, type FuelLog } from "@/types/domain"
import { fuelFormSchema, type FuelFormInput, type FuelFormValues } from "@/features/fuel/fuel-schema"
import { useCreateFuelLog, useUpdateFuelLog } from "@/features/fuel/use-fuel"
import { useTripOptions, useVehicleOptions } from "@/features/shared/reference-data"

interface FuelFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: FuelLog | null
}

const NONE = "none"

const EMPTY: FuelFormInput = {
  vehicleId: "",
  tripId: "",
  liters: "" as unknown as number,
  cost: "" as unknown as number,
  fuelType: undefined,
  odometer: "",
  filledAt: "",
}

export function FuelFormDialog({ open, onOpenChange, record }: FuelFormDialogProps) {
  const isEdit = Boolean(record)
  const canViewTrips = usePermission("trips", "view")
  const createMutation = useCreateFuelLog()
  const updateMutation = useUpdateFuelLog(record?.id ?? "")
  const mutation = isEdit ? updateMutation : createMutation
  const vehicles = useVehicleOptions(open)
  const trips = useTripOptions(open && canViewTrips && !isEdit)

  const { register, control, handleSubmit, reset, setError, formState } = useForm<
    FuelFormInput,
    unknown,
    FuelFormValues
  >({ resolver: zodResolver(fuelFormSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      record
        ? {
            vehicleId: record.vehicleId,
            tripId: record.tripId ?? "",
            liters: Number(record.liters),
            cost: Number(record.cost),
            fuelType: record.fuelType ?? undefined,
            odometer: record.odometer ?? "",
            filledAt: record.filledAt.slice(0, 10),
          }
        : EMPTY,
    )
  }, [open, record, reset])

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit fuel log" : "Log fuel"}</DialogTitle>
          <DialogDescription>Record a fuel fill for a vehicle.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Vehicle" required error={errors.vehicleId?.message}>
              <Controller
                control={control}
                name="vehicleId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isEdit}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {(vehicles.data ?? []).map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNumber} · {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            {canViewTrips && !isEdit && (
              <FormField label="Trip (optional)" error={errors.tripId?.message}>
                <Controller
                  control={control}
                  name="tripId"
                  render={({ field }) => (
                    <Select
                      value={field.value || NONE}
                      onValueChange={(value) => field.onChange(value === NONE ? "" : value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>None</SelectItem>
                        {(trips.data ?? []).map((trip) => (
                          <SelectItem key={trip.id} value={trip.id}>
                            {trip.tripCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            )}
            <FormField label="Liters" htmlFor="liters" required error={errors.liters?.message}>
              <Input id="liters" type="number" step="0.01" {...register("liters")} />
            </FormField>
            <FormField label="Cost" htmlFor="cost" required error={errors.cost?.message}>
              <Input id="cost" type="number" step="0.01" {...register("cost")} />
            </FormField>
            <FormField label="Fuel type" error={errors.fuelType?.message}>
              <Controller
                control={control}
                name="fuelType"
                render={({ field }) => (
                  <Select
                    value={field.value ?? NONE}
                    onValueChange={(value) =>
                      field.onChange(value === NONE ? undefined : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unspecified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Unspecified</SelectItem>
                      {FUEL_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {FUEL_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Odometer (km)" htmlFor="odometer" error={errors.odometer?.message}>
              <Input id="odometer" type="number" {...register("odometer")} />
            </FormField>
            <FormField label="Fill date" htmlFor="filledAt" required error={errors.filledAt?.message}>
              <Input id="filledAt" type="date" {...register("filledAt")} />
            </FormField>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Log fuel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
