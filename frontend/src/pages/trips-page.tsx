import { useCallback, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Plus, Route } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PaginationBar } from "@/components/data/pagination-bar"
import { EmptyState } from "@/components/states/empty-state"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "@/hooks/use-debounce"
import { usePermission } from "@/hooks/use-permission"
import { useRealtime } from "@/hooks/use-realtime"
import type { Trip, TripStatus } from "@/types/domain"
import { TripCard } from "@/features/trips/trip-card"
import { TripFilters } from "@/features/trips/trip-filters"
import { TripFormDialog } from "@/features/trips/trip-form-dialog"
import { useTrips } from "@/features/trips/use-trips"

const PAGE_SIZE = 9

export function TripsPage() {
  const canManage = usePermission("trips", "manage")
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<TripStatus | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Trip | null>(null)

  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status])

  const params = useMemo(
    () => ({ page, pageSize: PAGE_SIZE, search: debouncedSearch || undefined, status }),
    [page, debouncedSearch, status],
  )

  const { data, isLoading, isError, refetch } = useTrips(params)

  const onRealtime = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["trips"] })
  }, [queryClient])
  useRealtime(onRealtime)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(trip: Trip) {
    setEditing(trip)
    setDialogOpen(true)
  }

  const trips = data?.items ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Dispatcher"
        description="Plan, dispatch, and track trips across your fleet in real time."
        actions={
          canManage && (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Create trip
            </Button>
          )
        }
      />

      <TripFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} />

      {isError ? (
        <ErrorState title="Unable to load trips" onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No trips found"
          description="Create a trip to start dispatching your fleet."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} canManage={canManage} onEdit={openEdit} />
            ))}
          </div>
          <PaginationBar
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.meta.total ?? 0}
            onPageChange={setPage}
          />
        </>
      )}

      {canManage && (
        <TripFormDialog open={dialogOpen} onOpenChange={setDialogOpen} trip={editing} />
      )}
    </div>
  )
}
