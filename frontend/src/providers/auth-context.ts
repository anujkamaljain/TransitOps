import { createContext } from "react"
import type { LoginPayload } from "@/lib/api/auth"
import type { User } from "@/types/auth"

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  signIn: (payload: LoginPayload) => Promise<User>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
