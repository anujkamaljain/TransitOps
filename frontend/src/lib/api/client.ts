import axios, { AxiosError } from "axios"
import { env } from "@/lib/env"

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

const AUTH_EXEMPT = ["/auth/login", "/auth/refresh", "/auth/logout", "/auth/me"]

let refreshPromise: Promise<void> | null = null

async function runRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config
    const url = original?.url ?? ""
    const isExempt = AUTH_EXEMPT.some((path) => url.includes(path))

    if (
      error.response?.status === 401 &&
      original &&
      !isExempt &&
      !(original as { _retried?: boolean })._retried
    ) {
      ;(original as { _retried?: boolean })._retried = true
      try {
        await runRefresh()
        return api(original)
      } catch {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)
