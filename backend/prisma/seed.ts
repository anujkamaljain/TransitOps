import { prisma } from "./seeds/client.js";
import { seedOrgSettings } from "./seeds/org-settings.js";

async function main(): Promise<void> {
  await seedOrgSettings(prisma);
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
