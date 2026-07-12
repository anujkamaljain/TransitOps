import { api } from "@/lib/api/client"
import { toApiError } from "@/lib/api/errors"
import type { ApiSuccess } from "@/types/api"
import type { User } from "@/types/auth"

interface SessionData {
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload): Promise<User> {
  try {
    const { data } = await api.post<ApiSuccess<SessionData>>("/auth/login", payload)
    return data.data.user
  } catch (error) {
    throw toApiError(error)
  }
}

export async function fetchCurrentUser(): Promise<User> {
  try {
    const { data } = await api.get<ApiSuccess<SessionData>>("/auth/me")
    return data.data.user
  } catch (error) {
    throw toApiError(error)
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout")
  } catch (error) {
    throw toApiError(error)
  }
}

export async function bootstrapSession(): Promise<User | null> {
  try {
    return await fetchCurrentUser()
  } catch {
    try {
      await api.post("/auth/refresh")
      return await fetchCurrentUser()
    } catch {
      return null
    }
  }
}
