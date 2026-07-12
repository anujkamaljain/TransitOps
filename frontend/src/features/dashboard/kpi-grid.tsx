import {
  Activity,
  CheckCircle2,
  Clock,
  Gauge,
  Truck,
  UserCheck,
  Wrench,
} from "lucide-react"
import { KpiCard } from "@/features/dashboard/kpi-card"
import type { DashboardData } from "@/features/dashboard/dashboard.api"

export function KpiGrid({ data }: { data: DashboardData }) {
  const { kpis } = data

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Active Vehicles" value={kpis.activeVehicles} icon={Truck} tone="info" hint="Currently on trips" />
      <KpiCard label="Available Vehicles" value={kpis.availableVehicles} icon={CheckCircle2} tone="success" hint="Ready to dispatch" />
      <KpiCard label="In Maintenance" value={kpis.vehiclesInMaintenance} icon={Wrench} tone="warning" hint="Vehicles in the shop" />
      <KpiCard label="Fleet Utilization" value={`${kpis.fleetUtilizationPct}%`} icon={Gauge} tone="neutral" hint="On-trip vs operational" />
      <KpiCard label="Active Trips" value={kpis.activeTrips} icon={Activity} tone="info" hint="Dispatched right now" />
      <KpiCard label="Pending Trips" value={kpis.pendingTrips} icon={Clock} tone="neutral" hint="Draft, awaiting dispatch" />
      <KpiCard label="Drivers On Duty" value={kpis.driversOnDuty} icon={UserCheck} tone="success" hint="Assigned to trips" />
      <KpiCard label="Total Vehicles" value={data.vehicles.total} icon={Truck} tone="neutral" hint="Across the fleet" />
    </div>
  )
}
