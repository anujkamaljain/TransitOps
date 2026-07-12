import { Truck } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function VehiclesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        description="Register, filter, and manage the status of every vehicle in the fleet."
      />
      <ComingSoon
        icon={Truck}
        title="Vehicle registry arrives in Phase 15"
        note="A searchable, filterable table with add/edit modals, status badges, and retire/delete flows will render here."
      />
    </div>
  )
}
