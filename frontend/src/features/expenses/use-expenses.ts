import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
  type ExpenseListParams,
} from "@/features/expenses/expense.api"
import type { ExpenseFormValues } from "@/features/expenses/expense-schema"

const KEY = ["expenses"]

export function useExpenses(params: ExpenseListParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => listExpenses(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: KEY })
    void queryClient.invalidateQueries({ queryKey: ["reports"] })
  }
}

export function useCreateExpense() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (values: ExpenseFormValues) => createExpense(values),
    onSuccess: () => {
      invalidate()
      toast.success("Expense added")
    },
  })
}

export function useUpdateExpense(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (values: ExpenseFormValues) => updateExpense(id, values),
    onSuccess: () => {
      invalidate()
      toast.success("Expense updated")
    },
  })
}

export function useDeleteExpense() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      invalidate()
      toast.success("Expense deleted")
    },
  })
}
