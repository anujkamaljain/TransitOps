import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  cancelTrip,
  completeTrip,
  createTrip,
  deleteTrip,
  dispatchTrip,
  listTrips,
  updateTrip,
  type TripListParams,
} from "@/features/trips/trip.api"
import type {
  CompleteTripValues,
  TripFormValues,
} from "@/features/trips/trip-schema"

const TRIPS_KEY = ["trips"]

export function useTrips(params: TripListParams) {
  return useQuery({
    queryKey: [...TRIPS_KEY, params],
    queryFn: () => listTrips(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateTrips() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: TRIPS_KEY })
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    void queryClient.invalidateQueries({ queryKey: ["options"] })
  }
}

export function useCreateTrip() {
  const invalidate = useInvalidateTrips()
  return useMutation({
    mutationFn: (values: TripFormValues) => createTrip(values),
    onSuccess: () => {
      invalidate()
      toast.success("Trip created")
    },
  })
}

export function useUpdateTrip(id: string) {
  const invalidate = useInvalidateTrips()
  return useMutation({
    mutationFn: (values: TripFormValues) => updateTrip(id, values),
    onSuccess: () => {
      invalidate()
      toast.success("Trip updated")
    },
  })
}

export function useDispatchTrip() {
  const invalidate = useInvalidateTrips()
  return useMutation({
    mutationFn: (id: string) => dispatchTrip(id),
    onSuccess: () => {
      invalidate()
      toast.success("Trip dispatched")
    },
  })
}

export function useCompleteTrip(id: string) {
  const invalidate = useInvalidateTrips()
  return useMutation({
    mutationFn: (values: CompleteTripValues) => completeTrip(id, values),
    onSuccess: () => {
      invalidate()
      toast.success("Trip completed")
    },
  })
}

export function useCancelTrip() {
  const invalidate = useInvalidateTrips()
  return useMutation({
    mutationFn: (id: string) => cancelTrip(id),
    onSuccess: () => {
      invalidate()
      toast.success("Trip cancelled")
    },
  })
}

export function useDeleteTrip() {
  const invalidate = useInvalidateTrips()
  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => {
      invalidate()
      toast.success("Trip deleted")
    },
  })
}
