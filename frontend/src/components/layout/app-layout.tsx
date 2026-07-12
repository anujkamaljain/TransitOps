import { Suspense, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"

function ContentFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main
          key={location.pathname}
          className="animate-fade-in flex-1 px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-7xl">
            <Suspense fallback={<ContentFallback />}>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
