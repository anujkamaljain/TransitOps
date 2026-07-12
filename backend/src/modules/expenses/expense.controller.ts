import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { buildPaginationMeta } from "../../utils/pagination.js";
import {
  createExpense,
  deleteExpense,
  getExpenseOrThrow,
  listExpenses,
  updateExpense,
} from "./expense.service.js";
import type {
  CreateExpenseInput,
  ListExpensesQuery,
  UpdateExpenseInput,
} from "./expense.schema.js";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListExpensesQuery;
  const { items, total } = await listExpenses(query);
  sendSuccess(res, items, 200, buildPaginationMeta(query.page, query.pageSize, total));
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await getExpenseOrThrow(req.params.id as string));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const expense = await createExpense(req.body as CreateExpenseInput, req.user?.id);
  sendSuccess(res, expense, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const expense = await updateExpense(req.params.id as string, req.body as UpdateExpenseInput);
  sendSuccess(res, expense);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await deleteExpense(req.params.id as string);
  sendSuccess(res, { message: "Expense deleted" });
});
