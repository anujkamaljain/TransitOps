import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PaginationBar } from "@/components/data/pagination-bar"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { usePermission } from "@/hooks/use-permission"
import type { Driver, DriverStatus, LicenseCategory } from "@/types/domain"
import { DriverFilters } from "@/features/drivers/driver-filters"
import { DriverFormDialog } from "@/features/drivers/driver-form-dialog"
import { DriverTable } from "@/features/drivers/driver-table"
import { useDrivers } from "@/features/drivers/use-drivers"

const PAGE_SIZE = 10

type Expiry = "expired" | "expiring" | "valid"

export function DriversPage() {
  const canManage = usePermission("drivers", "manage")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<DriverStatus | undefined>()
  const [category, setCategory] = useState<LicenseCategory | undefined>()
  const [expiry, setExpiry] = useState<Expiry | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, category, expiry])

  const params = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status,
      licenseCategory: category,
      expiry,
    }),
    [page, debouncedSearch, status, category, expiry],
  )

  const { data, isLoading, isError, refetch, isFetching } = useDrivers(params)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(driver: Driver) {
    setEditing(driver)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Track your roster, licenses, and duty status."
        actions={
          canManage && (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add driver
            </Button>
          )
        }
      />

      <DriverFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        category={category}
        onCategory={setCategory}
        expiry={expiry}
        onExpiry={setExpiry}
      />

      <Card>
        <CardContent className="space-y-4 px-0 pb-4">
          {isError ? (
            <ErrorState title="Unable to load drivers" onRetry={() => refetch()} />
          ) : (
            <>
              <DriverTable
                drivers={data?.items ?? []}
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
        <DriverFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          driver={editing}
        />
      )}
    </div>
  )
}
