import { StatusBadge } from "@/components/status-badge"
import type { Driver } from "@/types/domain"

export function LicenseBadge({ driver }: { driver: Driver }) {
  if (driver.isLicenseExpired) {
    return <StatusBadge tone="danger" label="Expired" />
  }
  if (driver.licenseExpiringSoon) {
    return (
      <StatusBadge
        tone="warning"
        label={`${driver.daysUntilLicenseExpiry}d left`}
      />
    )
  }
  return <StatusBadge tone="success" label="Valid" />
}
