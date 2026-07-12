import { canAccess, type AccessLevel, type AppModule } from "@/config/rbac"
import { useAuth } from "@/hooks/use-auth"

export function usePermission(module: AppModule, level: AccessLevel = "view"): boolean {
  const { user } = useAuth()
  return user ? canAccess(user.role, module, level) : false
}
