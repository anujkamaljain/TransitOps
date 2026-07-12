import { UserRole } from "../generated/prisma/enums.js";

export type AppModule =
  | "fleet"
  | "drivers"
  | "trips"
  | "fuelExpenses"
  | "analytics"
  | "settings";

export type AccessLevel = "none" | "view" | "manage";

const levelRank: Record<AccessLevel, number> = {
  none: 0,
  view: 1,
  manage: 2,
};

export const rolePermissions: Record<UserRole, Record<AppModule, AccessLevel>> = {
  [UserRole.FLEET_MANAGER]: {
    fleet: "manage",
    drivers: "manage",
    trips: "view",
    fuelExpenses: "view",
    analytics: "view",
    settings: "manage",
  },
  [UserRole.DISPATCHER]: {
    fleet: "view",
    drivers: "view",
    trips: "manage",
    fuelExpenses: "none",
    analytics: "none",
    settings: "none",
  },
  [UserRole.SAFETY_OFFICER]: {
    fleet: "none",
    drivers: "manage",
    trips: "view",
    fuelExpenses: "none",
    analytics: "none",
    settings: "none",
  },
  [UserRole.FINANCIAL_ANALYST]: {
    fleet: "view",
    drivers: "none",
    trips: "none",
    fuelExpenses: "manage",
    analytics: "manage",
    settings: "none",
  },
};

export function canAccess(
  role: UserRole,
  module: AppModule,
  required: AccessLevel,
): boolean {
  return levelRank[rolePermissions[role][module]] >= levelRank[required];
}
