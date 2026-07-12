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
} from "./vehicle.controller.js";
import {
  createVehicleSchema,
  listVehiclesQuerySchema,
  updateVehicleSchema,
  updateVehicleStatusSchema,
  vehicleIdParamSchema,
} from "./vehicle.schema.js";

export const vehicleRouter = Router();

vehicleRouter.use(authenticate);

vehicleRouter.get(
  "/",
  requirePermission("fleet", "view"),
  validate({ query: listVehiclesQuerySchema }),
  list,
);
vehicleRouter.post(
  "/",
  requirePermission("fleet", "manage"),
  validate({ body: createVehicleSchema }),
  create,
);
vehicleRouter.get(
  "/:id",
  requirePermission("fleet", "view"),
  validate({ params: vehicleIdParamSchema }),
  getOne,
);
vehicleRouter.patch(
  "/:id",
  requirePermission("fleet", "manage"),
  validate({ params: vehicleIdParamSchema, body: updateVehicleSchema }),
  update,
);
vehicleRouter.patch(
  "/:id/status",
  requirePermission("fleet", "manage"),
  validate({ params: vehicleIdParamSchema, body: updateVehicleStatusSchema }),
  updateStatus,
);
vehicleRouter.delete(
  "/:id",
  requirePermission("fleet", "manage"),
  validate({ params: vehicleIdParamSchema }),
  remove,
);
