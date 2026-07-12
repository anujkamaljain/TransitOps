import { ThemeToggle } from "@/components/theme-toggle"
import { AuthBrandPanel } from "@/features/auth/auth-brand-panel"
import { LoginForm } from "@/features/auth/login-form"

export function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm animate-rise space-y-8">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
