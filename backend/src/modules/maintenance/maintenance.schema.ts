import { z } from "zod";
import { MaintenanceStatus } from "../../generated/prisma/enums.js";

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceType: z.string().trim().min(1, "Service type is required").max(100),
  description: z.string().trim().max(500).optional(),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
  serviceDate: z.coerce.date(),
  odometerAtService: z.coerce.number().int().nonnegative().optional(),
});

export const updateMaintenanceSchema = z
  .object({
    serviceType: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    cost: z.coerce.number().nonnegative().optional(),
    serviceDate: z.coerce.date().optional(),
    odometerAtService: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const listMaintenanceQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(MaintenanceStatus).optional(),
  vehicleId: z.string().min(1).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "serviceDate", "cost"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const maintenanceIdParamSchema = z.object({
  id: z.string().min(1, "Maintenance id is required"),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
export type ListMaintenanceQuery = z.infer<typeof listMaintenanceQuerySchema>;
