import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { buildPaginationMeta } from "../../utils/pagination.js";
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listVehicles,
  updateVehicle,
  updateVehicleStatus,
} from "./vehicle.service.js";
import type {
  CreateVehicleInput,
  ListVehiclesQuery,
  UpdateVehicleInput,
  UpdateVehicleStatusInput,
} from "./vehicle.schema.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListVehiclesQuery;
  const { items, total } = await listVehicles(query);
  sendSuccess(res, items, 200, buildPaginationMeta(query.page, query.pageSize, total));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await getVehicleById(req.params.id as string);
  sendSuccess(res, vehicle);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await createVehicle(req.body as CreateVehicleInput);
  sendSuccess(res, vehicle, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await updateVehicle(req.params.id as string, req.body as UpdateVehicleInput);
  sendSuccess(res, vehicle);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as UpdateVehicleStatusInput;
  const vehicle = await updateVehicleStatus(req.params.id as string, status);
  sendSuccess(res, vehicle);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteVehicle(req.params.id as string);
  sendSuccess(res, { message: "Vehicle deleted" });
});
