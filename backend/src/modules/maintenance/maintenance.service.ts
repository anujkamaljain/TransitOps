import { Prisma } from "../../generated/prisma/client.js";
import {
  MaintenanceStatus,
  VehicleStatus,
} from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import type {
  CreateMaintenanceInput,
  ListMaintenanceQuery,
  UpdateMaintenanceInput,
} from "./maintenance.schema.js";

const maintenanceInclude = {
  vehicle: {
    select: { id: true, registrationNumber: true, name: true, status: true },
  },
} satisfies Prisma.MaintenanceLogInclude;

async function restoreVehicleIfIdle(
  tx: Prisma.TransactionClient,
  vehicleId: string,
): Promise<void> {
  const openCount = await tx.maintenanceLog.count({
    where: { vehicleId, status: MaintenanceStatus.ACTIVE },
  });
  if (openCount > 0) {
    return;
  }
  const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
  if (vehicle && vehicle.status === VehicleStatus.IN_SHOP) {
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: { status: VehicleStatus.AVAILABLE },
    });
  }
}

export async function getMaintenanceOrThrow(id: string) {
  const log = await prisma.maintenanceLog.findUnique({
    where: { id },
    include: maintenanceInclude,
  });
  if (!log) {
    throw ApiError.notFound("Maintenance record not found");
  }
  return log;
}

export async function listMaintenance(query: ListMaintenanceQuery) {
  const { page, pageSize, status, vehicleId, search, sortBy, sortOrder } = query;

  const where: Prisma.MaintenanceLogWhereInput = {
    ...(status ? { status } : {}),
    ...(vehicleId ? { vehicleId } : {}),
    ...(search
      ? { serviceType: { contains: search, mode: "insensitive" } }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.maintenanceLog.findMany({
      where,
      include: maintenanceInclude,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.maintenanceLog.count({ where }),
  ]);

  return { items, total };
}

export async function createMaintenance(
  input: CreateMaintenanceInput,
  userId?: string,
) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: input.vehicleId },
  });
  if (!vehicle) {
    throw ApiError.notFound("Vehicle not found");
  }
  if (vehicle.status === VehicleStatus.ON_TRIP) {
    throw ApiError.conflict(
      "Vehicle is on a trip; complete or cancel the trip first",
    );
  }
  if (vehicle.status === VehicleStatus.RETIRED) {
    throw ApiError.conflict("Retired vehicles cannot be sent for maintenance");
  }

  return prisma.$transaction(async (tx) => {
    await tx.vehicle.update({
      where: { id: vehicle.id },
      data: { status: VehicleStatus.IN_SHOP },
    });
    return tx.maintenanceLog.create({
      data: {
        ...input,
        status: MaintenanceStatus.ACTIVE,
        loggedById: userId ?? null,
      },
      include: maintenanceInclude,
    });
  });
}

export async function updateMaintenance(id: string, input: UpdateMaintenanceInput) {
  const log = await getMaintenanceOrThrow(id);
  if (log.status !== MaintenanceStatus.ACTIVE) {
    throw ApiError.conflict("Only active maintenance records can be edited");
  }
  return prisma.maintenanceLog.update({
    where: { id },
    data: input,
    include: maintenanceInclude,
  });
}

export async function closeMaintenance(id: string) {
  const log = await getMaintenanceOrThrow(id);
  if (log.status !== MaintenanceStatus.ACTIVE) {
    throw ApiError.conflict("This maintenance record is already closed");
  }
  return prisma.$transaction(async (tx) => {
    await tx.maintenanceLog.update({
      where: { id },
      data: { status: MaintenanceStatus.COMPLETED, closedAt: new Date() },
    });
    await restoreVehicleIfIdle(tx, log.vehicleId);
    return tx.maintenanceLog.findUniqueOrThrow({
      where: { id },
      include: maintenanceInclude,
    });
  });
}

export async function deleteMaintenance(id: string) {
  const log = await getMaintenanceOrThrow(id);
  await prisma.$transaction(async (tx) => {
    await tx.maintenanceLog.delete({ where: { id } });
    if (log.status === MaintenanceStatus.ACTIVE) {
      await restoreVehicleIfIdle(tx, log.vehicleId);
    }
  });
}
