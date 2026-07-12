import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { EmptyState } from "@/components/states/empty-state"
import { TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { ChartCard } from "@/features/reports/chart-card"
import { CHART_TOOLTIP_STYLE } from "@/features/reports/chart-theme"

function label(month: string): string {
  const date = new Date(`${month}-01T00:00:00`)
  return Number.isNaN(date.getTime())
    ? month
    : date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
}

export function MonthlyRevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[]
}) {
  const points = data.map((entry) => ({ ...entry, label: label(entry.month) }))

  return (
    <ChartCard title="Monthly Revenue">
      {points.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No completed trips yet" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={70}
              stroke="var(--muted-foreground)"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
