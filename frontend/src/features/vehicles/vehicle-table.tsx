import { Truck } from "lucide-react"
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
import { VEHICLE_STATUS_LABELS, VEHICLE_STATUS_TONES, VEHICLE_TYPE_LABELS } from "@/config/labels"
import { formatCurrency, formatNumber } from "@/lib/format"
import type { Vehicle } from "@/types/domain"
import { VehicleRowActions } from "@/features/vehicles/vehicle-row-actions"

interface VehicleTableProps {
  vehicles: Vehicle[]
  isLoading: boolean
  canManage: boolean
  onEdit: (vehicle: Vehicle) => void
}

export function VehicleTable({ vehicles, isLoading, canManage, onEdit }: VehicleTableProps) {
  const columns = canManage ? 7 : 6

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Capacity (kg)</TableHead>
          <TableHead className="text-right">Odometer</TableHead>
          <TableHead className="text-right">Acquisition</TableHead>
          <TableHead>Status</TableHead>
          {canManage && <TableHead className="w-12 text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={columns} />
        ) : vehicles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns} className="p-0">
              <EmptyState
                icon={Truck}
                title="No vehicles found"
                description="Try adjusting your filters or add a new vehicle."
              />
            </TableCell>
          </TableRow>
        ) : (
          vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <p className="font-medium">{vehicle.registrationNumber}</p>
                <p className="text-xs text-muted-foreground">{vehicle.name}</p>
              </TableCell>
              <TableCell className="text-sm">{VEHICLE_TYPE_LABELS[vehicle.type]}</TableCell>
              <TableCell className="text-right text-sm">
                {formatNumber(vehicle.maxLoadCapacityKg)}
              </TableCell>
              <TableCell className="text-right text-sm">
                {formatNumber(vehicle.odometer)}
              </TableCell>
              <TableCell className="text-right text-sm">
                {formatCurrency(vehicle.acquisitionCost)}
              </TableCell>
              <TableCell>
                <StatusBadge
                  tone={VEHICLE_STATUS_TONES[vehicle.status]}
                  label={VEHICLE_STATUS_LABELS[vehicle.status]}
                />
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <VehicleRowActions vehicle={vehicle} onEdit={onEdit} />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
