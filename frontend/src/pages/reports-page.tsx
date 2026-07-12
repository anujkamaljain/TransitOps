import { BarChart3 } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Profitability, fuel efficiency, utilization, and ROI insights."
      />
      <ComingSoon
        icon={BarChart3}
        title="Reports & analytics arrive in Phase 20"
        note="KPI cards, monthly-revenue and top-cost charts, and CSV export will render here."
      />
    </div>
  )
}
