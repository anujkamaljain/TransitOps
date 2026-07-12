import { useCallback, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PaginationBar } from "@/components/data/pagination-bar"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { usePermission } from "@/hooks/use-permission"
import { useRealtime } from "@/hooks/use-realtime"
import type { MaintenanceLog, MaintenanceStatus } from "@/types/domain"
import { MaintenanceFilters } from "@/features/maintenance/maintenance-filters"
import { MaintenanceFormDialog } from "@/features/maintenance/maintenance-form-dialog"
import { MaintenanceTable } from "@/features/maintenance/maintenance-table"
import { useMaintenanceList } from "@/features/maintenance/use-maintenance"

const PAGE_SIZE = 10

export function MaintenancePage() {
  const canManage = usePermission("maintenance", "manage")
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<MaintenanceStatus | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MaintenanceLog | null>(null)

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status])

  const params = useMemo(
    () => ({ page, pageSize: PAGE_SIZE, search: debouncedSearch || undefined, status }),
    [page, debouncedSearch, status],
  )

  const { data, isLoading, isError, refetch, isFetching } = useMaintenanceList(params)

  const onRealtime = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["maintenance"] })
  }, [queryClient])
  useRealtime(onRealtime)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(record: MaintenanceLog) {
    setEditing(record)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Log service work and keep vehicles road-ready."
        actions={
          canManage && (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Log maintenance
            </Button>
          )
        }
      />

      <MaintenanceFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
      />

      <Card>
        <CardContent className="space-y-4 px-0 pb-4">
          {isError ? (
            <ErrorState title="Unable to load maintenance" onRetry={() => refetch()} />
          ) : (
            <>
              <MaintenanceTable
                records={data?.items ?? []}
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
        <MaintenanceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} record={editing} />
      )}
    </div>
  )
}
