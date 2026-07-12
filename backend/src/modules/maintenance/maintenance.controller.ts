import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { buildPaginationMeta } from "../../utils/pagination.js";
import {
  closeMaintenance,
  createMaintenance,
  deleteMaintenance,
  getMaintenanceOrThrow,
  listMaintenance,
  updateMaintenance,
} from "./maintenance.service.js";
import type {
  CreateMaintenanceInput,
  ListMaintenanceQuery,
  UpdateMaintenanceInput,
} from "./maintenance.schema.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListMaintenanceQuery;
  const { items, total } = await listMaintenance(query);
  sendSuccess(res, items, 200, buildPaginationMeta(query.page, query.pageSize, total));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await getMaintenanceOrThrow(req.params.id as string));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const log = await createMaintenance(req.body as CreateMaintenanceInput, req.user?.id);
  sendSuccess(res, log, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const log = await updateMaintenance(req.params.id as string, req.body as UpdateMaintenanceInput);
  sendSuccess(res, log);
});

export const close = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await closeMaintenance(req.params.id as string));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteMaintenance(req.params.id as string);
  sendSuccess(res, { message: "Maintenance record deleted" });
});
