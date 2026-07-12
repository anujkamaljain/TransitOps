import { z } from "zod";
import { VehicleStatus, VehicleType } from "../../generated/prisma/enums.js";

export const createVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(20, "Registration number is too long")
    .transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1, "Vehicle name is required").max(100),
  type: z.enum(VehicleType),
  maxLoadCapacityKg: z.coerce.number().positive("Capacity must be greater than 0"),
  odometer: z.coerce.number().int().nonnegative().default(0),
  acquisitionCost: z.coerce.number().nonnegative("Acquisition cost cannot be negative"),
  region: z.string().trim().min(1).max(60).optional(),
  acquiredAt: z.coerce.date().optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateVehicleSchema = z
  .object({
    registrationNumber: z
      .string()
      .trim()
      .min(1)
      .max(20)
      .transform((value) => value.toUpperCase())
      .optional(),
    name: z.string().trim().min(1).max(100).optional(),
    type: z.enum(VehicleType).optional(),
    maxLoadCapacityKg: z.coerce.number().positive().optional(),
    odometer: z.coerce.number().int().nonnegative().optional(),
    acquisitionCost: z.coerce.number().nonnegative().optional(),
    region: z.string().trim().min(1).max(60).optional(),
    acquiredAt: z.coerce.date().optional(),
    notes: z.string().trim().max(500).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const updateVehicleStatusSchema = z.object({
  status: z.enum([VehicleStatus.AVAILABLE, VehicleStatus.RETIRED]),
});

export const listVehiclesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(VehicleType).optional(),
  status: z.enum(VehicleStatus).optional(),
  region: z.string().trim().optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "registrationNumber", "name", "odometer", "acquisitionCost"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const vehicleIdParamSchema = z.object({
  id: z.string().min(1, "Vehicle id is required"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type UpdateVehicleStatusInput = z.infer<typeof updateVehicleStatusSchema>;
export type ListVehiclesQuery = z.infer<typeof listVehiclesQuerySchema>;
