import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import {
  cancel,
  complete,
  create,
  dispatch,
  getOne,
  list,
  remove,
  update,
} from "./trip.controller.js";
import {
  completeTripSchema,
  createTripSchema,
  listTripsQuerySchema,
  tripIdParamSchema,
  updateTripSchema,
} from "./trip.schema.js";

export const tripRouter = Router();

tripRouter.use(authenticate);

tripRouter.get(
  "/",
  requirePermission("trips", "view"),
  validate({ query: listTripsQuerySchema }),
  list,
);
tripRouter.post(
  "/",
  requirePermission("trips", "manage"),
  validate({ body: createTripSchema }),
  create,
);
tripRouter.get(
  "/:id",
  requirePermission("trips", "view"),
  validate({ params: tripIdParamSchema }),
  getOne,
);
tripRouter.patch(
  "/:id",
  requirePermission("trips", "manage"),
  validate({ params: tripIdParamSchema, body: updateTripSchema }),
  update,
);
tripRouter.post(
  "/:id/dispatch",
  requirePermission("trips", "manage"),
  validate({ params: tripIdParamSchema }),
  dispatch,
);
tripRouter.post(
  "/:id/complete",
  requirePermission("trips", "manage"),
  validate({ params: tripIdParamSchema, body: completeTripSchema }),
  complete,
);
tripRouter.post(
  "/:id/cancel",
  requirePermission("trips", "manage"),
  validate({ params: tripIdParamSchema }),
  cancel,
);
tripRouter.delete(
  "/:id",
  requirePermission("trips", "manage"),
  validate({ params: tripIdParamSchema }),
  remove,
);
