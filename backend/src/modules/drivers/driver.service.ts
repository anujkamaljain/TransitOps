import type { Driver } from "../../generated/prisma/client.js";
import { Prisma } from "../../generated/prisma/client.js";
import { DriverStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { EXPIRING_SOON_DAYS } from "./driver.constants.js";
import type {
  CreateDriverInput,
  ListDriversQuery,
  UpdateDriverInput,
} from "./driver.schema.js";

const DAY_MS = 24 * 60 * 60 * 1000;

type ExpiryFilter = "expired" | "expiring" | "valid";

function toDriverView(driver: Driver) {
  const days = Math.ceil((driver.licenseExpiry.getTime() - Date.now()) / DAY_MS);
  return {
    ...driver,
    daysUntilLicenseExpiry: days,
    isLicenseExpired: days < 0,
    licenseExpiringSoon: days >= 0 && days <= EXPIRING_SOON_DAYS,
  };
}

async function ensureUniqueLicense(
  licenseNumber: string,
  excludeId?: string,
): Promise<void> {
  const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
  if (existing && existing.id !== excludeId) {
    throw ApiError.conflict(
      `License number ${licenseNumber} is already registered`,
      { field: "licenseNumber" },
    );
  }
}

function buildExpiryFilter(expiry?: ExpiryFilter): Prisma.DriverWhereInput {
  if (!expiry) {
    return {};
  }
  const now = new Date();
  if (expiry === "expired") {
    return { licenseExpiry: { lt: now } };
  }
  const soon = new Date(now.getTime() + EXPIRING_SOON_DAYS * DAY_MS);
  if (expiry === "expiring") {
    return { licenseExpiry: { gte: now, lte: soon } };
  }
  return { licenseExpiry: { gt: soon } };
}

export async function listDrivers(query: ListDriversQuery) {
  const {
    page,
    pageSize,
    status,
    licenseCategory,
    region,
    search,
    expiry,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.DriverWhereInput = {
    ...(status ? { status } : {}),
    ...(licenseCategory ? { licenseCategory } : {}),
    ...(region ? { region: { equals: region, mode: "insensitive" } } : {}),
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { licenseNumber: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...buildExpiryFilter(expiry),
  };

  const [items, total] = await prisma.$transaction([
    prisma.driver.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.driver.count({ where }),
  ]);

  return { items: items.map(toDriverView), total };
}

export async function getDriverById(id: string) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    throw ApiError.notFound("Driver not found");
  }
  return toDriverView(driver);
}

export async function createDriver(input: CreateDriverInput) {
  await ensureUniqueLicense(input.licenseNumber);
  const driver = await prisma.driver.create({ data: input });
  return toDriverView(driver);
}

export async function updateDriver(id: string, input: UpdateDriverInput) {
  await getDriverById(id);
  const driver = await prisma.driver.update({ where: { id }, data: input });
  return toDriverView(driver);
}

export async function updateDriverStatus(id: string, status: DriverStatus) {
  const driver = await getDriverById(id);
  if (driver.status === DriverStatus.ON_TRIP) {
    throw ApiError.conflict(
      "Driver is on a trip; complete or cancel the trip first",
    );
  }
  const updated = await prisma.driver.update({ where: { id }, data: { status } });
  return toDriverView(updated);
}

export async function deleteDriver(id: string) {
  const driver = await getDriverById(id);
  if (driver.status === DriverStatus.ON_TRIP) {
    throw ApiError.conflict("Cannot delete a driver who is on a trip");
  }
  const tripCount = await prisma.trip.count({ where: { driverId: id } });
  if (tripCount > 0) {
    throw ApiError.conflict(
      "This driver has trips on record. Set them to Off Duty or Suspended instead of deleting.",
    );
  }
  await prisma.driver.delete({ where: { id } });
}
