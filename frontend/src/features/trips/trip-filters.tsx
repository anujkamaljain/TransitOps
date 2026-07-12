import { FilterSelect } from "@/components/data/filter-select"
import { SearchInput } from "@/components/data/search-input"
import { TRIP_STATUS_LABELS } from "@/config/labels"
import { TRIP_STATUSES, type TripStatus } from "@/types/domain"

const statusOptions = TRIP_STATUSES.map((value) => ({
  value,
  label: TRIP_STATUS_LABELS[value],
}))

interface TripFiltersProps {
  search: string
  onSearch: (value: string) => void
  status: TripStatus | undefined
  onStatus: (value: TripStatus | undefined) => void
}

export function TripFilters({ search, onSearch, status, onStatus }: TripFiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search code, source or destination"
      />
      <FilterSelect
        value={status}
        onChange={(value) => onStatus(value as TripStatus | undefined)}
        options={statusOptions}
        placeholder="Status"
        allLabel="All statuses"
        className="w-[160px]"
      />
    </div>
  )
}
