import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PaginationBar } from "@/components/data/pagination-bar"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { usePermission } from "@/hooks/use-permission"
import type { Vehicle, VehicleStatus, VehicleType } from "@/types/domain"
import { VehicleFilters } from "@/features/vehicles/vehicle-filters"
import { VehicleFormDialog } from "@/features/vehicles/vehicle-form-dialog"
import { VehicleTable } from "@/features/vehicles/vehicle-table"
import { useVehicles } from "@/features/vehicles/use-vehicles"

const PAGE_SIZE = 10

export function VehiclesPage() {
  const canManage = usePermission("fleet", "manage")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [type, setType] = useState<VehicleType | undefined>()
  const [status, setStatus] = useState<VehicleStatus | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, type, status])

  const params = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch || undefined,
      type,
      status,
    }),
    [page, debouncedSearch, type, status],
  )

  const { data, isLoading, isError, refetch, isFetching } = useVehicles(params)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(vehicle: Vehicle) {
    setEditing(vehicle)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        description="Manage your fleet, capacities, and lifecycle status."
        actions={
          canManage && (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add vehicle
            </Button>
          )
        }
      />

      <VehicleFilters
        search={search}
        onSearch={setSearch}
        type={type}
        onType={setType}
        status={status}
        onStatus={setStatus}
      />

      <Card>
        <CardContent className="space-y-4 px-0 pb-4">
          {isError ? (
            <ErrorState title="Unable to load vehicles" onRetry={() => refetch()} />
          ) : (
            <>
              <VehicleTable
                vehicles={data?.items ?? []}
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
        <VehicleFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          vehicle={editing}
        />
      )}
    </div>
  )
}
