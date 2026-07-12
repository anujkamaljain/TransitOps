import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { bootstrapSession, login, logout, type LoginPayload } from "@/lib/api/auth"
import { queryClient } from "@/lib/query-client"
import type { User } from "@/types/auth"
import { AuthContext, type AuthStatus } from "@/providers/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    let active = true
    bootstrapSession().then((result) => {
      if (!active) return
      setUser(result)
      setStatus(result ? "authenticated" : "unauthenticated")
    })
    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (payload: LoginPayload) => {
    const account = await login(payload)
    setUser(account)
    setStatus("authenticated")
    return account
  }, [])

  const signOut = useCallback(async () => {
    try {
      await logout()
    } finally {
      setUser(null)
      setStatus("unauthenticated")
      queryClient.clear()
    }
  }, [])

  const value = useMemo(
    () => ({ user, status, signIn, signOut }),
    [user, status, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
