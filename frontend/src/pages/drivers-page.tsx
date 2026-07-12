import { Users } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function DriversPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Track driver profiles, license validity, and safety scores."
      />
      <ComingSoon
        icon={Users}
        title="Driver management arrives in Phase 16"
        note="A driver table with expired-license highlights, safety scores, and status controls will render here."
      />
    </div>
  )
}
