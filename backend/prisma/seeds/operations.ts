import type { PrismaClient } from "../../src/generated/prisma/client.js";
import {
  DriverStatus,
  ExpenseType,
  FuelType,
  MaintenanceStatus,
  TripStatus,
  VehicleStatus,
} from "../../src/generated/prisma/enums.js";

function monthsAgo(months: number, day = 15): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  date.setDate(day);
  date.setHours(10, 0, 0, 0);
  return date;
}

export async function seedOperations(prisma: PrismaClient): Promise<void> {
  if ((await prisma.trip.count()) > 0) {
    return;
  }

  const vehicles = await prisma.vehicle.findMany();
  const drivers = await prisma.driver.findMany();
  const vehicle = (reg: string) =>
    vehicles.find((item) => item.registrationNumber === reg)!;
  const driver = (lic: string) =>
    drivers.find((item) => item.licenseNumber === lic)!;

  const v1 = vehicle("KA01AB1234");
  const v2 = vehicle("KA05CD5678");
  const v3 = vehicle("MH12EF9012");
  const v4 = vehicle("MH14GH3456");
  const v5 = vehicle("DL01IJ7890");
  const d1 = driver("DL2019045501");
  const d2 = driver("MH2020078223");
  const d3 = driver("KA2021009112");

  const completed = [
    { code: "TRP-SEED0001", v: v1, d: d1, src: "Bangalore", dst: "Mysore", cargo: 600, dist: 145, rev: 12000, fuel: 18, month: 4 },
    { code: "TRP-SEED0002", v: v2, d: d2, src: "Pune", dst: "Mumbai", cargo: 1000, dist: 150, rev: 15000, fuel: 22, month: 3 },
    { code: "TRP-SEED0003", v: v3, d: d1, src: "Pune", dst: "Nashik", cargo: 7000, dist: 210, rev: 42000, fuel: 60, month: 2 },
    { code: "TRP-SEED0004", v: v1, d: d3, src: "Bangalore", dst: "Hosur", cargo: 500, dist: 40, rev: 5000, fuel: 6, month: 1 },
    { code: "TRP-SEED0005", v: v4, d: d2, src: "Pune", dst: "Surat", cargo: 11000, dist: 420, rev: 78000, fuel: 130, month: 0 },
  ];

  for (const trip of completed) {
    const when = monthsAgo(trip.month);
    await prisma.trip.create({
      data: {
        tripCode: trip.code,
        source: trip.src,
        destination: trip.dst,
        vehicleId: trip.v.id,
        driverId: trip.d.id,
        cargoWeightKg: trip.cargo,
        plannedDistanceKm: trip.dist,
        actualDistanceKm: trip.dist,
        status: TripStatus.COMPLETED,
        revenue: trip.rev,
        startOdometer: trip.v.odometer,
        endOdometer: trip.v.odometer + trip.dist,
        fuelConsumedL: trip.fuel,
        dispatchedAt: when,
        completedAt: when,
      },
    });
    await prisma.fuelLog.create({
      data: { vehicleId: trip.v.id, liters: trip.fuel, cost: trip.fuel * 100, fuelType: FuelType.DIESEL, filledAt: when },
    });
  }

  await prisma.trip.create({
    data: {
      tripCode: "TRP-SEED0006",
      source: "Delhi",
      destination: "Agra",
      vehicleId: v5.id,
      driverId: d2.id,
      cargoWeightKg: 1200,
      plannedDistanceKm: 230,
      status: TripStatus.DISPATCHED,
      startOdometer: v5.odometer,
      dispatchedAt: new Date(),
    },
  });
  await prisma.vehicle.update({ where: { id: v5.id }, data: { status: VehicleStatus.ON_TRIP } });
  await prisma.driver.update({ where: { id: d2.id }, data: { status: DriverStatus.ON_TRIP } });

  await prisma.trip.create({
    data: {
      tripCode: "TRP-SEED0007",
      source: "Bangalore",
      destination: "Chennai",
      cargoWeightKg: 700,
      plannedDistanceKm: 350,
      status: TripStatus.DRAFT,
    },
  });

  await prisma.maintenanceLog.create({
    data: { vehicleId: v2.id, serviceType: "Brake Inspection", description: "Front brake pads", cost: 4500, serviceDate: new Date(), status: MaintenanceStatus.ACTIVE },
  });
  await prisma.vehicle.update({ where: { id: v2.id }, data: { status: VehicleStatus.IN_SHOP } });
  await prisma.maintenanceLog.create({
    data: { vehicleId: v3.id, serviceType: "Oil Change", cost: 3200, serviceDate: monthsAgo(2), status: MaintenanceStatus.COMPLETED, closedAt: monthsAgo(2) },
  });

  await prisma.expense.createMany({
    data: [
      { type: ExpenseType.TOLL, amount: 850, description: "NH-48 tolls", incurredAt: monthsAgo(1), vehicleId: v1.id },
      { type: ExpenseType.PERMIT, amount: 2200, description: "Interstate permit", incurredAt: monthsAgo(2), vehicleId: v3.id },
      { type: ExpenseType.PARKING, amount: 300, description: "Depot parking", incurredAt: monthsAgo(0), vehicleId: v4.id },
    ],
  });
}
