import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "@/features/auth/login-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { VehiclesPage } from "@/pages/vehicles-page"
import { DriversPage } from "@/pages/drivers-page"
import { TripsPage } from "@/pages/trips-page"
import { MaintenancePage } from "@/pages/maintenance-page"
import { FuelExpensesPage } from "@/pages/fuel-expenses-page"
import { ReportsPage } from "@/pages/reports-page"
import { SettingsPage } from "@/pages/settings-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ProtectedRoute } from "@/routes/protected-route"
import { PublicOnlyRoute } from "@/routes/public-only-route"
import { RequireModule } from "@/routes/require-module"

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
