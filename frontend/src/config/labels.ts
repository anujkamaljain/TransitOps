import type {
  DriverStatus,
  LicenseCategory,
  TripStatus,
  VehicleStatus,
  VehicleType,
} from "@/types/domain"

export type StatusTone = "success" | "info" | "warning" | "danger" | "neutral"

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  VAN: "Van",
  TRUCK: "Truck",
  MINI: "Mini",
  BUS: "Bus",
  TRAILER: "Trailer",
  CAR: "Car",
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
}

export const VEHICLE_STATUS_TONES: Record<VehicleStatus, StatusTone> = {
  AVAILABLE: "success",
  ON_TRIP: "info",
  IN_SHOP: "warning",
  RETIRED: "danger",
}

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
}

export const DRIVER_STATUS_TONES: Record<DriverStatus, StatusTone> = {
  AVAILABLE: "success",
  ON_TRIP: "info",
  OFF_DUTY: "neutral",
  SUSPENDED: "danger",
}

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export const TRIP_STATUS_TONES: Record<TripStatus, StatusTone> = {
  DRAFT: "neutral",
  DISPATCHED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
}

export const LICENSE_CATEGORY_LABELS: Record<LicenseCategory, string> = {
  LMV: "LMV · Light Motor",
  HMV: "HMV · Heavy Motor",
  MCWG: "MCWG · Motorcycle",
  PSV: "PSV · Passenger",
  TRANS: "TRANS · Transport",
}
