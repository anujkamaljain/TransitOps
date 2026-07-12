import type { UserRole } from "@/types/auth"

export const DEMO_PASSWORD = "Transit@2026"

export const DEMO_ACCOUNTS: Record<UserRole, string> = {
  FLEET_MANAGER: "manager@transitops.in",
  DISPATCHER: "dispatcher@transitops.in",
  SAFETY_OFFICER: "safety@transitops.in",
  FINANCIAL_ANALYST: "analyst@transitops.in",
}
