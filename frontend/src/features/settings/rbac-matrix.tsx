import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StatusTone } from "@/config/labels"
import { rolePermissions, type AccessLevel, type AppModule } from "@/config/rbac"
import { cn } from "@/lib/utils"
import { ROLE_LABELS, USER_ROLES } from "@/types/auth"
import { useAuth } from "@/hooks/use-auth"

const MODULES: { key: AppModule; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "fleet", label: "Vehicles" },
  { key: "drivers", label: "Drivers" },
  { key: "trips", label: "Trips" },
  { key: "maintenance", label: "Maintenance" },
  { key: "fuelExpenses", label: "Fuel & Expenses" },
  { key: "analytics", label: "Reports" },
  { key: "settings", label: "Settings" },
]

const LEVEL: Record<AccessLevel, { tone: StatusTone; label: string }> = {
  manage: { tone: "success", label: "Manage" },
  view: { tone: "info", label: "View" },
  none: { tone: "neutral", label: "No access" },
}

export function RbacMatrix() {
  const { user } = useAuth()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Role-Based Access</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              {USER_ROLES.map((role) => (
                <TableHead
                  key={role}
                  className={cn(
                    "text-center",
                    user?.role === role && "text-primary",
                  )}
                >
                  {ROLE_LABELS[role]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODULES.map((module) => (
              <TableRow key={module.key}>
                <TableCell className="font-medium">{module.label}</TableCell>
                {USER_ROLES.map((role) => {
                  const level = LEVEL[rolePermissions[role][module.key]]
                  return (
                    <TableCell
                      key={role}
                      className={cn(
                        "text-center",
                        user?.role === role && "bg-primary/5",
                      )}
                    >
                      <StatusBadge tone={level.tone} label={level.label} />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
