import type { Prisma } from "../../generated/prisma/client.js";

export function toNum(value: Prisma.Decimal | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  return typeof value === "number" ? value : value.toNumber();
}

export function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export interface VehicleReportRow {
  vehicleId: string;
  registrationNumber: string;
  name: string;
  acquisitionCost: number;
  revenue: number;
  fuelCost: number;
  fuelLiters: number;
  maintenanceCost: number;
  operationalCost: number;
  distanceKm: number;
  fuelEfficiencyKmPerL: number | null;
  roi: number | null;
}

export function monthlyRevenue(
  trips: { completedAt: Date | null; revenue: Prisma.Decimal | null }[],
): { month: string; revenue: number }[] {
  const totals = new Map<string, number>();
  for (const trip of trips) {
    if (!trip.completedAt) {
      continue;
    }
    const key = trip.completedAt.toISOString().slice(0, 7);
    totals.set(key, (totals.get(key) ?? 0) + toNum(trip.revenue));
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue: round(revenue) }));
}

export function buildFleetSummary(
  rows: VehicleReportRow[],
  fleetUtilizationPct: number,
) {
  const t = rows.reduce(
    (acc, row) => {
      acc.revenue += row.revenue;
      acc.fuelCost += row.fuelCost;
      acc.maintenanceCost += row.maintenanceCost;
      acc.distanceKm += row.distanceKm;
      acc.fuelLiters += row.fuelLiters;
      acc.acquisitionCost += row.acquisitionCost;
      return acc;
    },
    { revenue: 0, fuelCost: 0, maintenanceCost: 0, distanceKm: 0, fuelLiters: 0, acquisitionCost: 0 },
  );
  const operationalCost = t.fuelCost + t.maintenanceCost;
  return {
    totalRevenue: round(t.revenue),
    totalFuelCost: round(t.fuelCost),
    totalMaintenanceCost: round(t.maintenanceCost),
    totalOperationalCost: round(operationalCost),
    totalDistanceKm: round(t.distanceKm),
    totalFuelLiters: round(t.fuelLiters),
    fleetFuelEfficiencyKmPerL:
      t.fuelLiters > 0 ? round(t.distanceKm / t.fuelLiters, 2) : null,
    fleetRoi:
      t.acquisitionCost > 0
        ? round((t.revenue - operationalCost) / t.acquisitionCost, 3)
        : null,
    fleetUtilizationPct,
  };
}
