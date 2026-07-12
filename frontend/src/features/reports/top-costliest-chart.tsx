import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Coins } from "lucide-react"
import { EmptyState } from "@/components/states/empty-state"
import { formatCurrency } from "@/lib/format"
import { ChartCard } from "@/features/reports/chart-card"
import { CHART_TOOLTIP_STYLE } from "@/features/reports/chart-theme"
import type { VehicleReportRow } from "@/features/reports/reports.api"

export function TopCostliestChart({ data }: { data: VehicleReportRow[] }) {
  const points = data
    .filter((row) => row.operationalCost > 0)
    .map((row) => ({ name: row.registrationNumber, cost: row.operationalCost }))

  return (
    <ChartCard title="Top Operational Costs">
      {points.length === 0 ? (
        <EmptyState icon={Coins} title="No operational costs recorded yet" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={points}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="var(--muted-foreground)"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={90}
              fontSize={12}
              stroke="var(--muted-foreground)"
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value) => [formatCurrency(Number(value)), "Operational cost"]}
            />
            <Bar dataKey="cost" fill="var(--warning)" radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
