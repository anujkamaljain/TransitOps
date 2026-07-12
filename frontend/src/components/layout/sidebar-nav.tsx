import { NavLink } from "react-router-dom"
import { NAV_ITEMS } from "@/config/navigation"
import { canAccess } from "@/config/rbac"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  if (!user) return null

  const items = NAV_ITEMS.filter((item) => canAccess(user.role, item.module))

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn(
                  "size-[1.15rem] shrink-0 transition-transform group-hover:scale-105",
                  !isActive && "text-sidebar-foreground/70",
                )}
              />
              <span className="truncate">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
