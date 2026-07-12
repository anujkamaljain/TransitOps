import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  updateVehicle,
  updateVehicleStatus,
  type VehicleListParams,
} from "@/features/vehicles/vehicle.api"
import type { VehicleFormValues } from "@/features/vehicles/vehicle-schema"

const VEHICLES_KEY = ["vehicles"]

export function useVehicles(params: VehicleListParams) {
  return useQuery({
    queryKey: [...VEHICLES_KEY, params],
    queryFn: () => listVehicles(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateVehicles() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: VEHICLES_KEY })
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  }
}

export function useCreateVehicle() {
  const invalidate = useInvalidateVehicles()
  return useMutation({
    mutationFn: (payload: VehicleFormValues) => createVehicle(payload),
    onSuccess: () => {
      invalidate()
      toast.success("Vehicle added to the registry")
    },
  })
}

export function useUpdateVehicle(id: string) {
  const invalidate = useInvalidateVehicles()
  return useMutation({
    mutationFn: (payload: VehicleFormValues) => updateVehicle(id, payload),
    onSuccess: () => {
      invalidate()
      toast.success("Vehicle updated")
    },
  })
}

export function useVehicleStatus() {
  const invalidate = useInvalidateVehicles()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "AVAILABLE" | "RETIRED" }) =>
      updateVehicleStatus(id, status),
    onSuccess: () => {
      invalidate()
      toast.success("Vehicle status updated")
    },
  })
}

export function useDeleteVehicle() {
  const invalidate = useInvalidateVehicles()
  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      invalidate()
      toast.success("Vehicle deleted")
    },
  })
}
