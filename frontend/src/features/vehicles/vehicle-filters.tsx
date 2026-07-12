import { FilterSelect } from "@/components/data/filter-select"
import { SearchInput } from "@/components/data/search-input"
import { VEHICLE_STATUS_LABELS, VEHICLE_TYPE_LABELS } from "@/config/labels"
import {
  VEHICLE_STATUSES,
  VEHICLE_TYPES,
  type VehicleStatus,
  type VehicleType,
} from "@/types/domain"

const typeOptions = VEHICLE_TYPES.map((value) => ({
  value,
  label: VEHICLE_TYPE_LABELS[value],
}))
const statusOptions = VEHICLE_STATUSES.map((value) => ({
  value,
  label: VEHICLE_STATUS_LABELS[value],
}))

interface VehicleFiltersProps {
  search: string
  onSearch: (value: string) => void
  type: VehicleType | undefined
  onType: (value: VehicleType | undefined) => void
  status: VehicleStatus | undefined
  onStatus: (value: VehicleStatus | undefined) => void
}

export function VehicleFilters({
  search,
  onSearch,
  type,
  onType,
  status,
  onStatus,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search registration or name"
      />
      <div className="flex gap-2">
        <FilterSelect
          value={type}
          onChange={(value) => onType(value as VehicleType | undefined)}
          options={typeOptions}
          placeholder="Type"
          allLabel="All types"
          className="w-[140px]"
        />
        <FilterSelect
          value={status}
          onChange={(value) => onStatus(value as VehicleStatus | undefined)}
          options={statusOptions}
          placeholder="Status"
          allLabel="All statuses"
          className="w-[150px]"
        />
      </div>
    </div>
  )
}
