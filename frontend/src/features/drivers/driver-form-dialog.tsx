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
import { LICENSE_CATEGORY_LABELS } from "@/config/labels"
import { applyFormErrors } from "@/lib/api/mutation-error"
import { LICENSE_CATEGORIES, type Driver } from "@/types/domain"
import {
  driverFormSchema,
  type DriverFormInput,
  type DriverFormValues,
} from "@/features/drivers/driver-schema"
import { useCreateDriver, useUpdateDriver } from "@/features/drivers/use-drivers"

interface DriverFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver?: Driver | null
}

const EMPTY: DriverFormInput = {
  fullName: "",
  licenseNumber: "",
  licenseCategory: "LMV",
  licenseExpiry: "",
  contactNumber: "",
  email: "",
  safetyScore: 100,
  region: "",
  notes: "",
}

export function DriverFormDialog({ open, onOpenChange, driver }: DriverFormDialogProps) {
  const isEdit = Boolean(driver)
  const createMutation = useCreateDriver()
  const updateMutation = useUpdateDriver(driver?.id ?? "")
  const mutation = isEdit ? updateMutation : createMutation

  const { register, control, handleSubmit, reset, setError, formState } =
    useForm<DriverFormInput, unknown, DriverFormValues>({
      resolver: zodResolver(driverFormSchema),
      defaultValues: EMPTY,
    })

  useEffect(() => {
    if (!open) return
    reset(
      driver
        ? {
            fullName: driver.fullName,
            licenseNumber: driver.licenseNumber,
            licenseCategory: driver.licenseCategory,
            licenseExpiry: driver.licenseExpiry.slice(0, 10),
            contactNumber: driver.contactNumber,
            email: driver.email ?? "",
            safetyScore: driver.safetyScore,
            region: driver.region ?? "",
            notes: driver.notes ?? "",
          }
        : EMPTY,
    )
  }, [open, driver, reset])

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
          <DialogTitle>{isEdit ? "Edit driver" : "Add driver"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this driver's profile and license details."
              : "Register a new driver in the roster."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
              <Input id="fullName" placeholder="Rajesh Kumar" {...register("fullName")} />
            </FormField>
            <FormField label="License number" htmlFor="licenseNumber" required error={errors.licenseNumber?.message}>
              <Input id="licenseNumber" placeholder="DL0420110012345" disabled={isEdit} {...register("licenseNumber")} />
            </FormField>
            <FormField label="License category" required error={errors.licenseCategory?.message}>
              <Controller
                control={control}
                name="licenseCategory"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {LICENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {LICENSE_CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="License expiry" htmlFor="licenseExpiry" required error={errors.licenseExpiry?.message}>
              <Input id="licenseExpiry" type="date" {...register("licenseExpiry")} />
            </FormField>
            <FormField label="Contact number" htmlFor="contactNumber" required error={errors.contactNumber?.message}>
              <Input id="contactNumber" placeholder="+91 98765 43210" {...register("contactNumber")} />
            </FormField>
            <FormField label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" placeholder="driver@example.com" {...register("email")} />
            </FormField>
            <FormField label="Safety score" htmlFor="safetyScore" required error={errors.safetyScore?.message}>
              <Input id="safetyScore" type="number" min={0} max={100} {...register("safetyScore")} />
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
              {isEdit ? "Save changes" : "Add driver"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
