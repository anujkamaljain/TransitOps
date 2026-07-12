import type { ResponseMeta } from "@/types/api"

export const VEHICLE_TYPES = ["VAN", "TRUCK", "MINI", "BUS", "TRAILER", "CAR"] as const
export type VehicleType = (typeof VEHICLE_TYPES)[number]

export const VEHICLE_STATUSES = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"] as const
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number]

export const DRIVER_STATUSES = ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"] as const
export type DriverStatus = (typeof DRIVER_STATUSES)[number]

export const LICENSE_CATEGORIES = ["LMV", "HMV", "MCWG", "PSV", "TRANS"] as const
export type LicenseCategory = (typeof LICENSE_CATEGORIES)[number]

export const TRIP_STATUSES = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"] as const
export type TripStatus = (typeof TRIP_STATUSES)[number]

export interface Vehicle {
  id: string
  registrationNumber: string
  name: string
  type: VehicleType
  maxLoadCapacityKg: string
  odometer: number
  acquisitionCost: string
  status: VehicleStatus
  region: string | null
  acquiredAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Driver {
  id: string
  fullName: string
  licenseNumber: string
  licenseCategory: LicenseCategory
  licenseExpiry: string
  contactNumber: string
  email: string | null
  safetyScore: number
  status: DriverStatus
  region: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  daysUntilLicenseExpiry: number
  isLicenseExpired: boolean
  licenseExpiringSoon: boolean
}

export interface TripListItem {
  id: string
  tripCode: string
  source: string
  destination: string
  status: TripStatus
  cargoWeightKg: string
  plannedDistanceKm: string
  revenue: string | null
  dispatchedAt: string | null
  completedAt: string | null
  createdAt: string
  vehicle: { id: string; registrationNumber: string; name: string } | null
  driver: { id: string; fullName: string } | null
}

export interface Paginated<T> {
  items: T[]
  meta: ResponseMeta
}
