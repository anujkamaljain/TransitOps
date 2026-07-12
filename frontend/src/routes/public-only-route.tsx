import { Navigate, Outlet } from "react-router-dom"
import { FullPageLoader } from "@/components/full-page-loader"
import { useAuth } from "@/hooks/use-auth"
import { getDefaultRoute } from "@/routes/default-route"

export function PublicOnlyRoute() {
  const { status, user } = useAuth()

  if (status === "loading") {
    return <FullPageLoader />
  }

  if (status === "authenticated" && user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }

  return <Outlet />
}
