import { StatusBadge } from "@/components/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLE_LABELS, ROLE_SCOPES } from "@/types/auth"
import { formatDateTime } from "@/lib/format"
import { useAuth } from "@/hooks/use-auth"

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function ProfileCard() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-lg font-semibold">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">Role</dt>
            <dd className="text-sm font-medium">{ROLE_LABELS[user.role]}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">Scope</dt>
            <dd className="text-sm font-medium">{ROLE_SCOPES[user.role]}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">Account status</dt>
            <dd>
              <StatusBadge
                tone={user.isActive ? "success" : "danger"}
                label={user.isActive ? "Active" : "Disabled"}
              />
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">Last sign-in</dt>
            <dd className="text-sm font-medium">{formatDateTime(user.lastLoginAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
