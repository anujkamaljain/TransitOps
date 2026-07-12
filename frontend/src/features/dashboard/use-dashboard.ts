import { useQuery } from "@tanstack/react-query"
import {
  getDashboard,
  getRecentTrips,
  type DashboardFilters,
} from "@/features/dashboard/dashboard.api"

export function useDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: ["dashboard", "kpis", filters],
    queryFn: () => getDashboard(filters),
  })
}

export function useRecentTrips(enabled: boolean) {
  return useQuery({
    queryKey: ["dashboard", "recent-trips"],
    queryFn: getRecentTrips,
    enabled,
  })
}
