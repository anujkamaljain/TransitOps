import { Receipt } from "lucide-react"
import { EmptyState } from "@/components/states/empty-state"
import { TableSkeleton } from "@/components/states/table-skeleton"
import { EntityRowActions } from "@/components/data/entity-row-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EXPENSE_TYPE_LABELS } from "@/config/labels"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Expense } from "@/types/domain"
import { useDeleteExpense } from "@/features/expenses/use-expenses"

interface ExpenseTableProps {
  expenses: Expense[]
  isLoading: boolean
  canManage: boolean
  onEdit: (expense: Expense) => void
}

export function ExpenseTable({ expenses, isLoading, canManage, onEdit }: ExpenseTableProps) {
  const deleteMutation = useDeleteExpense()
  const columns = canManage ? 5 : 4

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Date</TableHead>
          {canManage && <TableHead className="w-12 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={columns} />
        ) : expenses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns} className="p-0">
              <EmptyState
                icon={Receipt}
                title="No expenses"
                description="Record tolls, permits, fines and other costs here."
              />
            </TableCell>
          </TableRow>
        ) : (
          expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                <p className="font-medium">{EXPENSE_TYPE_LABELS[expense.type]}</p>
                {expense.description && (
                  <p className="max-w-[16rem] truncate text-xs text-muted-foreground">
                    {expense.description}
                  </p>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {expense.vehicle?.registrationNumber ?? "—"}
              </TableCell>
              <TableCell className="text-right text-sm">{formatCurrency(expense.amount)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(expense.incurredAt)}
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <EntityRowActions
                    onEdit={() => onEdit(expense)}
                    deleteTitle="Delete this expense?"
                    deleteDescription="This expense entry will be permanently removed."
                    deleting={deleteMutation.isPending}
                    onDelete={() => deleteMutation.mutateAsync(expense.id)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
