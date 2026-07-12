import type { UserRole } from "../../generated/prisma/enums.js";

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
}

export interface SessionContext {
  userAgent?: string;
  ipAddress?: string;
}

export interface SessionResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}
