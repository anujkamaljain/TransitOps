import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { FuelLog, FuelType, Paginated } from "@/types/domain"
import type { FuelFormValues } from "@/features/fuel/fuel-schema"

export interface FuelListParams {
  page: number
  pageSize: number
  vehicleId?: string
  fuelType?: FuelType
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function listFuelLogs(params: FuelListParams): Promise<Paginated<FuelLog>> {
  try {
    const { data } = await api.get<ApiSuccess<FuelLog[]>>("/fuel-logs", { params })
    return { items: data.data, meta: data.meta ?? {} }
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createFuelLog(values: FuelFormValues): Promise<FuelLog> {
  try {
    const payload = {
      ...values,
      tripId: values.tripId || undefined,
      fuelType: values.fuelType || undefined,
    }
    const { data } = await api.post<ApiSuccess<FuelLog>>("/fuel-logs", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateFuelLog(id: string, values: FuelFormValues): Promise<FuelLog> {
  try {
    const payload = {
      liters: values.liters,
      cost: values.cost,
      fuelType: values.fuelType || undefined,
      odometer: values.odometer,
      filledAt: values.filledAt,
    }
    const { data } = await api.patch<ApiSuccess<FuelLog>>(`/fuel-logs/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteFuelLog(id: string): Promise<void> {
  try {
    await api.delete(`/fuel-logs/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
