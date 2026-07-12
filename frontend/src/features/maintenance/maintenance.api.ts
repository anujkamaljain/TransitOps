import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { MaintenanceLog, MaintenanceStatus, Paginated } from "@/types/domain"
import type { MaintenanceFormValues } from "@/features/maintenance/maintenance-schema"

export interface MaintenanceListParams {
  page: number
  pageSize: number
  search?: string
  status?: MaintenanceStatus
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

function clean(values: MaintenanceFormValues) {
  return { ...values, description: values.description || undefined }
}

export async function listMaintenance(
  params: MaintenanceListParams,
): Promise<Paginated<MaintenanceLog>> {
  try {
    const { data } = await api.get<ApiSuccess<MaintenanceLog[]>>("/maintenance", { params })
    return { items: data.data, meta: data.meta ?? {} }
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createMaintenance(
  values: MaintenanceFormValues,
): Promise<MaintenanceLog> {
  try {
    const { data } = await api.post<ApiSuccess<MaintenanceLog>>("/maintenance", clean(values))
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateMaintenance(
  id: string,
  values: MaintenanceFormValues,
): Promise<MaintenanceLog> {
  try {
    const { vehicleId: _vehicleId, ...rest } = clean(values)
    const { data } = await api.patch<ApiSuccess<MaintenanceLog>>(`/maintenance/${id}`, rest)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function closeMaintenance(id: string): Promise<MaintenanceLog> {
  try {
    const { data } = await api.post<ApiSuccess<MaintenanceLog>>(`/maintenance/${id}/close`)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteMaintenance(id: string): Promise<void> {
  try {
    await api.delete(`/maintenance/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
