import { CheckCircle2, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ROLE_LABELS, ROLE_SCOPES, USER_ROLES } from "@/types/auth"

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-slate-900 p-10 lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-blue-500/10 blur-3xl"
      />

      <BrandLogo invert tagline className="relative animate-fade-in" />

      <div className="relative space-y-5">
        <p className="text-sm font-medium tracking-wide text-slate-400 uppercase">
          One login, four roles
        </p>
        <ul className="space-y-4">
          {USER_ROLES.map((role, index) => (
            <li
              key={role}
              className="animate-rise flex items-start gap-3"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-white">{ROLE_LABELS[role]}</p>
                <p className="text-sm text-slate-400">{ROLE_SCOPES[role]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="size-4" />
        <span>TransitOps © 2026 · RBAC enabled</span>
      </div>
    </div>
  )
}
