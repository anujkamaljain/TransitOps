import { Users } from "lucide-react"
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
import { DRIVER_STATUS_LABELS, DRIVER_STATUS_TONES } from "@/config/labels"
import { formatDate } from "@/lib/format"
import type { Driver } from "@/types/domain"
import { DriverRowActions } from "@/features/drivers/driver-row-actions"
import { LicenseBadge } from "@/features/drivers/license-badge"

interface DriverTableProps {
  drivers: Driver[]
  isLoading: boolean
  canManage: boolean
  onEdit: (driver: Driver) => void
}

export function DriverTable({ drivers, isLoading, canManage, onEdit }: DriverTableProps) {
  const columns = canManage ? 6 : 5

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Driver</TableHead>
          <TableHead>License</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="text-right">Safety</TableHead>
          <TableHead>Status</TableHead>
          {canManage && <TableHead className="w-12 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={columns} />
        ) : drivers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns} className="p-0">
              <EmptyState
                icon={Users}
                title="No drivers found"
                description="Try adjusting your filters or add a new driver."
              />
            </TableCell>
          </TableRow>
        ) : (
          drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>
                <p className="font-medium">{driver.fullName}</p>
                <p className="text-xs text-muted-foreground">{driver.licenseNumber}</p>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    {driver.licenseCategory} · {formatDate(driver.licenseExpiry)}
                  </span>
                  <LicenseBadge driver={driver} />
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <p>{driver.contactNumber}</p>
                {driver.email && (
                  <p className="text-xs text-muted-foreground">{driver.email}</p>
                )}
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {driver.safetyScore}
              </TableCell>
              <TableCell>
                <StatusBadge
                  tone={DRIVER_STATUS_TONES[driver.status]}
                  label={DRIVER_STATUS_LABELS[driver.status]}
                />
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <DriverRowActions driver={driver} onEdit={onEdit} />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
