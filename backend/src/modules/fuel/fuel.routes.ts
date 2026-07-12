import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { create, getOne, list, remove, update } from "./fuel.controller.js";
import {
  createFuelLogSchema,
  fuelLogIdParamSchema,
  listFuelLogsQuerySchema,
  updateFuelLogSchema,
} from "./fuel.schema.js";

export const fuelRouter = Router();

fuelRouter.use(authenticate);

fuelRouter.get(
  "/",
  requirePermission("fuelExpenses", "view"),
  validate({ query: listFuelLogsQuerySchema }),
  list,
);
fuelRouter.post(
  "/",
  requirePermission("fuelExpenses", "manage"),
  validate({ body: createFuelLogSchema }),
  create,
);
fuelRouter.get(
  "/:id",
  requirePermission("fuelExpenses", "view"),
  validate({ params: fuelLogIdParamSchema }),
  getOne,
);
fuelRouter.patch(
  "/:id",
  requirePermission("fuelExpenses", "manage"),
  validate({ params: fuelLogIdParamSchema, body: updateFuelLogSchema }),
  update,
);
fuelRouter.delete(
  "/:id",
  requirePermission("fuelExpenses", "manage"),
  validate({ params: fuelLogIdParamSchema }),
  remove,
);
