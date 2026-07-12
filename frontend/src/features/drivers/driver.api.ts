import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type {
  Driver,
  DriverStatus,
  LicenseCategory,
  Paginated,
} from "@/types/domain"
import type { DriverFormValues } from "@/features/drivers/driver-schema"

export type ManageableDriverStatus = Extract<
  DriverStatus,
  "AVAILABLE" | "OFF_DUTY" | "SUSPENDED"
>

export interface DriverListParams {
  page: number
  pageSize: number
  search?: string
  status?: DriverStatus
  licenseCategory?: LicenseCategory
  expiry?: "expired" | "expiring" | "valid"
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

function clean(values: DriverFormValues) {
  return {
    ...values,
    email: values.email || undefined,
    region: values.region || undefined,
    notes: values.notes || undefined,
  }
}

export async function listDrivers(
  params: DriverListParams,
): Promise<Paginated<Driver>> {
  try {
    const { data } = await api.get<ApiSuccess<Driver[]>>("/drivers", { params })
    return { items: data.data, meta: data.meta ?? {} }
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createDriver(values: DriverFormValues): Promise<Driver> {
  try {
    const { data } = await api.post<ApiSuccess<Driver>>("/drivers", clean(values))
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateDriver(
  id: string,
  values: DriverFormValues,
): Promise<Driver> {
  try {
    const { licenseNumber: _licenseNumber, ...rest } = clean(values)
    const { data } = await api.patch<ApiSuccess<Driver>>(`/drivers/${id}`, rest)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateDriverStatus(
  id: string,
  status: ManageableDriverStatus,
): Promise<Driver> {
  try {
    const { data } = await api.patch<ApiSuccess<Driver>>(`/drivers/${id}/status`, {
      status,
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteDriver(id: string): Promise<void> {
  try {
    await api.delete(`/drivers/${id}`)
  } catch (error) {
    throw toApiError(error)
  }
}
