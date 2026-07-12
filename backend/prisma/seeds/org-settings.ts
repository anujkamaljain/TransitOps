import type { PrismaClient } from "../../src/generated/prisma/client.js";

export async function seedOrgSettings(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.orgSettings.findFirst();

  if (existing) {
    return;
  }

  await prisma.orgSettings.create({
    data: {
      depotName: "TransitOps Depot",
      currency: "INR",
      distanceUnit: "km",
    },
  });
}
