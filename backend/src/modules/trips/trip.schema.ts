import { z } from "zod";
import { TripStatus } from "../../generated/prisma/enums.js";

export const createTripSchema = z.object({
  source: z.string().trim().min(1, "Source is required").max(120),
  destination: z.string().trim().min(1, "Destination is required").max(120),
  cargoWeightKg: z.coerce.number().positive("Cargo weight must be greater than 0"),
  plannedDistanceKm: z.coerce
    .number()
    .positive("Planned distance must be greater than 0"),
  vehicleId: z.string().min(1).optional(),
  driverId: z.string().min(1).optional(),
  revenue: z.coerce.number().nonnegative("Revenue cannot be negative").optional(),
  etaMinutes: z.coerce.number().int().positive().optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateTripSchema = z
  .object({
    source: z.string().trim().min(1).max(120).optional(),
    destination: z.string().trim().min(1).max(120).optional(),
    cargoWeightKg: z.coerce.number().positive().optional(),
    plannedDistanceKm: z.coerce.number().positive().optional(),
    vehicleId: z.string().min(1).nullable().optional(),
    driverId: z.string().min(1).nullable().optional(),
    revenue: z.coerce.number().nonnegative().optional(),
    etaMinutes: z.coerce.number().int().positive().optional(),
    notes: z.string().trim().max(500).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const completeTripSchema = z.object({
  endOdometer: z.coerce.number().int().nonnegative(),
  fuelConsumedL: z.coerce.number().positive().optional(),
  actualDistanceKm: z.coerce.number().positive().optional(),
  revenue: z.coerce.number().nonnegative().optional(),
});

export const listTripsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(TripStatus).optional(),
  vehicleId: z.string().min(1).optional(),
  driverId: z.string().min(1).optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(["createdAt", "tripCode", "dispatchedAt", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const tripIdParamSchema = z.object({
  id: z.string().min(1, "Trip id is required"),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
export type ListTripsQuery = z.infer<typeof listTripsQuerySchema>;
