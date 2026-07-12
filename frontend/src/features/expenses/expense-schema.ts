import { z } from "zod"
import { EXPENSE_TYPES } from "@/types/domain"

export const expenseFormSchema = z.object({
  type: z.enum(EXPENSE_TYPES),
  amount: z.coerce
    .number({ message: "Enter a valid amount" })
    .positive("Amount must be greater than 0"),
  description: z.string().trim().max(500).optional(),
  incurredAt: z.string().min(1, "Date is required"),
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
})

export type ExpenseFormInput = z.input<typeof expenseFormSchema>
export type ExpenseFormValues = z.output<typeof expenseFormSchema>
