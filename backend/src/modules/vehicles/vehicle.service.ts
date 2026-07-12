import { Prisma } from "../../generated/prisma/client.js";
import { VehicleStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import type {
  CreateVehicleInput,
  ListVehiclesQuery,
  UpdateVehicleInput,
} from "./vehicle.schema.js";

async function ensureUniqueRegistration(
  registrationNumber: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber },
  });
  if (existing && existing.id !== excludeId) {
    throw ApiError.conflict(
      `Registration number ${registrationNumber} is already registered`,
      { field: "registrationNumber" },
    );
  }
}

export async function listVehicles(query: ListVehiclesQuery) {
  const { page, pageSize, type, status, region, search, sortBy, sortOrder } =
    query;

  const where: Prisma.VehicleWhereInput = {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(region ? { region: { equals: region, mode: "insensitive" } } : {}),
    ...(search
      ? {
          OR: [
            { registrationNumber: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.vehicle.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return { items, total };
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw ApiError.notFound("Vehicle not found");
  }
  return vehicle;
}

export async function createVehicle(input: CreateVehicleInput) {
  await ensureUniqueRegistration(input.registrationNumber);
  return prisma.vehicle.create({ data: input });
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  await getVehicleById(id);
  if (input.registrationNumber) {
    await ensureUniqueRegistration(input.registrationNumber, id);
  }
  return prisma.vehicle.update({ where: { id }, data: input });
}

export async function updateVehicleStatus(id: string, status: VehicleStatus) {
  const vehicle = await getVehicleById(id);
  if (vehicle.status === VehicleStatus.ON_TRIP) {
    throw ApiError.conflict(
      "Vehicle is on a trip; complete or cancel the trip first",
    );
  }
  if (vehicle.status === VehicleStatus.IN_SHOP && status === VehicleStatus.AVAILABLE) {
    throw ApiError.conflict(
      "Close the maintenance record to bring this vehicle back to Available",
    );
  }
  return prisma.vehicle.update({ where: { id }, data: { status } });
}

export async function deleteVehicle(id: string) {
  const vehicle = await getVehicleById(id);
  if (
    vehicle.status === VehicleStatus.ON_TRIP ||
    vehicle.status === VehicleStatus.IN_SHOP
  ) {
    throw ApiError.conflict(
      "Cannot delete a vehicle that is on a trip or in maintenance",
    );
  }
  await prisma.vehicle.delete({ where: { id } });
}
