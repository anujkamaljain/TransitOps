import type { Request } from "express";
import { prisma } from "../lib/prisma.js";
import { ACCESS_COOKIE } from "../modules/auth/auth.cookies.js";
import { verifyAccessToken } from "../modules/auth/token.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

function extractToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (cookieToken) {
    return cookieToken;
  }

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return undefined;
}

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw ApiError.unauthorized();
  }

  let userId: string;
  try {
    userId = verifyAccessToken(token).sub;
  } catch {
    throw ApiError.unauthorized("Session expired or invalid, please sign in again");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("Session is no longer valid, please sign in again");
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw ApiError.forbidden("Your account is locked. Try again later.");
  }

  req.user = { id: user.id, role: user.role };
  next();
});
