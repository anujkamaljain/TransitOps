import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppearanceCard } from "@/features/settings/appearance-card"
import { ProfileCard } from "@/features/settings/profile-card"
import { RbacMatrix } from "@/features/settings/rbac-matrix"

const ORG_DEFAULTS = [
  { label: "Organization", value: "TransitOps" },
  { label: "Currency", value: "Indian Rupee (INR)" },
  { label: "Distance unit", value: "Kilometres (km)" },
  { label: "Time zone", value: "Asia/Kolkata" },
]

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, appearance, and review access control."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileCard />
        <div className="space-y-4">
          <AppearanceCard />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 text-muted-foreground" />
                Organization Defaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                {ORG_DEFAULTS.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="text-sm font-medium">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <RbacMatrix />
    </div>
  )
}
