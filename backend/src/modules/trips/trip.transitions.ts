import { Prisma } from "../../generated/prisma/client.js";
import {
  DriverStatus,
  TripStatus,
  VehicleStatus,
} from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { AppEvent, publish } from "../../realtime/event-bus.js";
import { ApiError } from "../../utils/api-error.js";
import {
  assertCargoWithinCapacity,
  assertDriverAssignable,
  assertVehicleAssignable,
  getDriverOrThrow,
  getVehicleOrThrow,
  tripInclude,
} from "./trip.validators.js";
import { getTripOrThrow } from "./trip.service.js";
import type { CompleteTripInput } from "./trip.schema.js";

type TripResult = Awaited<ReturnType<typeof getTripOrThrow>>;

function emitTripUpdated(trip: TripResult): TripResult {
  publish(AppEvent.TripUpdated, {
    tripId: trip.id,
    status: trip.status,
    vehicleId: trip.vehicleId,
    driverId: trip.driverId,
  });
  return trip;
}

export async function dispatchTrip(id: string) {
  const trip = await getTripOrThrow(id);
  if (trip.status !== TripStatus.DRAFT) {
    throw ApiError.conflict("Only draft trips can be dispatched");
  }
  if (!trip.vehicleId || !trip.driverId) {
    throw ApiError.badRequest(
      "Assign an available vehicle and driver before dispatching",
    );
  }

  const vehicle = await getVehicleOrThrow(trip.vehicleId);
  const driver = await getDriverOrThrow(trip.driverId);
  assertVehicleAssignable(vehicle);
  assertDriverAssignable(driver);
  assertCargoWithinCapacity(trip.cargoWeightKg.toNumber(), vehicle.maxLoadCapacityKg);

  const result = await prisma.$transaction(async (tx) => {
    const vehicleClaim = await tx.vehicle.updateMany({
      where: { id: vehicle.id, status: VehicleStatus.AVAILABLE },
      data: { status: VehicleStatus.ON_TRIP },
    });
    if (vehicleClaim.count === 0) {
      throw ApiError.conflict(
        "This vehicle was just assigned elsewhere and is no longer available",
        { field: "vehicleId" },
      );
    }
    const driverClaim = await tx.driver.updateMany({
      where: { id: driver.id, status: DriverStatus.AVAILABLE },
      data: { status: DriverStatus.ON_TRIP },
    });
    if (driverClaim.count === 0) {
      throw ApiError.conflict(
        "This driver was just assigned elsewhere and is no longer available",
        { field: "driverId" },
      );
    }
    return tx.trip.update({
      where: { id },
      data: {
        status: TripStatus.DISPATCHED,
        dispatchedAt: new Date(),
        startOdometer: vehicle.odometer,
      },
      include: tripInclude,
    });
  });
  return emitTripUpdated(result);
}

export async function completeTrip(id: string, input: CompleteTripInput) {
  const trip = await getTripOrThrow(id);
  if (trip.status !== TripStatus.DISPATCHED) {
    throw ApiError.conflict("Only dispatched trips can be completed");
  }
  if (trip.startOdometer !== null && input.endOdometer < trip.startOdometer) {
    throw ApiError.unprocessable(
      "End odometer cannot be less than the start odometer",
      { field: "endOdometer" },
    );
  }

  const distance =
    input.actualDistanceKm ??
    (trip.startOdometer !== null
      ? input.endOdometer - trip.startOdometer
      : undefined);

  const data: Prisma.TripUpdateInput = {
    status: TripStatus.COMPLETED,
    completedAt: new Date(),
    endOdometer: input.endOdometer,
    ...(input.fuelConsumedL !== undefined ? { fuelConsumedL: input.fuelConsumedL } : {}),
    ...(distance !== undefined ? { actualDistanceKm: distance } : {}),
    ...(input.revenue !== undefined ? { revenue: input.revenue } : {}),
  };

  const result = await prisma.$transaction(async (tx) => {
    if (trip.vehicleId) {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE, odometer: input.endOdometer },
      });
    }
    if (trip.driverId) {
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      });
    }
    return tx.trip.update({ where: { id }, data, include: tripInclude });
  });
  return emitTripUpdated(result);
}

export async function cancelTrip(id: string) {
  const trip = await getTripOrThrow(id);
  if (trip.status === TripStatus.COMPLETED) {
    throw ApiError.conflict("Completed trips cannot be cancelled");
  }
  if (trip.status === TripStatus.CANCELLED) {
    throw ApiError.conflict("This trip is already cancelled");
  }

  const wasDispatched = trip.status === TripStatus.DISPATCHED;
  const result = await prisma.$transaction(async (tx) => {
    if (wasDispatched && trip.vehicleId) {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });
    }
    if (wasDispatched && trip.driverId) {
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      });
    }
    return tx.trip.update({
      where: { id },
      data: { status: TripStatus.CANCELLED, cancelledAt: new Date() },
      include: tripInclude,
    });
  });
  return emitTripUpdated(result);
}
