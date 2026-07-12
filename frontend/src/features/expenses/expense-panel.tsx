import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { FilterSelect } from "@/components/data/filter-select"
import { PaginationBar } from "@/components/data/pagination-bar"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EXPENSE_TYPE_LABELS } from "@/config/labels"
import { usePermission } from "@/hooks/use-permission"
import { EXPENSE_TYPES, type Expense, type ExpenseType } from "@/types/domain"
import { ExpenseFormDialog } from "@/features/expenses/expense-form-dialog"
import { ExpenseTable } from "@/features/expenses/expense-table"
import { useExpenses } from "@/features/expenses/use-expenses"

const PAGE_SIZE = 10

const typeOptions = EXPENSE_TYPES.map((value) => ({
  value,
  label: EXPENSE_TYPE_LABELS[value],
}))

export function ExpensePanel() {
  const canManage = usePermission("fuelExpenses", "manage")
  const [page, setPage] = useState(1)
  const [type, setType] = useState<ExpenseType | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)

  useEffect(() => {
    setPage(1)
  }, [type])

  const { data, isLoading, isError, refetch, isFetching } = useExpenses({
    page,
    pageSize: PAGE_SIZE,
    type,
  })

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(expense: Expense) {
    setEditing(expense)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <FilterSelect
          value={type}
          onChange={(value) => setType(value as ExpenseType | undefined)}
          options={typeOptions}
          placeholder="Type"
          allLabel="All types"
          className="w-[160px]"
        />
        {canManage && (
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add expense
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-4 px-0 pb-4">
          {isError ? (
            <ErrorState title="Unable to load expenses" onRetry={() => refetch()} />
          ) : (
            <>
              <ExpenseTable
                expenses={data?.items ?? []}
                isLoading={isLoading || (isFetching && !data)}
                canManage={canManage}
                onEdit={openEdit}
              />
              <div className="px-4">
                <PaginationBar
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={data?.meta.total ?? 0}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {canManage && (
        <ExpenseFormDialog open={dialogOpen} onOpenChange={setDialogOpen} record={editing} />
      )}
    </div>
  )
}
