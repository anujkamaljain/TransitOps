import {
  BarChart3,
  Fuel,
  LayoutDashboard,
  Route,
  Settings,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import type { AppModule } from "@/config/rbac"

export interface NavItem {
  to: string
  label: string
  description: string
  icon: LucideIcon
  module: AppModule
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "Fleet overview and live KPIs",
    icon: LayoutDashboard,
    module: "dashboard",
  },
  {
    to: "/vehicles",
    label: "Vehicles",
    description: "Vehicle registry and status",
    icon: Truck,
    module: "fleet",
  },
  {
    to: "/drivers",
    label: "Drivers",
    description: "Driver profiles and licenses",
    icon: Users,
    module: "drivers",
  },
  {
    to: "/trips",
    label: "Trips",
    description: "Dispatch and monitor trips",
    icon: Route,
    module: "trips",
  },
  {
    to: "/maintenance",
    label: "Maintenance",
    description: "Service logs and shop status",
    icon: Wrench,
    module: "maintenance",
  },
  {
    to: "/fuel-expenses",
    label: "Fuel & Expenses",
    description: "Fuel logs and operational cost",
    icon: Fuel,
    module: "fuelExpenses",
  },
  {
    to: "/reports",
    label: "Reports",
    description: "Analytics and CSV export",
    icon: BarChart3,
    module: "analytics",
  },
  {
    to: "/settings",
    label: "Settings",
    description: "Preferences and access control",
    icon: Settings,
    module: "settings",
  },
]
