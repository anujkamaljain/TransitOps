import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import {
  assertMaintenanceExists,
  assertTripExists,
  assertVehicleExists,
} from "../../utils/entity-guards.js";
import type {
  CreateExpenseInput,
  ListExpensesQuery,
  UpdateExpenseInput,
} from "./expense.schema.js";

const expenseInclude = {
  vehicle: { select: { id: true, registrationNumber: true, name: true } },
} satisfies Prisma.ExpenseInclude;

export async function getExpenseOrThrow(id: string) {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: expenseInclude,
  });
  if (!expense) {
    throw ApiError.notFound("Expense not found");
  }
  return expense;
}

export async function listExpenses(query: ListExpensesQuery) {
  const { page, pageSize, type, vehicleId, tripId, sortBy, sortOrder } = query;

  const where: Prisma.ExpenseWhereInput = {
    ...(type ? { type } : {}),
    ...(vehicleId ? { vehicleId } : {}),
    ...(tripId ? { tripId } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      include: expenseInclude,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.expense.count({ where }),
  ]);

  return { items, total };
}

export async function createExpense(input: CreateExpenseInput, userId?: string) {
  if (input.vehicleId) {
    await assertVehicleExists(input.vehicleId);
  }
  if (input.tripId) {
    await assertTripExists(input.tripId);
  }
  if (input.maintenanceLogId) {
    await assertMaintenanceExists(input.maintenanceLogId);
  }
  return prisma.expense.create({
    data: { ...input, loggedById: userId ?? null },
    include: expenseInclude,
  });
}

export async function updateExpense(id: string, input: UpdateExpenseInput) {
  await getExpenseOrThrow(id);
  return prisma.expense.update({ where: { id }, data: input, include: expenseInclude });
}

export async function deleteExpense(id: string) {
  await getExpenseOrThrow(id);
  await prisma.expense.delete({ where: { id } });
}
