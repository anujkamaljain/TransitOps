import type { PrismaClient } from "../../src/generated/prisma/client.js";
import { VehicleStatus, VehicleType } from "../../src/generated/prisma/enums.js";

const vehicles = [
  { registrationNumber: "KA01AB1234", name: "Tata Ace Gold", type: VehicleType.MINI, maxLoadCapacityKg: 750, odometer: 42000, acquisitionCost: 850000, region: "Bangalore", status: VehicleStatus.AVAILABLE },
  { registrationNumber: "KA05CD5678", name: "Ashok Leyland Dost", type: VehicleType.VAN, maxLoadCapacityKg: 1250, odometer: 68000, acquisitionCost: 1200000, region: "Bangalore", status: VehicleStatus.AVAILABLE },
  { registrationNumber: "MH12EF9012", name: "Eicher Pro 2049", type: VehicleType.TRUCK, maxLoadCapacityKg: 9000, odometer: 120000, acquisitionCost: 3500000, region: "Pune", status: VehicleStatus.AVAILABLE },
  { registrationNumber: "MH14GH3456", name: "BharatBenz 1415", type: VehicleType.TRUCK, maxLoadCapacityKg: 12000, odometer: 90000, acquisitionCost: 4200000, region: "Pune", status: VehicleStatus.AVAILABLE },
  { registrationNumber: "DL01IJ7890", name: "Force Traveller", type: VehicleType.BUS, maxLoadCapacityKg: 2000, odometer: 55000, acquisitionCost: 2200000, region: "Delhi", status: VehicleStatus.AVAILABLE },
  { registrationNumber: "TN09KL2345", name: "Mahindra Bolero Pik-Up", type: VehicleType.CAR, maxLoadCapacityKg: 500, odometer: 210000, acquisitionCost: 950000, region: "Chennai", status: VehicleStatus.RETIRED },
];

export async function seedFleet(prisma: PrismaClient): Promise<void> {
  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { registrationNumber: vehicle.registrationNumber },
      update: {},
      create: vehicle,
    });
  }
}
