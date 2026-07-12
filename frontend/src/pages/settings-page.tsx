import { Settings } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Organization preferences and role-based access control."
      />
      <ComingSoon
        icon={Settings}
        title="Settings & RBAC matrix arrive in Phase 21"
        note="General settings, the RBAC access matrix, and profile/password controls will render here."
      />
    </div>
  )
}
