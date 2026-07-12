import { randomBytes } from "node:crypto";
import type { Driver, Vehicle } from "../../generated/prisma/client.js";
import { Prisma } from "../../generated/prisma/client.js";
import { DriverStatus, VehicleStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

export const tripInclude = {
  vehicle: {
    select: { id: true, registrationNumber: true, name: true, status: true },
  },
  driver: { select: { id: true, fullName: true, status: true } },
} satisfies Prisma.TripInclude;

export async function getVehicleOrThrow(id: string): Promise<Vehicle> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw ApiError.notFound("Selected vehicle no longer exists");
  }
  return vehicle;
}

export async function getDriverOrThrow(id: string): Promise<Driver> {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    throw ApiError.notFound("Selected driver no longer exists");
  }
  return driver;
}

export function assertVehicleAssignable(vehicle: Vehicle): void {
  if (vehicle.status === VehicleStatus.RETIRED) {
    throw ApiError.conflict("Retired vehicles cannot be assigned to a trip", {
      field: "vehicleId",
    });
  }
  if (vehicle.status === VehicleStatus.IN_SHOP) {
    throw ApiError.conflict("Vehicles in maintenance cannot be dispatched", {
      field: "vehicleId",
    });
  }
  if (vehicle.status === VehicleStatus.ON_TRIP) {
    throw ApiError.conflict("This vehicle is already on another trip", {
      field: "vehicleId",
    });
  }
}

export function assertDriverAssignable(driver: Driver): void {
  if (driver.licenseExpiry.getTime() < Date.now()) {
    throw ApiError.conflict("This driver's license has expired", {
      field: "driverId",
    });
  }
  if (driver.status === DriverStatus.SUSPENDED) {
    throw ApiError.conflict("Suspended drivers cannot be assigned to a trip", {
      field: "driverId",
    });
  }
  if (driver.status === DriverStatus.ON_TRIP) {
    throw ApiError.conflict("This driver is already on another trip", {
      field: "driverId",
    });
  }
  if (driver.status === DriverStatus.OFF_DUTY) {
    throw ApiError.conflict("Off-duty drivers cannot be assigned to a trip", {
      field: "driverId",
    });
  }
}

export function assertCargoWithinCapacity(
  cargoWeightKg: number,
  capacity: Prisma.Decimal,
): void {
  if (cargoWeightKg > capacity.toNumber()) {
    throw ApiError.unprocessable(
      `Cargo weight (${cargoWeightKg} kg) exceeds the vehicle capacity (${capacity.toString()} kg)`,
      { field: "cargoWeightKg" },
    );
  }
}

export async function generateTripCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `TRP-${randomBytes(4).toString("hex").toUpperCase()}`;
    const existing = await prisma.trip.findUnique({ where: { tripCode: code } });
    if (!existing) {
      return code;
    }
  }
  throw ApiError.internal("Could not generate a unique trip code");
}
