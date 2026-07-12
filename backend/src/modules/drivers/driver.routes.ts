import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import {
  create,
  getOne,
  list,
  remove,
  update,
  updateStatus,
} from "./driver.controller.js";
import {
  createDriverSchema,
  driverIdParamSchema,
  listDriversQuerySchema,
  updateDriverSchema,
  updateDriverStatusSchema,
} from "./driver.schema.js";

export const driverRouter = Router();

driverRouter.use(authenticate);

driverRouter.get(
  "/",
  requirePermission("drivers", "view"),
  validate({ query: listDriversQuerySchema }),
  list,
);
driverRouter.post(
  "/",
  requirePermission("drivers", "manage"),
  validate({ body: createDriverSchema }),
  create,
);
driverRouter.get(
  "/:id",
  requirePermission("drivers", "view"),
  validate({ params: driverIdParamSchema }),
  getOne,
);
driverRouter.patch(
  "/:id",
  requirePermission("drivers", "manage"),
  validate({ params: driverIdParamSchema, body: updateDriverSchema }),
  update,
);
driverRouter.patch(
  "/:id/status",
  requirePermission("drivers", "manage"),
  validate({ params: driverIdParamSchema, body: updateDriverStatusSchema }),
  updateStatus,
);
driverRouter.delete(
  "/:id",
  requirePermission("drivers", "manage"),
  validate({ params: driverIdParamSchema }),
  remove,
);
