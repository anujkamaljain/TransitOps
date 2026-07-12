const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("en-IN")

export function formatCurrency(value: string | number | null | undefined): string {
  const amount = typeof value === "string" ? Number(value) : (value ?? 0)
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0)
}

export function formatNumber(value: string | number | null | undefined): string {
  const amount = typeof value === "string" ? Number(value) : (value ?? 0)
  return numberFormatter.format(Number.isFinite(amount) ? amount : 0)
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
}

export function relativeTime(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value)
  const diffMs = date.getTime() - Date.now()
  const diffMin = Math.round(diffMs / 60000)
  const abs = Math.abs(diffMin)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  if (abs < 60) return rtf.format(diffMin, "minute")
  if (abs < 1440) return rtf.format(Math.round(diffMin / 60), "hour")
  return rtf.format(Math.round(diffMin / 1440), "day")
}
