import type { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIE } from "../modules/auth/auth.cookies.js";
import { verifyAccessToken } from "../modules/auth/token.service.js";
import { ApiError } from "../utils/api-error.js";

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

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const token = extractToken(req);
  if (!token) {
    next(ApiError.unauthorized());
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(ApiError.unauthorized("Session expired or invalid, please sign in again"));
  }
}
