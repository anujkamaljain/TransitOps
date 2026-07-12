import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import {
  clearAuthCookies,
  REFRESH_COOKIE,
  setAuthCookies,
} from "./auth.cookies.js";
import {
  getCurrentUser,
  loginUser,
  logoutSession,
  refreshSession,
} from "./auth.service.js";
import type { LoginInput } from "./auth.schema.js";
import type { SessionContext } from "./auth.types.js";

function sessionContext(req: Request): SessionContext {
  return { userAgent: req.headers["user-agent"], ipAddress: req.ip };
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;
  const result = await loginUser(email, password, sessionContext(req));
  setAuthCookies(res, result.accessToken, result.refreshToken);
  sendSuccess(res, { user: result.user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  const result = await refreshSession(raw, sessionContext(req));
  setAuthCookies(res, result.accessToken, result.refreshToken);
  sendSuccess(res, { user: result.user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutSession(req.cookies?.[REFRESH_COOKIE] as string | undefined);
  clearAuthCookies(res);
  sendSuccess(res, { message: "Signed out successfully" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }
  const user = await getCurrentUser(req.user.id);
  sendSuccess(res, { user });
});
