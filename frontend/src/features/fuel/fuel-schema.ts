import { z } from "zod"
import { FUEL_TYPES } from "@/types/domain"

const optionalInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().nonnegative("Cannot be negative").optional(),
)

export const fuelFormSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  liters: z.coerce
    .number({ message: "Enter valid liters" })
    .positive("Liters must be greater than 0"),
  cost: z.coerce.number({ message: "Enter a valid cost" }).nonnegative("Cost cannot be negative"),
  fuelType: z.enum(FUEL_TYPES).optional(),
  odometer: optionalInt,
  filledAt: z.string().min(1, "Fill date is required"),
})

export type FuelFormInput = z.input<typeof fuelFormSchema>
export type FuelFormValues = z.output<typeof fuelFormSchema>
