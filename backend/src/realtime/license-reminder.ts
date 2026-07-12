import { DriverStatus } from "../generated/prisma/enums.js";
import { logger } from "../lib/logger.js";
import { prisma } from "../lib/prisma.js";
import { EXPIRING_SOON_DAYS } from "../modules/drivers/driver.constants.js";
import { AppEvent, publish } from "./event-bus.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 60 * 1000;

export async function runLicenseReminderCheck(): Promise<number> {
  const now = new Date();
  const threshold = new Date(now.getTime() + EXPIRING_SOON_DAYS * DAY_MS);

  const drivers = await prisma.driver.findMany({
    where: {
      status: { not: DriverStatus.SUSPENDED },
      licenseExpiry: { lte: threshold },
    },
    select: { id: true, fullName: true, licenseNumber: true, licenseExpiry: true },
    orderBy: { licenseExpiry: "asc" },
  });

  if (drivers.length > 0) {
    publish(AppEvent.LicenseExpiring, {
      count: drivers.length,
      drivers: drivers.map((driver) => ({
        ...driver,
        expired: driver.licenseExpiry.getTime() < now.getTime(),
      })),
    });
    logger.info(
      `License reminder: ${drivers.length} driver(s) with expired or expiring licenses`,
    );
  }

  return drivers.length;
}

export function startLicenseReminders(): NodeJS.Timeout {
  void runLicenseReminderCheck();
  const timer = setInterval(() => void runLicenseReminderCheck(), CHECK_INTERVAL_MS);
  timer.unref();
  return timer;
}
