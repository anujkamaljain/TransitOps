import { FilterSelect } from "@/components/data/filter-select"
import { SearchInput } from "@/components/data/search-input"
import { MAINTENANCE_STATUS_LABELS } from "@/config/labels"
import { MAINTENANCE_STATUSES, type MaintenanceStatus } from "@/types/domain"

const statusOptions = MAINTENANCE_STATUSES.map((value) => ({
  value,
  label: MAINTENANCE_STATUS_LABELS[value],
}))

interface MaintenanceFiltersProps {
  search: string
  onSearch: (value: string) => void
  status: MaintenanceStatus | undefined
  onStatus: (value: MaintenanceStatus | undefined) => void
}

export function MaintenanceFilters({
  search,
  onSearch,
  status,
  onStatus,
}: MaintenanceFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <SearchInput value={search} onChange={onSearch} placeholder="Search service type" />
      <FilterSelect
        value={status}
        onChange={(value) => onStatus(value as MaintenanceStatus | undefined)}
        options={statusOptions}
        placeholder="Status"
        allLabel="All statuses"
        className="w-[160px]"
      />
    </div>
  )
}
