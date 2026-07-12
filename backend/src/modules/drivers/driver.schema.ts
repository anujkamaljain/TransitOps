import { z } from "zod";
import { DriverStatus, LicenseCategory } from "../../generated/prisma/enums.js";

const contactNumber = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid contact number");

export const createDriverSchema = z.object({
  fullName: z.string().trim().min(1, "Driver name is required").max(100),
  licenseNumber: z
    .string()
    .trim()
    .min(1, "License number is required")
    .max(30)
    .transform((value) => value.toUpperCase()),
  licenseCategory: z.enum(LicenseCategory),
  licenseExpiry: z.coerce.date(),
  contactNumber,
  email: z.email("Enter a valid email address").optional(),
  safetyScore: z.coerce.number().int().min(0).max(100).default(100),
  region: z.string().trim().min(1).max(60).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateDriverSchema = z
  .object({
    fullName: z.string().trim().min(1).max(100).optional(),
    licenseCategory: z.enum(LicenseCategory).optional(),
    licenseExpiry: z.coerce.date().optional(),
    contactNumber: contactNumber.optional(),
    email: z.email("Enter a valid email address").optional(),
    safetyScore: z.coerce.number().int().min(0).max(100).optional(),
    region: z.string().trim().min(1).max(60).optional(),
    notes: z.string().trim().max(500).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const updateDriverStatusSchema = z.object({
  status: z.enum([
    DriverStatus.AVAILABLE,
    DriverStatus.OFF_DUTY,
    DriverStatus.SUSPENDED,
  ]),
});

export const listDriversQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(DriverStatus).optional(),
  licenseCategory: z.enum(LicenseCategory).optional(),
  region: z.string().trim().optional(),
  search: z.string().trim().optional(),
  expiry: z.enum(["expired", "expiring", "valid"]).optional(),
  sortBy: z
    .enum(["createdAt", "fullName", "safetyScore", "licenseExpiry"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const driverIdParamSchema = z.object({
  id: z.string().min(1, "Driver id is required"),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type UpdateDriverStatusInput = z.infer<typeof updateDriverStatusSchema>;
export type ListDriversQuery = z.infer<typeof listDriversQuerySchema>;
