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
import { applyFormErrors } from "@/lib/api/mutation-error"
import type { MaintenanceLog } from "@/types/domain"
import {
  maintenanceFormSchema,
  type MaintenanceFormInput,
  type MaintenanceFormValues,
} from "@/features/maintenance/maintenance-schema"
import {
  useCreateMaintenance,
  useUpdateMaintenance,
} from "@/features/maintenance/use-maintenance"
import { useVehicleOptions } from "@/features/shared/reference-data"

interface MaintenanceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: MaintenanceLog | null
}

const EMPTY: MaintenanceFormInput = {
  vehicleId: "",
  serviceType: "",
  description: "",
  cost: "" as unknown as number,
  serviceDate: "",
  odometerAtService: "",
}

export function MaintenanceFormDialog({
  open,
  onOpenChange,
  record,
}: MaintenanceFormDialogProps) {
  const isEdit = Boolean(record)
  const createMutation = useCreateMaintenance()
  const updateMutation = useUpdateMaintenance(record?.id ?? "")
  const mutation = isEdit ? updateMutation : createMutation
  const vehicles = useVehicleOptions(open)
  const assignable = (vehicles.data ?? []).filter((v) => v.status !== "RETIRED")

  const { register, control, handleSubmit, reset, setError, formState } = useForm<
    MaintenanceFormInput,
    unknown,
    MaintenanceFormValues
  >({ resolver: zodResolver(maintenanceFormSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      record
        ? {
            vehicleId: record.vehicleId,
            serviceType: record.serviceType,
            description: record.description ?? "",
            cost: Number(record.cost),
            serviceDate: record.serviceDate.slice(0, 10),
            odometerAtService: record.odometerAtService ?? "",
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
          <DialogTitle>{isEdit ? "Edit maintenance" : "Log maintenance"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this service record."
              : "Logging maintenance moves the vehicle to the shop."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
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
                    {assignable.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registrationNumber} · {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Service type" htmlFor="serviceType" required error={errors.serviceType?.message}>
              <Input id="serviceType" placeholder="Oil change" {...register("serviceType")} />
            </FormField>
            <FormField label="Cost" htmlFor="cost" required error={errors.cost?.message}>
              <Input id="cost" type="number" step="0.01" {...register("cost")} />
            </FormField>
            <FormField label="Service date" htmlFor="serviceDate" required error={errors.serviceDate?.message}>
              <Input id="serviceDate" type="date" {...register("serviceDate")} />
            </FormField>
            <FormField label="Odometer (km)" htmlFor="odometerAtService" error={errors.odometerAtService?.message}>
              <Input id="odometerAtService" type="number" {...register("odometerAtService")} />
            </FormField>
          </div>
          <FormField label="Description" htmlFor="description" error={errors.description?.message}>
            <Textarea id="description" rows={2} placeholder="Optional notes" {...register("description")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Log maintenance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
