import { z } from "zod"
import { VEHICLE_TYPES } from "@/types/domain"

export const vehicleFormSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(20, "Registration number is too long"),
  name: z.string().trim().min(1, "Vehicle name is required").max(100),
  type: z.enum(VEHICLE_TYPES),
  maxLoadCapacityKg: z.coerce
    .number({ message: "Enter a valid capacity" })
    .positive("Capacity must be greater than 0"),
  odometer: z.coerce
    .number({ message: "Enter a valid odometer reading" })
    .int("Odometer must be a whole number")
    .nonnegative("Odometer cannot be negative"),
  acquisitionCost: z.coerce
    .number({ message: "Enter a valid cost" })
    .nonnegative("Acquisition cost cannot be negative"),
  region: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500).optional(),
})

export type VehicleFormInput = z.input<typeof vehicleFormSchema>
export type VehicleFormValues = z.output<typeof vehicleFormSchema>
