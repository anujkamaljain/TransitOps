import { Fuel } from "lucide-react"
import { EmptyState } from "@/components/states/empty-state"
import { TableSkeleton } from "@/components/states/table-skeleton"
import { EntityRowActions } from "@/components/data/entity-row-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FUEL_TYPE_LABELS } from "@/config/labels"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import type { FuelLog } from "@/types/domain"
import { useDeleteFuelLog } from "@/features/fuel/use-fuel"

interface FuelTableProps {
  logs: FuelLog[]
  isLoading: boolean
  canManage: boolean
  onEdit: (log: FuelLog) => void
}

export function FuelTable({ logs, isLoading, canManage, onEdit }: FuelTableProps) {
  const deleteMutation = useDeleteFuelLog()
  const columns = canManage ? 6 : 5

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Fuel</TableHead>
          <TableHead className="text-right">Liters</TableHead>
          <TableHead className="text-right">Cost</TableHead>
          <TableHead>Filled</TableHead>
          {canManage && <TableHead className="w-12 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={columns} />
        ) : logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns} className="p-0">
              <EmptyState
                icon={Fuel}
                title="No fuel logs"
                description="Record a fuel fill to start tracking consumption."
              />
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <p className="font-medium">{log.vehicle?.registrationNumber ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{log.vehicle?.name}</p>
              </TableCell>
              <TableCell className="text-sm">
                {log.fuelType ? FUEL_TYPE_LABELS[log.fuelType] : "—"}
              </TableCell>
              <TableCell className="text-right text-sm">{formatNumber(log.liters)}</TableCell>
              <TableCell className="text-right text-sm">{formatCurrency(log.cost)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(log.filledAt)}
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <EntityRowActions
                    onEdit={() => onEdit(log)}
                    deleteTitle="Delete this fuel log?"
                    deleteDescription="This fuel entry will be permanently removed."
                    deleting={deleteMutation.isPending}
                    onDelete={() => deleteMutation.mutateAsync(log.id)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
