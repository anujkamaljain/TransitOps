import { useState } from "react"
import { Plus } from "lucide-react"
import { PaginationBar } from "@/components/data/pagination-bar"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePermission } from "@/hooks/use-permission"
import type { FuelLog } from "@/types/domain"
import { FuelFormDialog } from "@/features/fuel/fuel-form-dialog"
import { FuelTable } from "@/features/fuel/fuel-table"
import { useFuelLogs } from "@/features/fuel/use-fuel"

const PAGE_SIZE = 10

export function FuelPanel() {
  const canManage = usePermission("fuelExpenses", "manage")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FuelLog | null>(null)

  const { data, isLoading, isError, refetch, isFetching } = useFuelLogs({
    page,
    pageSize: PAGE_SIZE,
  })

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(log: FuelLog) {
    setEditing(log)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Log fuel
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 px-0 pb-4">
          {isError ? (
            <ErrorState title="Unable to load fuel logs" onRetry={() => refetch()} />
          ) : (
            <>
              <FuelTable
                logs={data?.items ?? []}
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
        <FuelFormDialog open={dialogOpen} onOpenChange={setDialogOpen} record={editing} />
      )}
    </div>
  )
}
