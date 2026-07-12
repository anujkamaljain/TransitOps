import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { UserRole } from "../../generated/prisma/enums.js";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(
    { sub: payload.sub, role: payload.role },
    env.JWT_ACCESS_SECRET,
    options,
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  if (typeof decoded === "string" || !decoded.sub) {
    throw new Error("Invalid access token");
  }
  const role = decoded.role;
  if (!isUserRole(role)) {
    throw new Error("Invalid access token");
  }
  return { sub: String(decoded.sub), role };
}

function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (Object.values(UserRole) as string[]).includes(value)
  );
}

export function generateRefreshToken(): { token: string; tokenHash: string } {
  const token = randomBytes(48).toString("hex");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
