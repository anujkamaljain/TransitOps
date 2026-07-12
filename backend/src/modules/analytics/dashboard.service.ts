import { Prisma } from "../../generated/prisma/client.js";
import {
  DriverStatus,
  TripStatus,
  VehicleStatus,
} from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import type { DashboardQuery } from "./analytics.schema.js";

type StatusGroup<T extends string> = { status: T; _count: { _all: number } };

function tally<T extends string>(groups: StatusGroup<T>[], status: T): number {
  return groups.find((group) => group.status === status)?._count._all ?? 0;
}

export async function getDashboardKpis(query: DashboardQuery) {
  const vehicleScope: Prisma.VehicleWhereInput = {
    ...(query.type ? { type: query.type } : {}),
    ...(query.region
      ? { region: { equals: query.region, mode: "insensitive" } }
      : {}),
  };

  const [vehicleGroups, tripGroups, driverGroups, matchingVehicles] =
    await Promise.all([
      prisma.vehicle.groupBy({
        by: ["status"],
        where: vehicleScope,
        _count: { _all: true },
      }),
      prisma.trip.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.driver.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.vehicle.count({
        where: {
          ...vehicleScope,
          ...(query.status ? { status: query.status } : {}),
        },
      }),
    ]);

  const available = tally(vehicleGroups, VehicleStatus.AVAILABLE);
  const onTrip = tally(vehicleGroups, VehicleStatus.ON_TRIP);
  const inShop = tally(vehicleGroups, VehicleStatus.IN_SHOP);
  const retired = tally(vehicleGroups, VehicleStatus.RETIRED);
  const totalVehicles = available + onTrip + inShop + retired;
  const operational = totalVehicles - retired;

  return {
    kpis: {
      activeVehicles: onTrip,
      availableVehicles: available,
      vehiclesInMaintenance: inShop,
      activeTrips: tally(tripGroups, TripStatus.DISPATCHED),
      pendingTrips: tally(tripGroups, TripStatus.DRAFT),
      driversOnDuty: tally(driverGroups, DriverStatus.ON_TRIP),
      fleetUtilizationPct:
        operational > 0 ? Math.round((onTrip / operational) * 100) : 0,
    },
    vehicles: { total: totalVehicles, available, onTrip, inShop, retired },
    trips: {
      draft: tally(tripGroups, TripStatus.DRAFT),
      dispatched: tally(tripGroups, TripStatus.DISPATCHED),
      completed: tally(tripGroups, TripStatus.COMPLETED),
      cancelled: tally(tripGroups, TripStatus.CANCELLED),
    },
    drivers: {
      available: tally(driverGroups, DriverStatus.AVAILABLE),
      onTrip: tally(driverGroups, DriverStatus.ON_TRIP),
      offDuty: tally(driverGroups, DriverStatus.OFF_DUTY),
      suspended: tally(driverGroups, DriverStatus.SUSPENDED),
    },
    matchingVehicles,
  };
}
