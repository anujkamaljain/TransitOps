import { AppProviders } from "@/providers/app-providers"
import { AppRouter } from "@/routes/app-router"

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
