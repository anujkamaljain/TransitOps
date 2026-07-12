import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { buildPaginationMeta } from "../../utils/pagination.js";
import {
  createFuelLog,
  deleteFuelLog,
  getFuelLogOrThrow,
  listFuelLogs,
  updateFuelLog,
} from "./fuel.service.js";
import type {
  CreateFuelLogInput,
  ListFuelLogsQuery,
  UpdateFuelLogInput,
} from "./fuel.schema.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListFuelLogsQuery;
  const { items, total } = await listFuelLogs(query);
  sendSuccess(res, items, 200, buildPaginationMeta(query.page, query.pageSize, total));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await getFuelLogOrThrow(req.params.id as string));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const log = await createFuelLog(req.body as CreateFuelLogInput, req.user?.id);
  sendSuccess(res, log, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const log = await updateFuelLog(req.params.id as string, req.body as UpdateFuelLogInput);
  sendSuccess(res, log);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteFuelLog(req.params.id as string);
  sendSuccess(res, { message: "Fuel log deleted" });
});
