import { z } from "zod";
import { ExpenseType } from "../../generated/prisma/enums.js";

export const createExpenseSchema = z.object({
  type: z.enum(ExpenseType),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().trim().max(500).optional(),
  incurredAt: z.coerce.date(),
  vehicleId: z.string().min(1).optional(),
  tripId: z.string().min(1).optional(),
  maintenanceLogId: z.string().min(1).optional(),
});

export const updateExpenseSchema = z
  .object({
    type: z.enum(ExpenseType).optional(),
    amount: z.coerce.number().positive().optional(),
    description: z.string().trim().max(500).optional(),
    incurredAt: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const listExpensesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(ExpenseType).optional(),
  vehicleId: z.string().min(1).optional(),
  tripId: z.string().min(1).optional(),
  sortBy: z.enum(["incurredAt", "amount", "createdAt"]).default("incurredAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const expenseIdParamSchema = z.object({
  id: z.string().min(1, "Expense id is required"),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ListExpensesQuery = z.infer<typeof listExpensesQuerySchema>;
