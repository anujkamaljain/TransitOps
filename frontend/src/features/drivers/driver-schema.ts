import { z } from "zod"
import { LICENSE_CATEGORIES } from "@/types/domain"

export const driverFormSchema = z.object({
  fullName: z.string().trim().min(1, "Driver name is required").max(100),
  licenseNumber: z.string().trim().min(1, "License number is required").max(30),
  licenseCategory: z.enum(LICENSE_CATEGORIES),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  contactNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid contact number"),
  email: z
    .union([z.literal(""), z.email("Enter a valid email address")])
    .optional(),
  safetyScore: z.coerce
    .number({ message: "Enter a valid score" })
    .int("Score must be a whole number")
    .min(0, "Score cannot be below 0")
    .max(100, "Score cannot exceed 100"),
  region: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500).optional(),
})

export type DriverFormInput = z.input<typeof driverFormSchema>
export type DriverFormValues = z.output<typeof driverFormSchema>
