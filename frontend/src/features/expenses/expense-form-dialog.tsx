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
import { EXPENSE_TYPE_LABELS } from "@/config/labels"
import { applyFormErrors } from "@/lib/api/mutation-error"
import { EXPENSE_TYPES, type Expense } from "@/types/domain"
import {
  expenseFormSchema,
  type ExpenseFormInput,
  type ExpenseFormValues,
} from "@/features/expenses/expense-schema"
import { useCreateExpense, useUpdateExpense } from "@/features/expenses/use-expenses"
import { useVehicleOptions } from "@/features/shared/reference-data"

interface ExpenseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: Expense | null
}

const NONE = "none"

const EMPTY: ExpenseFormInput = {
  type: "TOLL",
  amount: "" as unknown as number,
  description: "",
  incurredAt: "",
  vehicleId: "",
  tripId: "",
}

export function ExpenseFormDialog({ open, onOpenChange, record }: ExpenseFormDialogProps) {
  const isEdit = Boolean(record)
  const createMutation = useCreateExpense()
  const updateMutation = useUpdateExpense(record?.id ?? "")
  const mutation = isEdit ? updateMutation : createMutation
  const vehicles = useVehicleOptions(open && !isEdit)

  const { register, control, handleSubmit, reset, setError, formState } = useForm<
    ExpenseFormInput,
    unknown,
    ExpenseFormValues
  >({ resolver: zodResolver(expenseFormSchema), defaultValues: EMPTY })

  useEffect(() => {
    if (!open) return
    reset(
      record
        ? {
            type: record.type,
            amount: Number(record.amount),
            description: record.description ?? "",
            incurredAt: record.incurredAt.slice(0, 10),
            vehicleId: record.vehicleId ?? "",
            tripId: record.tripId ?? "",
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
          <DialogTitle>{isEdit ? "Edit expense" : "Add expense"}</DialogTitle>
          <DialogDescription>Record an operational expense.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
                      {EXPENSE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {EXPENSE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Amount" htmlFor="amount" required error={errors.amount?.message}>
              <Input id="amount" type="number" step="0.01" {...register("amount")} />
            </FormField>
            <FormField label="Date" htmlFor="incurredAt" required error={errors.incurredAt?.message}>
              <Input id="incurredAt" type="date" {...register("incurredAt")} />
            </FormField>
            {!isEdit && (
              <FormField label="Vehicle (optional)" error={errors.vehicleId?.message}>
                <Controller
                  control={control}
                  name="vehicleId"
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
            )}
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
              {isEdit ? "Save changes" : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
