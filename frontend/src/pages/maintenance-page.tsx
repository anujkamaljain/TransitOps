import { Wrench } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function MaintenancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Log services and track which vehicles are in the shop."
      />
      <ComingSoon
        icon={Wrench}
        title="Maintenance workflow arrives in Phase 18"
        note="A service-log form and table with automatic vehicle-status feedback will render here."
      />
    </div>
  )
}
