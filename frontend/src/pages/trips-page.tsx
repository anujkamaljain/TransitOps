import { Route } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function TripsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip Dispatcher"
        description="Create, validate, and dispatch trips across the fleet."
      />
      <ComingSoon
        icon={Route}
        title="Trip dispatcher arrives in Phase 17"
        note="A lifecycle stepper, capacity-validation panel, and a live trip board will render here."
      />
    </div>
  )
}
