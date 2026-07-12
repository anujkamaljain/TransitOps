import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import type { AppModule } from "@/config/rbac"
import { canAccess } from "@/config/rbac"
import { useAuth } from "@/hooks/use-auth"
import { getDefaultRoute } from "@/routes/default-route"

interface RequireModuleProps {
  module: AppModule
  children: ReactNode
}

export function RequireModule({ module, children }: RequireModuleProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!canAccess(user.role, module)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }

  return <>{children}</>
}
