import { TripStatus, VehicleStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import {
  buildFleetSummary,
  monthlyRevenue,
  round,
  toNum,
  type VehicleReportRow,
} from "./reports.helpers.js";

export async function getFleetReport() {
  const [vehicles, fuelByVehicle, maintByVehicle, tripByVehicle, completedTrips, vehicleGroups] =
    await Promise.all([
      prisma.vehicle.findMany({
        select: { id: true, registrationNumber: true, name: true, acquisitionCost: true },
      }),
      prisma.fuelLog.groupBy({ by: ["vehicleId"], _sum: { cost: true, liters: true } }),
      prisma.maintenanceLog.groupBy({ by: ["vehicleId"], _sum: { cost: true } }),
      prisma.trip.groupBy({
        by: ["vehicleId"],
        where: { status: TripStatus.COMPLETED },
        _sum: { revenue: true, actualDistanceKm: true },
      }),
      prisma.trip.findMany({
        where: { status: TripStatus.COMPLETED },
        select: { completedAt: true, revenue: true },
      }),
      prisma.vehicle.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

  const fuelMap = new Map(fuelByVehicle.map((f) => [f.vehicleId, f._sum]));
  const maintMap = new Map(maintByVehicle.map((m) => [m.vehicleId, m._sum]));
  const tripMap = new Map(
    tripByVehicle
      .filter((t) => t.vehicleId)
      .map((t) => [t.vehicleId as string, t._sum]),
  );

  const rows: VehicleReportRow[] = vehicles.map((vehicle) => {
    const fuelCost = toNum(fuelMap.get(vehicle.id)?.cost);
    const fuelLiters = toNum(fuelMap.get(vehicle.id)?.liters);
    const maintenanceCost = toNum(maintMap.get(vehicle.id)?.cost);
    const revenue = toNum(tripMap.get(vehicle.id)?.revenue);
    const distanceKm = toNum(tripMap.get(vehicle.id)?.actualDistanceKm);
    const operationalCost = fuelCost + maintenanceCost;
    const acquisitionCost = toNum(vehicle.acquisitionCost);
    return {
      vehicleId: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      name: vehicle.name,
      acquisitionCost: round(acquisitionCost),
      revenue: round(revenue),
      fuelCost: round(fuelCost),
      fuelLiters: round(fuelLiters),
      maintenanceCost: round(maintenanceCost),
      operationalCost: round(operationalCost),
      distanceKm: round(distanceKm),
      fuelEfficiencyKmPerL: fuelLiters > 0 ? round(distanceKm / fuelLiters, 2) : null,
      roi: acquisitionCost > 0 ? round((revenue - operationalCost) / acquisitionCost, 3) : null,
    };
  });

  const counts = (status: VehicleStatus) =>
    vehicleGroups.find((group) => group.status === status)?._count._all ?? 0;
  const onTrip = counts(VehicleStatus.ON_TRIP);
  const operational =
    counts(VehicleStatus.AVAILABLE) + onTrip + counts(VehicleStatus.IN_SHOP);
  const utilization = operational > 0 ? Math.round((onTrip / operational) * 100) : 0;

  const topCostliest = [...rows]
    .sort((a, b) => b.operationalCost - a.operationalCost)
    .slice(0, 5);

  return {
    summary: buildFleetSummary(rows, utilization),
    vehicles: rows,
    monthlyRevenue: monthlyRevenue(completedTrips),
    topCostliest,
  };
}

export async function getVehicleOperationalCost(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { id: true, registrationNumber: true, name: true },
  });
  if (!vehicle) {
    throw ApiError.notFound("Vehicle not found");
  }

  const [fuel, maintenance, expense, trips] = await Promise.all([
    prisma.fuelLog.aggregate({ where: { vehicleId }, _sum: { cost: true, liters: true } }),
    prisma.maintenanceLog.aggregate({ where: { vehicleId }, _sum: { cost: true } }),
    prisma.expense.aggregate({ where: { vehicleId }, _sum: { amount: true } }),
    prisma.trip.aggregate({
      where: { vehicleId, status: TripStatus.COMPLETED },
      _sum: { revenue: true },
    }),
  ]);

  const fuelCost = toNum(fuel._sum.cost);
  const maintenanceCost = toNum(maintenance._sum.cost);
  return {
    vehicle,
    fuelCost: round(fuelCost),
    fuelLiters: round(toNum(fuel._sum.liters)),
    maintenanceCost: round(maintenanceCost),
    otherExpenses: round(toNum(expense._sum.amount)),
    totalOperationalCost: round(fuelCost + maintenanceCost),
    revenue: round(toNum(trips._sum.revenue)),
  };
}
