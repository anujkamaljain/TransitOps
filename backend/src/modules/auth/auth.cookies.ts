import type { CookieOptions, Response } from "express";
import { accessTtlMs, isProduction, refreshTtlMs } from "../../config/env.js";

export const ACCESS_COOKIE = "transitops_access";
export const REFRESH_COOKIE = "transitops_refresh";

const REFRESH_PATH = "/api/auth";

function baseOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseOptions(),
    path: "/",
    maxAge: accessTtlMs,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOptions(),
    path: REFRESH_PATH,
    maxAge: refreshTtlMs,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { ...baseOptions(), path: "/" });
  res.clearCookie(REFRESH_COOKIE, { ...baseOptions(), path: REFRESH_PATH });
}
