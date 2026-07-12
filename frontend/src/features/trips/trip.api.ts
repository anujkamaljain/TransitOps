import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { Paginated, Trip, TripStatus } from "@/types/domain"
import type {
  CompleteTripValues,
  TripFormValues,
} from "@/features/trips/trip-schema"

export interface TripListParams {
  page: number
  pageSize: number
  search?: string
  status?: TripStatus
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

function toPayload(values: TripFormValues) {
  return {
    source: values.source,
    destination: values.destination,
    cargoWeightKg: values.cargoWeightKg,
    plannedDistanceKm: values.plannedDistanceKm,
    vehicleId: values.vehicleId || undefined,
    driverId: values.driverId || undefined,
    revenue: values.revenue,
    etaMinutes: values.etaMinutes,
    notes: values.notes || undefined,
  }
}

export async function listTrips(params: TripListParams): Promise<Paginated<Trip>> {
  try {
    const { data } = await api.get<ApiSuccess<Trip[]>>("/trips", { params })
    return { items: data.data, meta: data.meta ?? {} }
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createTrip(values: TripFormValues): Promise<Trip> {
  try {
    const { data } = await api.post<ApiSuccess<Trip>>("/trips", toPayload(values))
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateTrip(id: string, values: TripFormValues): Promise<Trip> {
  try {
    const { data } = await api.patch<ApiSuccess<Trip>>(`/trips/${id}`, {
      ...toPayload(values),
      vehicleId: values.vehicleId || null,
      driverId: values.driverId || null,
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function dispatchTrip(id: string): Promise<Trip> {
  try {
    const { data } = await api.post<ApiSuccess<Trip>>(`/trips/${id}/dispatch`)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function completeTrip(
  id: string,
  values: CompleteTripValues,
): Promise<Trip> {
  try {
    const { data } = await api.post<ApiSuccess<Trip>>(`/trips/${id}/complete`, values)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function cancelTrip(id: string): Promise<Trip> {
  try {
    const { data } = await api.post<ApiSuccess<Trip>>(`/trips/${id}/cancel`)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteTrip(id: string): Promise<void> {
  try {
    await api.delete(`/trips/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
