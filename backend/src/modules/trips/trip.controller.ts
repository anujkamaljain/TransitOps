import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { buildPaginationMeta } from "../../utils/pagination.js";
import {
  createTrip,
  deleteTrip,
  getTripOrThrow,
  listTrips,
  updateTrip,
} from "./trip.service.js";
import { cancelTrip, completeTrip, dispatchTrip } from "./trip.transitions.js";
import type {
  CompleteTripInput,
  CreateTripInput,
  ListTripsQuery,
  UpdateTripInput,
} from "./trip.schema.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListTripsQuery;
  const { items, total } = await listTrips(query);
  sendSuccess(res, items, 200, buildPaginationMeta(query.page, query.pageSize, total));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await getTripOrThrow(req.params.id));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const trip = await createTrip(req.body as CreateTripInput, req.user?.id);
  sendSuccess(res, trip, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const trip = await updateTrip(req.params.id, req.body as UpdateTripInput);
  sendSuccess(res, trip);
});

export const dispatch = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await dispatchTrip(req.params.id));
});

export const complete = asyncHandler(async (req: Request, res: Response) => {
  const trip = await completeTrip(req.params.id, req.body as CompleteTripInput);
  sendSuccess(res, trip);
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await cancelTrip(req.params.id));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteTrip(req.params.id);
  sendSuccess(res, { message: "Trip deleted" });
});
