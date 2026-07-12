import { prisma } from "../lib/prisma.js";
import { ApiError } from "./api-error.js";

export async function assertVehicleExists(vehicleId: string): Promise<void> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    throw ApiError.unprocessable("Selected vehicle does not exist", {
      field: "vehicleId",
    });
  }
}

export async function assertTripExists(tripId: string): Promise<void> {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) {
    throw ApiError.unprocessable("Selected trip does not exist", {
      field: "tripId",
    });
  }
}

export async function assertMaintenanceExists(id: string): Promise<void> {
  const log = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!log) {
    throw ApiError.unprocessable("Selected maintenance record does not exist", {
      field: "maintenanceLogId",
    });
  }
}
