import { prisma } from "./seeds/client.js";
import { seedDrivers } from "./seeds/drivers.js";
import { seedFleet } from "./seeds/fleet.js";
import { seedOperations } from "./seeds/operations.js";
import { seedOrgSettings } from "./seeds/org-settings.js";
import { seedUsers } from "./seeds/users.js";

async function main(): Promise<void> {
  await seedOrgSettings(prisma);
  await seedUsers(prisma);
  await seedFleet(prisma);
  await seedDrivers(prisma);
  await seedOperations(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
