import { Prisma } from "../../generated/prisma/client.js";
import { TripStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import {
  assertCargoWithinCapacity,
  assertDriverAssignable,
  assertVehicleAssignable,
  generateTripCode,
  getDriverOrThrow,
  getVehicleOrThrow,
  isTripCodeCollision,
  tripInclude,
} from "./trip.validators.js";
import type {
  CreateTripInput,
  ListTripsQuery,
  UpdateTripInput,
} from "./trip.schema.js";

export async function getTripOrThrow(id: string) {
  const trip = await prisma.trip.findUnique({ where: { id }, include: tripInclude });
  if (!trip) {
    throw ApiError.notFound("Trip not found");
  }
  return trip;
}

export async function listTrips(query: ListTripsQuery) {
  const { page, pageSize, status, vehicleId, driverId, search, sortBy, sortOrder } =
    query;

  const where: Prisma.TripWhereInput = {
    ...(status ? { status } : {}),
    ...(vehicleId ? { vehicleId } : {}),
    ...(driverId ? { driverId } : {}),
    ...(search
      ? {
          OR: [
            { tripCode: { contains: search, mode: "insensitive" } },
            { source: { contains: search, mode: "insensitive" } },
            { destination: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.trip.findMany({
      where,
      include: tripInclude,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trip.count({ where }),
  ]);

  return { items, total };
}

export async function createTrip(input: CreateTripInput, userId?: string) {
  if (input.vehicleId) {
    const vehicle = await getVehicleOrThrow(input.vehicleId);
    assertVehicleAssignable(vehicle);
    assertCargoWithinCapacity(input.cargoWeightKg, vehicle.maxLoadCapacityKg);
  }
  if (input.driverId) {
    assertDriverAssignable(await getDriverOrThrow(input.driverId));
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.trip.create({
        data: { ...input, tripCode: generateTripCode(), createdById: userId ?? null },
        include: tripInclude,
      });
    } catch (error) {
      if (isTripCodeCollision(error) && attempt < 4) {
        continue;
      }
      throw error;
    }
  }
  throw ApiError.internal("Could not generate a unique trip code");
}

export async function updateTrip(id: string, input: UpdateTripInput) {
  const trip = await getTripOrThrow(id);
  if (trip.status !== TripStatus.DRAFT) {
    throw ApiError.conflict("Only draft trips can be edited");
  }

  const nextVehicleId =
    input.vehicleId !== undefined ? input.vehicleId : trip.vehicleId;
  const nextCargo = input.cargoWeightKg ?? trip.cargoWeightKg.toNumber();

  if (nextVehicleId) {
    const vehicle = await getVehicleOrThrow(nextVehicleId);
    if (input.vehicleId) {
      assertVehicleAssignable(vehicle);
    }
    assertCargoWithinCapacity(nextCargo, vehicle.maxLoadCapacityKg);
  }
  if (input.driverId) {
    assertDriverAssignable(await getDriverOrThrow(input.driverId));
  }

  return prisma.trip.update({ where: { id }, data: input, include: tripInclude });
}

export async function deleteTrip(id: string) {
  const trip = await getTripOrThrow(id);
  if (trip.status !== TripStatus.DRAFT) {
    throw ApiError.conflict("Only draft trips can be deleted");
  }
  await prisma.trip.delete({ where: { id } });
}
