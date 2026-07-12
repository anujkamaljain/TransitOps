import { lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "@/features/auth/login-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ProtectedRoute } from "@/routes/protected-route"
import { PublicOnlyRoute } from "@/routes/public-only-route"
import { RequireModule } from "@/routes/require-module"

const DashboardPage = lazy(() =>
  import("@/pages/dashboard-page").then((m) => ({ default: m.DashboardPage })),
)
const VehiclesPage = lazy(() =>
  import("@/pages/vehicles-page").then((m) => ({ default: m.VehiclesPage })),
)
const DriversPage = lazy(() =>
  import("@/pages/drivers-page").then((m) => ({ default: m.DriversPage })),
)
const TripsPage = lazy(() =>
  import("@/pages/trips-page").then((m) => ({ default: m.TripsPage })),
)
const MaintenancePage = lazy(() =>
  import("@/pages/maintenance-page").then((m) => ({ default: m.MaintenancePage })),
)
const FuelExpensesPage = lazy(() =>
  import("@/pages/fuel-expenses-page").then((m) => ({ default: m.FuelExpensesPage })),
)
const ReportsPage = lazy(() =>
  import("@/pages/reports-page").then((m) => ({ default: m.ReportsPage })),
)
const SettingsPage = lazy(() =>
  import("@/pages/settings-page").then((m) => ({ default: m.SettingsPage })),
)

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/vehicles"
          element={
            <RequireModule module="fleet">
              <VehiclesPage />
            </RequireModule>
          }
        />
        <Route
          path="/drivers"
          element={
            <RequireModule module="drivers">
              <DriversPage />
            </RequireModule>
          }
        />
        <Route
          path="/trips"
          element={
            <RequireModule module="trips">
              <TripsPage />
            </RequireModule>
          }
        />
        <Route
          path="/maintenance"
          element={
            <RequireModule module="maintenance">
              <MaintenancePage />
            </RequireModule>
          }
        />
        <Route
          path="/fuel-expenses"
          element={
            <RequireModule module="fuelExpenses">
              <FuelExpensesPage />
            </RequireModule>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireModule module="analytics">
              <ReportsPage />
            </RequireModule>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireModule module="settings">
              <SettingsPage />
            </RequireModule>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
