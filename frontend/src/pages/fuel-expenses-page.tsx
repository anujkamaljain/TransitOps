import { Fuel } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function FuelExpensesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel & Expenses"
        description="Record fuel logs and expenses, and track operational cost."
      />
      <ComingSoon
        icon={Fuel}
        title="Fuel & expense tracking arrives in Phase 19"
        note="Fuel-log and expense tables with logging modals and automatic operational-cost totals will render here."
      />
    </div>
  )
}
