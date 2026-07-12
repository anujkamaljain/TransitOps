import { z } from "zod"

const optionalNonNegative = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().nonnegative("Cannot be negative").optional(),
)

const optionalPositiveInt = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().positive("Must be greater than 0").optional(),
)

const optionalPositive = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().positive("Must be greater than 0").optional(),
)

export const tripFormSchema = z.object({
  source: z.string().trim().min(1, "Source is required").max(120),
  destination: z.string().trim().min(1, "Destination is required").max(120),
  cargoWeightKg: z.coerce
    .number({ message: "Enter a valid weight" })
    .positive("Cargo weight must be greater than 0"),
  plannedDistanceKm: z.coerce
    .number({ message: "Enter a valid distance" })
    .positive("Planned distance must be greater than 0"),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  revenue: optionalNonNegative,
  etaMinutes: optionalPositiveInt,
  notes: z.string().trim().max(500).optional(),
})

export const completeTripSchema = z.object({
  endOdometer: z.coerce
    .number({ message: "Enter a valid odometer reading" })
    .int("Odometer must be a whole number")
    .nonnegative("Odometer cannot be negative"),
  fuelConsumedL: optionalPositive,
  actualDistanceKm: optionalPositive,
  revenue: optionalNonNegative,
})

export type TripFormInput = z.input<typeof tripFormSchema>
export type TripFormValues = z.output<typeof tripFormSchema>
export type CompleteTripInput = z.input<typeof completeTripSchema>
export type CompleteTripValues = z.output<typeof completeTripSchema>
