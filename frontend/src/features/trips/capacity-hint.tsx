import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/format"
import type { Vehicle } from "@/types/domain"

interface CapacityHintProps {
  vehicle: Vehicle | undefined
  cargoWeightKg: number
}

export function CapacityHint({ vehicle, cargoWeightKg }: CapacityHintProps) {
  if (!vehicle || !Number.isFinite(cargoWeightKg) || cargoWeightKg <= 0) {
    return null
  }

  const capacity = Number(vehicle.maxLoadCapacityKg)
  const fits = cargoWeightKg <= capacity
  const utilization = capacity > 0 ? Math.min(100, (cargoWeightKg / capacity) * 100) : 0

  return (
    <div
      className={cn(
        "space-y-2 rounded-lg border p-3 text-sm",
        fits
          ? "border-success/30 bg-success/5 text-success"
          : "border-danger/30 bg-danger/5 text-danger",
      )}
    >
      <div className="flex items-center gap-2 font-medium">
        {fits ? <CheckCircle2 className="size-4" /> : <AlertTriangle className="size-4" />}
        {fits
          ? "Cargo fits within vehicle capacity"
          : "Cargo exceeds vehicle capacity"}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Cargo {formatNumber(cargoWeightKg)} kg</span>
        <span>Capacity {formatNumber(capacity)} kg</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full", fits ? "bg-success" : "bg-danger")}
          style={{ width: `${utilization}%` }}
        />
      </div>
    </div>
  )
}
