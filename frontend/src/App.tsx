import { ErrorBoundary } from "@/components/error-boundary"
import { AppProviders } from "@/providers/app-providers"
import { AppRouter } from "@/routes/app-router"

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  )
}
