import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ALL = "__all__"

export interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  options: FilterOption[]
  placeholder: string
  allLabel?: string
  className?: string
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  allLabel = "All",
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value ?? ALL}
      onValueChange={(next) => onChange(next === ALL ? undefined : next)}
    >
      <SelectTrigger className={className} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
