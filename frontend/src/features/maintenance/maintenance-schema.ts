import { z } from "zod"

const optionalInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().nonnegative("Cannot be negative").optional(),
)

export const maintenanceFormSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceType: z.string().trim().min(1, "Service type is required").max(100),
  description: z.string().trim().max(500).optional(),
  cost: z.coerce
    .number({ message: "Enter a valid cost" })
    .nonnegative("Cost cannot be negative"),
  serviceDate: z.string().min(1, "Service date is required"),
  odometerAtService: optionalInt,
})

export type MaintenanceFormInput = z.input<typeof maintenanceFormSchema>
export type MaintenanceFormValues = z.output<typeof maintenanceFormSchema>
