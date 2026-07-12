import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"

export interface VehicleReportRow {
  vehicleId: string
  registrationNumber: string
  name: string
  acquisitionCost: number
  revenue: number
  fuelCost: number
  fuelLiters: number
  maintenanceCost: number
  operationalCost: number
  distanceKm: number
  fuelEfficiencyKmPerL: number | null
  roi: number | null
}

export interface FleetReport {
  summary: {
    totalRevenue: number
    totalFuelCost: number
    totalMaintenanceCost: number
    totalOperationalCost: number
    totalDistanceKm: number
    totalFuelLiters: number
    fleetFuelEfficiencyKmPerL: number | null
    fleetRoi: number | null
    fleetUtilizationPct: number
  }
  vehicles: VehicleReportRow[]
  monthlyRevenue: { month: string; revenue: number }[]
  topCostliest: VehicleReportRow[]
}

export async function getFleetReport(): Promise<FleetReport> {
  try {
    const { data } = await api.get<ApiSuccess<FleetReport>>("/analytics/reports")
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function downloadReportCsv(): Promise<void> {
  try {
    const response = await api.get("/analytics/reports/export", { responseType: "blob" })
    const url = URL.createObjectURL(response.data as Blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "transitops-fleet-report.csv"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch (error) {
    throw toApiError(error)
  }
}
