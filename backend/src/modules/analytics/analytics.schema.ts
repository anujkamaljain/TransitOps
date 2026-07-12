import { z } from "zod";
import { VehicleStatus, VehicleType } from "../../generated/prisma/enums.js";

export const dashboardQuerySchema = z.object({
  type: z.enum(VehicleType).optional(),
  status: z.enum(VehicleStatus).optional(),
  region: z.string().trim().optional(),
});

export const vehicleCostParamSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle id is required"),
});

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
