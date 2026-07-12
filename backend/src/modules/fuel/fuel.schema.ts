import { z } from "zod";
import { FuelType } from "../../generated/prisma/enums.js";

export const createFuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().min(1).optional(),
  liters: z.coerce.number().positive("Liters must be greater than 0"),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
  fuelType: z.enum(FuelType).optional(),
  odometer: z.coerce.number().int().nonnegative().optional(),
  filledAt: z.coerce.date(),
});

export const updateFuelLogSchema = z
  .object({
    liters: z.coerce.number().positive().optional(),
    cost: z.coerce.number().nonnegative().optional(),
    fuelType: z.enum(FuelType).optional(),
    odometer: z.coerce.number().int().nonnegative().optional(),
    filledAt: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const listFuelLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  vehicleId: z.string().min(1).optional(),
  tripId: z.string().min(1).optional(),
  fuelType: z.enum(FuelType).optional(),
  sortBy: z.enum(["filledAt", "cost", "liters", "createdAt"]).default("filledAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const fuelLogIdParamSchema = z.object({
  id: z.string().min(1, "Fuel log id is required"),
});

export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type UpdateFuelLogInput = z.infer<typeof updateFuelLogSchema>;
export type ListFuelLogsQuery = z.infer<typeof listFuelLogsQuerySchema>;
