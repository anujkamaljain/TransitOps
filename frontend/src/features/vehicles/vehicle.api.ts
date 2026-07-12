import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type {
  Paginated,
  Vehicle,
  VehicleStatus,
  VehicleType,
} from "@/types/domain"
import type { VehicleFormValues } from "@/features/vehicles/vehicle-schema"

export interface VehicleListParams {
  page: number
  pageSize: number
  search?: string
  type?: VehicleType
  status?: VehicleStatus
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function listVehicles(
  params: VehicleListParams,
): Promise<Paginated<Vehicle>> {
  try {
    const { data } = await api.get<ApiSuccess<Vehicle[]>>("/vehicles", { params })
    return { items: data.data, meta: data.meta ?? {} }
  } catch (error) {
    throw toApiError(error)
  }
}

function clean(payload: VehicleFormValues) {
  return {
    ...payload,
    region: payload.region || undefined,
    notes: payload.notes || undefined,
  }
}

export async function createVehicle(payload: VehicleFormValues): Promise<Vehicle> {
  try {
    const { data } = await api.post<ApiSuccess<Vehicle>>("/vehicles", clean(payload))
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateVehicle(
  id: string,
  payload: VehicleFormValues,
): Promise<Vehicle> {
  try {
    const { data } = await api.patch<ApiSuccess<Vehicle>>(`/vehicles/${id}`, clean(payload))
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateVehicleStatus(
  id: string,
  status: Extract<VehicleStatus, "AVAILABLE" | "RETIRED">,
): Promise<Vehicle> {
  try {
    const { data } = await api.patch<ApiSuccess<Vehicle>>(`/vehicles/${id}/status`, {
      status,
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  try {
    await api.delete(`/vehicles/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
