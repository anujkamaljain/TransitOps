import { BrandLogo } from "@/components/brand-logo"
import { SidebarNav } from "@/components/layout/sidebar-nav"

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <BrandLogo invert />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  )
}
