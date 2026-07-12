import type { PrismaClient } from "../../src/generated/prisma/client.js";
import {
  DriverStatus,
  LicenseCategory,
} from "../../src/generated/prisma/enums.js";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * DAY_MS);
}

const drivers = [
  { fullName: "Arjun Mehta", licenseNumber: "DL2019045501", licenseCategory: LicenseCategory.LMV, licenseExpiry: daysFromNow(900), contactNumber: "9876543210", email: "arjun@transitops.in", safetyScore: 92, region: "Bangalore", status: DriverStatus.AVAILABLE },
  { fullName: "Sunita Rao", licenseNumber: "MH2020078223", licenseCategory: LicenseCategory.HMV, licenseExpiry: daysFromNow(650), contactNumber: "9876500011", email: "sunita@transitops.in", safetyScore: 88, region: "Pune", status: DriverStatus.AVAILABLE },
  { fullName: "Imran Sheikh", licenseNumber: "KA2021009112", licenseCategory: LicenseCategory.LMV, licenseExpiry: daysFromNow(20), contactNumber: "9876500022", safetyScore: 79, region: "Bangalore", status: DriverStatus.AVAILABLE },
  { fullName: "Ravi Kumar", licenseNumber: "TN2018034455", licenseCategory: LicenseCategory.HMV, licenseExpiry: daysFromNow(-120), contactNumber: "9876500033", safetyScore: 65, region: "Chennai", status: DriverStatus.OFF_DUTY },
  { fullName: "Vikram Singh", licenseNumber: "DL2022056778", licenseCategory: LicenseCategory.PSV, licenseExpiry: daysFromNow(1600), contactNumber: "9876500044", safetyScore: 41, region: "Delhi", status: DriverStatus.SUSPENDED },
];

export async function seedDrivers(prisma: PrismaClient): Promise<void> {
  for (const driver of drivers) {
    await prisma.driver.upsert({
      where: { licenseNumber: driver.licenseNumber },
      update: {},
      create: driver,
    });
  }
}
