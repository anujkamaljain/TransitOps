import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ErrorState } from "@/components/states/error-state"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { usePermission } from "@/hooks/use-permission"
import { useRealtime } from "@/hooks/use-realtime"
import { DashboardFilters } from "@/features/dashboard/dashboard-filters"
import { KpiGrid } from "@/features/dashboard/kpi-grid"
import { RecentTrips } from "@/features/dashboard/recent-trips"
import { StatusDistribution } from "@/features/dashboard/status-distribution"
import { useDashboard } from "@/features/dashboard/use-dashboard"
import type { DashboardFilters as Filters } from "@/features/dashboard/dashboard.api"

export function DashboardPage() {
  const { user } = useAuth()
  const canViewTrips = usePermission("trips", "view")
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>({})
  const { data, isLoading, isError, refetch } = useDashboard(filters)

  const onRealtime = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  }, [queryClient])
  useRealtime(onRealtime)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.fullName.split(" ")[0] ?? "there"}`}
        description="Your live fleet overview and operational KPIs."
        actions={<DashboardFilters filters={filters} onChange={setFilters} />}
      />

      {isError ? (
        <ErrorState
          title="Unable to load the dashboard"
          onRetry={() => refetch()}
        />
      ) : isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <KpiGrid data={data} />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTrips enabled={canViewTrips} />
            </div>
            <StatusDistribution
              title="Fleet Status"
              segments={[
                { label: "Available", value: data.vehicles.available, tone: "success" },
                { label: "On Trip", value: data.vehicles.onTrip, tone: "info" },
                { label: "In Shop", value: data.vehicles.inShop, tone: "warning" },
                { label: "Retired", value: data.vehicles.retired, tone: "danger" },
              ]}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <StatusDistribution
              title="Trips"
              segments={[
                { label: "Draft", value: data.trips.draft, tone: "neutral" },
                { label: "Dispatched", value: data.trips.dispatched, tone: "info" },
                { label: "Completed", value: data.trips.completed, tone: "success" },
                { label: "Cancelled", value: data.trips.cancelled, tone: "danger" },
              ]}
            />
            <StatusDistribution
              title="Drivers"
              segments={[
                { label: "Available", value: data.drivers.available, tone: "success" },
                { label: "On Trip", value: data.drivers.onTrip, tone: "info" },
                { label: "Off Duty", value: data.drivers.offDuty, tone: "neutral" },
                { label: "Suspended", value: data.drivers.suspended, tone: "danger" },
              ]}
            />
          </div>
        </>
      )}
    </div>
  )
}
