import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import {
  assertTripExists,
  assertVehicleExists,
} from "../../utils/entity-guards.js";
import type {
  CreateFuelLogInput,
  ListFuelLogsQuery,
  UpdateFuelLogInput,
} from "./fuel.schema.js";

const fuelInclude = {
  vehicle: { select: { id: true, registrationNumber: true, name: true } },
} satisfies Prisma.FuelLogInclude;

export async function getFuelLogOrThrow(id: string) {
  const log = await prisma.fuelLog.findUnique({ where: { id }, include: fuelInclude });
  if (!log) {
    throw ApiError.notFound("Fuel log not found");
  }
  return log;
}

export async function listFuelLogs(query: ListFuelLogsQuery) {
  const { page, pageSize, vehicleId, tripId, fuelType, sortBy, sortOrder } = query;

  const where: Prisma.FuelLogWhereInput = {
    ...(vehicleId ? { vehicleId } : {}),
    ...(tripId ? { tripId } : {}),
    ...(fuelType ? { fuelType } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.fuelLog.findMany({
      where,
      include: fuelInclude,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.fuelLog.count({ where }),
  ]);

  return { items, total };
}

export async function createFuelLog(input: CreateFuelLogInput, userId?: string) {
  await assertVehicleExists(input.vehicleId);
  if (input.tripId) {
    await assertTripExists(input.tripId);
  }
  return prisma.fuelLog.create({
    data: { ...input, loggedById: userId ?? null },
    include: fuelInclude,
  });
}

export async function updateFuelLog(id: string, input: UpdateFuelLogInput) {
  await getFuelLogOrThrow(id);
  return prisma.fuelLog.update({ where: { id }, data: input, include: fuelInclude });
}

export async function deleteFuelLog(id: string) {
  await getFuelLogOrThrow(id);
  await prisma.fuelLog.delete({ where: { id } });
}
