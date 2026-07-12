import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { buildPaginationMeta } from "../../utils/pagination.js";
import {
  createDriver,
  deleteDriver,
  getDriverById,
  listDrivers,
  updateDriver,
  updateDriverStatus,
} from "./driver.service.js";
import type {
  CreateDriverInput,
  ListDriversQuery,
  UpdateDriverInput,
  UpdateDriverStatusInput,
} from "./driver.schema.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListDriversQuery;
  const { items, total } = await listDrivers(query);
  sendSuccess(res, items, 200, buildPaginationMeta(query.page, query.pageSize, total));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const driver = await getDriverById(req.params.id as string);
  sendSuccess(res, driver);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const driver = await createDriver(req.body as CreateDriverInput);
  sendSuccess(res, driver, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const driver = await updateDriver(req.params.id as string, req.body as UpdateDriverInput);
  sendSuccess(res, driver);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as UpdateDriverStatusInput;
  const driver = await updateDriverStatus(req.params.id as string, status);
  sendSuccess(res, driver);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteDriver(req.params.id as string);
  sendSuccess(res, { message: "Driver deleted" });
});
