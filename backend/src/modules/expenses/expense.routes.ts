import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { requirePermission } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { create, getOne, list, remove, update } from "./expense.controller.js";
import {
  createExpenseSchema,
  expenseIdParamSchema,
  listExpensesQuerySchema,
  updateExpenseSchema,
} from "./expense.schema.js";

export const expenseRouter = Router();

expenseRouter.use(authenticate);

expenseRouter.get(
  "/",
  requirePermission("fuelExpenses", "view"),
  validate({ query: listExpensesQuerySchema }),
  list,
);
expenseRouter.post(
  "/",
  requirePermission("fuelExpenses", "manage"),
  validate({ body: createExpenseSchema }),
  create,
);
expenseRouter.get(
  "/:id",
  requirePermission("fuelExpenses", "view"),
  validate({ params: expenseIdParamSchema }),
  getOne,
);
expenseRouter.patch(
  "/:id",
  requirePermission("fuelExpenses", "manage"),
  validate({ params: expenseIdParamSchema, body: updateExpenseSchema }),
  update,
);
expenseRouter.delete(
  "/:id",
  requirePermission("fuelExpenses", "manage"),
  validate({ params: expenseIdParamSchema }),
  remove,
);
