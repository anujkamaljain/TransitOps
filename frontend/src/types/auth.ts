export const USER_ROLES = [
  "FLEET_MANAGER",
  "DISPATCHER",
  "SAFETY_OFFICER",
  "FINANCIAL_ANALYST",
] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string | null
}

export const ROLE_LABELS: Record<UserRole, string> = {
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
}

export const ROLE_SCOPES: Record<UserRole, string> = {
  FLEET_MANAGER: "Fleet & Maintenance",
  DISPATCHER: "Dashboard & Trips",
  SAFETY_OFFICER: "Drivers & Compliance",
  FINANCIAL_ANALYST: "Fuel & Expenses, Analytics",
}
