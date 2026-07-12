import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { TripListItem, VehicleStatus, VehicleType } from "@/types/domain"

export interface DashboardFilters {
  type?: VehicleType
  status?: VehicleStatus
  region?: string
}

export interface DashboardData {
  kpis: {
    activeVehicles: number
    availableVehicles: number
    vehiclesInMaintenance: number
    activeTrips: number
    pendingTrips: number
    driversOnDuty: number
    fleetUtilizationPct: number
  }
  vehicles: {
    total: number
    available: number
    onTrip: number
    inShop: number
    retired: number
  }
  trips: { draft: number; dispatched: number; completed: number; cancelled: number }
  drivers: { available: number; onTrip: number; offDuty: number; suspended: number }
  matchingVehicles: number
}

export async function getDashboard(filters: DashboardFilters): Promise<DashboardData> {
  try {
    const { data } = await api.get<ApiSuccess<DashboardData>>("/analytics/dashboard", {
      params: filters,
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getRecentTrips(): Promise<TripListItem[]> {
  try {
    const { data } = await api.get<ApiSuccess<TripListItem[]>>("/trips", {
      params: { pageSize: 6, sortBy: "createdAt", sortOrder: "desc" },
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}
