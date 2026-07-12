import type { User } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { verifyPassword } from "../../utils/password.js";
import {
  LOCK_DURATION_MS,
  MAX_FAILED_ATTEMPTS,
  REFRESH_TTL_MS,
} from "./auth.constants.js";
import {
  generateRefreshToken,
  hashToken,
  signAccessToken,
} from "./token.service.js";
import type { PublicUser, SessionContext, SessionResult } from "./auth.types.js";

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
  };
}

async function issueSession(
  user: User,
  ctx: SessionContext,
): Promise<SessionResult> {
  const { token, tokenHash } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      userAgent: ctx.userAgent,
      ipAddress: ctx.ipAddress,
    },
  });
  return {
    user: toPublicUser(user),
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    refreshToken: token,
  };
}

async function registerFailedAttempt(user: User): Promise<void> {
  const attempts = user.failedLoginAttempts + 1;
  const locked = attempts >= MAX_FAILED_ATTEMPTS;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: attempts,
      lockedUntil: locked ? new Date(Date.now() + LOCK_DURATION_MS) : null,
    },
  });
}

export async function loginUser(
  email: string,
  password: string,
  ctx: SessionContext,
): Promise<SessionResult> {
  const invalidCredentials = ApiError.unauthorized("Invalid email or password");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw invalidCredentials;
  }
  if (!user.isActive) {
    throw ApiError.forbidden("Your account is disabled. Contact an administrator.");
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw ApiError.forbidden(
      "Account temporarily locked after multiple failed attempts. Try again later.",
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await registerFailedAttempt(user);
    throw invalidCredentials;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
  return issueSession(user, ctx);
}

export async function refreshSession(
  rawToken: string | undefined,
  ctx: SessionContext,
): Promise<SessionResult> {
  if (!rawToken) {
    throw ApiError.unauthorized("Missing session");
  }
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized("Session expired, please sign in again");
  }
  if (!stored.user.isActive) {
    throw ApiError.forbidden("Your account is disabled. Contact an administrator.");
  }
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });
  return issueSession(stored.user, ctx);
}

export async function logoutSession(rawToken: string | undefined): Promise<void> {
  if (!rawToken) {
    return;
  }
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.unauthorized();
  }
  return toPublicUser(user);
}
