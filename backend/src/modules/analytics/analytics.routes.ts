import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import {
  dashboard,
  exportReport,
  reports,
  vehicleCost,
} from "./analytics.controller.js";
import {
  dashboardQuerySchema,
  vehicleCostParamSchema,
} from "./analytics.schema.js";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate);

analyticsRouter.get(
  "/dashboard",
  validate({ query: dashboardQuerySchema }),
  dashboard,
);
analyticsRouter.get("/reports", requirePermission("analytics", "view"), reports);
analyticsRouter.get(
  "/reports/export",
  requirePermission("analytics", "view"),
  exportReport,
);
analyticsRouter.get(
  "/vehicles/:vehicleId/cost",
  requirePermission("analytics", "view"),
  validate({ params: vehicleCostParamSchema }),
  vehicleCost,
);
