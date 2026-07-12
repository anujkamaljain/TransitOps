import type { PrismaClient } from "../../src/generated/prisma/client.js";
import { UserRole } from "../../src/generated/prisma/enums.js";
import { hashPassword } from "../../src/utils/password.js";

const DEMO_PASSWORD = "Transit@2026";

const seedUserList = [
  { email: "manager@transitops.in", fullName: "Riya Fleet", role: UserRole.FLEET_MANAGER },
  { email: "dispatcher@transitops.in", fullName: "Raven Kohli", role: UserRole.DISPATCHER },
  { email: "safety@transitops.in", fullName: "Sameer Officer", role: UserRole.SAFETY_OFFICER },
  { email: "analyst@transitops.in", fullName: "Ana Ledger", role: UserRole.FINANCIAL_ANALYST },
];

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  for (const user of seedUserList) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        role: user.role,
        isActive: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      create: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        passwordHash,
      },
    });
  }
}
