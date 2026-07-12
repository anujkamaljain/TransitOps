import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { AlertCircle, Loader2, LogIn } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/password-input"
import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/lib/api/errors"
import { getDefaultRoute } from "@/routes/default-route"
import { loginSchema, type LoginFormValues } from "@/features/auth/login-schema"
import { DEMO_PASSWORD } from "@/features/auth/demo-accounts"
import { DemoAccountPicker } from "@/features/auth/demo-account-picker"
import { ForgotPasswordDialog } from "@/features/auth/forgot-password-dialog"

export function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const account = await signIn({ email: values.email, password: values.password })
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? getDefaultRoute(account.role), { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors.length > 0) {
        error.fieldErrors.forEach((fe) =>
          setError(fe.field as keyof LoginFormValues, { message: fe.message }),
        )
        return
      }
      setFormError(error instanceof ApiError ? error.message : "Unable to sign in.")
    }
  })

  const fillDemo = (email: string) => {
    clearErrors()
    setFormError(null)
    setValue("email", email, { shouldValidate: true })
    setValue("password", DEMO_PASSWORD, { shouldValidate: true })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="size-4" />
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@transitops.in"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Remember me
            </label>
          )}
        />
        <ForgotPasswordDialog />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}
        {isSubmitting ? "Signing in…" : "Sign In"}
      </Button>

      <div className="relative py-1 text-center">
        <span className="relative bg-card px-3 text-xs text-muted-foreground">
          Access is scoped by role after login
        </span>
        <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
      </div>

      <DemoAccountPicker onSelect={fillDemo} disabled={isSubmitting} />
    </form>
  )
}
