import { FilterSelect } from "@/components/data/filter-select"
import { SearchInput } from "@/components/data/search-input"
import { DRIVER_STATUS_LABELS } from "@/config/labels"
import {
  DRIVER_STATUSES,
  LICENSE_CATEGORIES,
  type DriverStatus,
  type LicenseCategory,
} from "@/types/domain"

type Expiry = "expired" | "expiring" | "valid"

const statusOptions = DRIVER_STATUSES.map((value) => ({
  value,
  label: DRIVER_STATUS_LABELS[value],
}))
const categoryOptions = LICENSE_CATEGORIES.map((value) => ({
  value,
  label: value,
}))
const expiryOptions = [
  { value: "expired", label: "Expired" },
  { value: "expiring", label: "Expiring soon" },
  { value: "valid", label: "Valid" },
]

interface DriverFiltersProps {
  search: string
  onSearch: (value: string) => void
  status: DriverStatus | undefined
  onStatus: (value: DriverStatus | undefined) => void
  category: LicenseCategory | undefined
  onCategory: (value: LicenseCategory | undefined) => void
  expiry: Expiry | undefined
  onExpiry: (value: Expiry | undefined) => void
}

export function DriverFilters({
  search,
  onSearch,
  status,
  onStatus,
  category,
  onCategory,
  expiry,
  onExpiry,
}: DriverFiltersProps) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search name or license"
      />
      <div className="flex flex-wrap gap-2">
        <FilterSelect
          value={status}
          onChange={(value) => onStatus(value as DriverStatus | undefined)}
          options={statusOptions}
          placeholder="Status"
          allLabel="All statuses"
          className="w-[140px]"
        />
        <FilterSelect
          value={category}
          onChange={(value) => onCategory(value as LicenseCategory | undefined)}
          options={categoryOptions}
          placeholder="License"
          allLabel="All licenses"
          className="w-[130px]"
        />
        <FilterSelect
          value={expiry}
          onChange={(value) => onExpiry(value as Expiry | undefined)}
          options={expiryOptions}
          placeholder="Expiry"
          allLabel="Any expiry"
          className="w-[140px]"
        />
      </div>
    </div>
  )
}
