import { Wrench } from "lucide-react"
import { EmptyState } from "@/components/states/empty-state"
import { TableSkeleton } from "@/components/states/table-skeleton"
import { StatusBadge } from "@/components/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MAINTENANCE_STATUS_LABELS, MAINTENANCE_STATUS_TONES } from "@/config/labels"
import { formatCurrency, formatDate } from "@/lib/format"
import type { MaintenanceLog } from "@/types/domain"
import { MaintenanceRowActions } from "@/features/maintenance/maintenance-row-actions"

interface MaintenanceTableProps {
  records: MaintenanceLog[]
  isLoading: boolean
  canManage: boolean
  onEdit: (record: MaintenanceLog) => void
}

export function MaintenanceTable({
  records,
  isLoading,
  canManage,
  onEdit,
}: MaintenanceTableProps) {
  const columns = canManage ? 5 : 4

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Service</TableHead>
          <TableHead className="text-right">Cost</TableHead>
          <TableHead>Status</TableHead>
          {canManage && <TableHead className="w-12 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={columns} />
        ) : records.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns} className="p-0">
              <EmptyState
                icon={Wrench}
                title="No maintenance records"
                description="Log a service to move a vehicle into the shop."
              />
            </TableCell>
          </TableRow>
        ) : (
          records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <p className="font-medium">{record.vehicle?.registrationNumber ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{record.vehicle?.name}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm">{record.serviceType}</p>
                <p className="text-xs text-muted-foreground">{formatDate(record.serviceDate)}</p>
              </TableCell>
              <TableCell className="text-right text-sm">{formatCurrency(record.cost)}</TableCell>
              <TableCell>
                <StatusBadge
                  tone={MAINTENANCE_STATUS_TONES[record.status]}
                  label={MAINTENANCE_STATUS_LABELS[record.status]}
                />
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <MaintenanceRowActions record={record} onEdit={onEdit} />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
