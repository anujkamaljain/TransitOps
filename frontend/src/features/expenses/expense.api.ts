import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { Expense, ExpenseType, Paginated } from "@/types/domain"
import type { ExpenseFormValues } from "@/features/expenses/expense-schema"

export interface ExpenseListParams {
  page: number
  pageSize: number
  type?: ExpenseType
  vehicleId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function listExpenses(params: ExpenseListParams): Promise<Paginated<Expense>> {
  try {
    const { data } = await api.get<ApiSuccess<Expense[]>>("/expenses", { params })
    return { items: data.data, meta: data.meta ?? {} }
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createExpense(values: ExpenseFormValues): Promise<Expense> {
  try {
    const payload = {
      type: values.type,
      amount: values.amount,
      description: values.description || undefined,
      incurredAt: values.incurredAt,
      vehicleId: values.vehicleId || undefined,
      tripId: values.tripId || undefined,
    }
    const { data } = await api.post<ApiSuccess<Expense>>("/expenses", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateExpense(id: string, values: ExpenseFormValues): Promise<Expense> {
  try {
    const payload = {
      type: values.type,
      amount: values.amount,
      description: values.description || undefined,
      incurredAt: values.incurredAt,
    }
    const { data } = await api.patch<ApiSuccess<Expense>>(`/expenses/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await api.delete(`/expenses/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
