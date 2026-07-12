import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums.js";
import { type AccessLevel, type AppModule, canAccess } from "../config/rbac.js";
import { ApiError } from "../utils/api-error.js";

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}

export function requirePermission(module: AppModule, level: AccessLevel = "view") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }
    if (!canAccess(req.user.role, module, level)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}
