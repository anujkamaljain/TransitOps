import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { Driver, TripListItem, Vehicle } from "@/types/domain"

async function fetchList<T>(url: string, params: Record<string, unknown>): Promise<T[]> {
  try {
    const { data } = await api.get<ApiSuccess<T[]>>(url, { params })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

const LIST_PARAMS = { page: 1, pageSize: 100 }

export function useVehicleOptions(enabled = true) {
  return useQuery({
    queryKey: ["options", "vehicles"],
    queryFn: () =>
      fetchList<Vehicle>("/vehicles", {
        ...LIST_PARAMS,
        sortBy: "registrationNumber",
        sortOrder: "asc",
      }),
    enabled,
    staleTime: 60_000,
  })
}

export function useDriverOptions(enabled = true) {
  return useQuery({
    queryKey: ["options", "drivers"],
    queryFn: () =>
      fetchList<Driver>("/drivers", {
        ...LIST_PARAMS,
        sortBy: "fullName",
        sortOrder: "asc",
      }),
    enabled,
    staleTime: 60_000,
  })
}

export function useTripOptions(enabled = true) {
  return useQuery({
    queryKey: ["options", "trips"],
    queryFn: () =>
      fetchList<TripListItem>("/trips", {
        ...LIST_PARAMS,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled,
    staleTime: 60_000,
  })
}
