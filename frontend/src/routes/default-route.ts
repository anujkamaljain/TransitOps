import { NAV_ITEMS } from "@/config/navigation"
import { canAccess } from "@/config/rbac"
import type { UserRole } from "@/types/auth"

export function getDefaultRoute(role: UserRole): string {
  const first = NAV_ITEMS.find((item) => canAccess(role, item.module))
  return first?.to ?? "/dashboard"
}
