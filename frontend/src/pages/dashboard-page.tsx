import { LayoutDashboard } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { useAuth } from "@/hooks/use-auth"

export function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.fullName.split(" ")[0] ?? "there"}`}
        description="Your live fleet overview and operational KPIs."
      />
      <ComingSoon
        icon={LayoutDashboard}
        title="Dashboard KPIs arrive in Phase 14"
        note="Seven live KPI cards, recent trips, vehicle-status bars, and realtime socket updates will render here."
      />
    </div>
  )
}
