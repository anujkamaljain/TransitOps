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
import { Textarea } from "@/components/ui/textarea"
import { VEHICLE_TYPE_LABELS } from "@/config/labels"
import { applyFormErrors } from "@/lib/api/mutation-error"
import { VEHICLE_TYPES, type Vehicle } from "@/types/domain"
import {
  vehicleFormSchema,
  type VehicleFormInput,
  type VehicleFormValues,
} from "@/features/vehicles/vehicle-schema"
import { useCreateVehicle, useUpdateVehicle } from "@/features/vehicles/use-vehicles"

interface VehicleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle | null
}

const EMPTY: VehicleFormInput = {
  registrationNumber: "",
  name: "",
  type: "TRUCK",
  maxLoadCapacityKg: 0,
  odometer: 0,
  acquisitionCost: 0,
  region: "",
  notes: "",
}

export function VehicleFormDialog({ open, onOpenChange, vehicle }: VehicleFormDialogProps) {
  const isEdit = Boolean(vehicle)
  const createMutation = useCreateVehicle()
  const updateMutation = useUpdateVehicle(vehicle?.id ?? "")
  const mutation = isEdit ? updateMutation : createMutation

  const form = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: EMPTY,
  })
  const { register, control, handleSubmit, reset, setError, formState } = form

  useEffect(() => {
    if (!open) return
    reset(
      vehicle
        ? {
            registrationNumber: vehicle.registrationNumber,
            name: vehicle.name,
            type: vehicle.type,
            maxLoadCapacityKg: Number(vehicle.maxLoadCapacityKg),
            odometer: vehicle.odometer,
            acquisitionCost: Number(vehicle.acquisitionCost),
            region: vehicle.region ?? "",
            notes: vehicle.notes ?? "",
          }
        : EMPTY,
    )
  }, [open, vehicle, reset])

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
          <DialogTitle>{isEdit ? "Edit vehicle" : "Add vehicle"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this vehicle."
              : "Register a new vehicle in the fleet."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Registration number" htmlFor="registrationNumber" required error={errors.registrationNumber?.message}>
              <Input id="registrationNumber" placeholder="MH12AB1234" {...register("registrationNumber")} />
            </FormField>
            <FormField label="Vehicle name" htmlFor="name" required error={errors.name?.message}>
              <Input id="name" placeholder="Tata Ace" {...register("name")} />
            </FormField>
            <FormField label="Type" required error={errors.type?.message}>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {VEHICLE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Max load capacity (kg)" htmlFor="maxLoadCapacityKg" required error={errors.maxLoadCapacityKg?.message}>
              <Input id="maxLoadCapacityKg" type="number" step="0.01" {...register("maxLoadCapacityKg")} />
            </FormField>
            <FormField label="Odometer (km)" htmlFor="odometer" required error={errors.odometer?.message}>
              <Input id="odometer" type="number" {...register("odometer")} />
            </FormField>
            <FormField label="Acquisition cost" htmlFor="acquisitionCost" required error={errors.acquisitionCost?.message}>
              <Input id="acquisitionCost" type="number" step="0.01" {...register("acquisitionCost")} />
            </FormField>
            <FormField label="Region" htmlFor="region" error={errors.region?.message}>
              <Input id="region" placeholder="West Zone" {...register("region")} />
            </FormField>
          </div>
          <FormField label="Notes" htmlFor="notes" error={errors.notes?.message}>
            <Textarea id="notes" rows={2} placeholder="Optional notes" {...register("notes")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
