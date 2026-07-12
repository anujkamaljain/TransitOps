import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import {
  close,
  create,
  getOne,
  list,
  remove,
  update,
} from "./maintenance.controller.js";
import {
  createMaintenanceSchema,
  listMaintenanceQuerySchema,
  maintenanceIdParamSchema,
  updateMaintenanceSchema,
} from "./maintenance.schema.js";

export const maintenanceRouter = Router();

maintenanceRouter.use(authenticate);

maintenanceRouter.get(
  "/",
  requirePermission("fleet", "view"),
  validate({ query: listMaintenanceQuerySchema }),
  list,
);
maintenanceRouter.post(
  "/",
  requirePermission("fleet", "manage"),
  validate({ body: createMaintenanceSchema }),
  create,
);
maintenanceRouter.get(
  "/:id",
  requirePermission("fleet", "view"),
  validate({ params: maintenanceIdParamSchema }),
  getOne,
);
maintenanceRouter.patch(
  "/:id",
  requirePermission("fleet", "manage"),
  validate({ params: maintenanceIdParamSchema, body: updateMaintenanceSchema }),
  update,
);
maintenanceRouter.post(
  "/:id/close",
  requirePermission("fleet", "manage"),
  validate({ params: maintenanceIdParamSchema }),
  close,
);
maintenanceRouter.delete(
  "/:id",
  requirePermission("fleet", "manage"),
  validate({ params: maintenanceIdParamSchema }),
  remove,
);
