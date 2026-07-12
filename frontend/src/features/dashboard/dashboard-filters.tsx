import { FilterSelect } from "@/components/data/filter-select"
import { Input } from "@/components/ui/input"
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
} from "@/config/labels"
import {
  VEHICLE_STATUSES,
  VEHICLE_TYPES,
  type VehicleStatus,
  type VehicleType,
} from "@/types/domain"
import type { DashboardFilters as Filters } from "@/features/dashboard/dashboard.api"

const typeOptions = VEHICLE_TYPES.map((value) => ({
  value,
  label: VEHICLE_TYPE_LABELS[value],
}))
const statusOptions = VEHICLE_STATUSES.map((value) => ({
  value,
  label: VEHICLE_STATUS_LABELS[value],
}))

interface DashboardFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        value={filters.type}
        onChange={(type) => onChange({ ...filters, type: type as VehicleType | undefined })}
        options={typeOptions}
        placeholder="Vehicle type"
        allLabel="All types"
        className="w-[150px]"
      />
      <FilterSelect
        value={filters.status}
        onChange={(status) =>
          onChange({ ...filters, status: status as VehicleStatus | undefined })
        }
        options={statusOptions}
        placeholder="Status"
        allLabel="All statuses"
        className="w-[150px]"
      />
      <Input
        value={filters.region ?? ""}
        onChange={(event) =>
          onChange({ ...filters, region: event.target.value || undefined })
        }
        placeholder="Region"
        aria-label="Filter by region"
        className="w-[150px]"
      />
    </div>
  )
}
