import { AxiosError } from "axios"
import type { ApiErrorBody, FieldError } from "@/types/api"

export class ApiError extends Error {
  status: number
  fieldErrors: FieldError[]

  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const FALLBACK = "Something went wrong. Please try again."

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.error) {
      return new ApiError(body.error.message, status, body.error.details ?? [])
    }
    if (error.code === "ERR_NETWORK") {
      return new ApiError("Cannot reach the server. Check your connection.", 0)
    }
    return new ApiError(error.message || FALLBACK, status)
  }
  return new ApiError(FALLBACK, 0)
}
