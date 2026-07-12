import type { UserRole } from "@/types/auth"

export type AppModule =
  | "dashboard"
  | "fleet"
  | "drivers"
  | "trips"
  | "maintenance"
  | "fuelExpenses"
  | "analytics"
  | "settings"

export type AccessLevel = "none" | "view" | "manage"

const levelRank: Record<AccessLevel, number> = {
  none: 0,
  view: 1,
  manage: 2,
}

export const rolePermissions: Record<UserRole, Record<AppModule, AccessLevel>> = {
  FLEET_MANAGER: {
    dashboard: "view",
    fleet: "manage",
    drivers: "manage",
    trips: "view",
    maintenance: "manage",
    fuelExpenses: "view",
    analytics: "view",
    settings: "manage",
  },
  DISPATCHER: {
    dashboard: "view",
    fleet: "view",
    drivers: "view",
    trips: "manage",
    maintenance: "none",
    fuelExpenses: "none",
    analytics: "none",
    settings: "none",
  },
  SAFETY_OFFICER: {
    dashboard: "view",
    fleet: "none",
    drivers: "manage",
    trips: "view",
    maintenance: "none",
    fuelExpenses: "none",
    analytics: "none",
    settings: "none",
  },
  FINANCIAL_ANALYST: {
    dashboard: "view",
    fleet: "view",
    drivers: "none",
    trips: "none",
    maintenance: "none",
    fuelExpenses: "manage",
    analytics: "manage",
    settings: "none",
  },
}

export function canAccess(
  role: UserRole,
  module: AppModule,
  required: AccessLevel = "view",
): boolean {
  return levelRank[rolePermissions[role][module]] >= levelRank[required]
}
