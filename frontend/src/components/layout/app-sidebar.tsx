import { BrandLogo } from "@/components/brand-logo"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { ROLE_LABELS, ROLE_SCOPES } from "@/types/auth"
import { useAuth } from "@/hooks/use-auth"

export function AppSidebar() {
  const { user } = useAuth()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <BrandLogo invert />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <SidebarNav />
      </div>

      {user && (
        <div className="border-t border-sidebar-border p-4">
          <p className="text-sm font-medium text-white">{ROLE_LABELS[user.role]}</p>
          <p className="text-xs text-sidebar-foreground/70">
            {ROLE_SCOPES[user.role]}
          </p>
        </div>
      )}
    </aside>
  )
}
