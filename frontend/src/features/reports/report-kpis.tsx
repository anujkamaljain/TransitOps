import { Coins, Fuel, Gauge, TrendingUp, Wallet, Wrench } from "lucide-react"
import { KpiCard } from "@/features/dashboard/kpi-card"
import { formatCurrency, formatNumber } from "@/lib/format"
import type { FleetReport } from "@/features/reports/reports.api"

function percent(value: number | null): string {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`
}

export function ReportKpis({ summary }: { summary: FleetReport["summary"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard label="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon={TrendingUp} tone="success" hint="Completed trips" />
      <KpiCard label="Operational Cost" value={formatCurrency(summary.totalOperationalCost)} icon={Coins} tone="warning" hint="Fuel + maintenance" />
      <KpiCard label="Fleet ROI" value={percent(summary.fleetRoi)} icon={Wallet} tone="info" hint="Net return on acquisition" />
      <KpiCard label="Fuel Cost" value={formatCurrency(summary.totalFuelCost)} icon={Fuel} tone="neutral" hint={`${formatNumber(summary.totalFuelLiters)} L total`} />
      <KpiCard label="Maintenance Cost" value={formatCurrency(summary.totalMaintenanceCost)} icon={Wrench} tone="neutral" hint="Service spend" />
      <KpiCard
        label="Fuel Efficiency"
        value={summary.fleetFuelEfficiencyKmPerL === null ? "—" : `${summary.fleetFuelEfficiencyKmPerL} km/L`}
        icon={Gauge}
        tone="info"
        hint={`${formatNumber(summary.totalDistanceKm)} km driven`}
      />
    </div>
  )
}
