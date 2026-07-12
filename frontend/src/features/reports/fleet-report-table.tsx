import { Car } from "lucide-react"
import { EmptyState } from "@/components/states/empty-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatNumber } from "@/lib/format"
import type { VehicleReportRow } from "@/features/reports/reports.api"

function percent(value: number | null): string {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`
}

export function FleetReportTable({ rows }: { rows: VehicleReportRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Per-Vehicle Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {rows.length === 0 ? (
          <EmptyState icon={Car} title="No vehicles to report on" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Fuel</TableHead>
                <TableHead className="text-right">Maintenance</TableHead>
                <TableHead className="text-right">Operational</TableHead>
                <TableHead className="text-right">Efficiency</TableHead>
                <TableHead className="text-right">ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.vehicleId}>
                  <TableCell>
                    <p className="font-medium">{row.registrationNumber}</p>
                    <p className="text-xs text-muted-foreground">{row.name}</p>
                  </TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(row.revenue)}</TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(row.fuelCost)}</TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(row.maintenanceCost)}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(row.operationalCost)}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {row.fuelEfficiencyKmPerL === null
                      ? "—"
                      : `${formatNumber(row.fuelEfficiencyKmPerL)} km/L`}
                  </TableCell>
                  <TableCell className="text-right text-sm">{percent(row.roi)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
