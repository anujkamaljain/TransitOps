import { Navigate, Outlet, useLocation } from "react-router-dom"
import { FullPageLoader } from "@/components/full-page-loader"
import { AppLayout } from "@/components/layout/app-layout"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return <FullPageLoader />
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
