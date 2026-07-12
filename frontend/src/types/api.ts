export interface ResponseMeta {
  page?: number
  pageSize?: number
  total?: number
  totalPages?: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
  meta?: ResponseMeta
}

export interface FieldError {
  field: string
  message: string
}

export interface ApiErrorBody {
  success: false
  error: {
    message: string
    details?: FieldError[]
  }
}
