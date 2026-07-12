import { toast } from "sonner"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { ApiError, toApiError } from "@/lib/api/errors"

export function applyFormErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): void {
  const apiError = toApiError(error)
  if (apiError.fieldErrors.length > 0) {
    apiError.fieldErrors.forEach((fe) =>
      setError(fe.field as Path<T>, { message: fe.message }),
    )
    return
  }
  toast.error(apiError.message)
}

export function notifyError(error: unknown, fallback?: string): void {
  const apiError = error instanceof ApiError ? error : toApiError(error)
  toast.error(fallback ?? apiError.message)
}
