import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createDriver,
  deleteDriver,
  listDrivers,
  updateDriver,
  updateDriverStatus,
  type DriverListParams,
  type ManageableDriverStatus,
} from "@/features/drivers/driver.api"
import type { DriverFormValues } from "@/features/drivers/driver-schema"

const DRIVERS_KEY = ["drivers"]

export function useDrivers(params: DriverListParams) {
  return useQuery({
    queryKey: [...DRIVERS_KEY, params],
    queryFn: () => listDrivers(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateDrivers() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: DRIVERS_KEY })
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  }
}

export function useCreateDriver() {
  const invalidate = useInvalidateDrivers()
  return useMutation({
    mutationFn: (values: DriverFormValues) => createDriver(values),
    onSuccess: () => {
      invalidate()
      toast.success("Driver added")
    },
  })
}

export function useUpdateDriver(id: string) {
  const invalidate = useInvalidateDrivers()
  return useMutation({
    mutationFn: (values: DriverFormValues) => updateDriver(id, values),
    onSuccess: () => {
      invalidate()
      toast.success("Driver updated")
    },
  })
}

export function useDriverStatus() {
  const invalidate = useInvalidateDrivers()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ManageableDriverStatus }) =>
      updateDriverStatus(id, status),
    onSuccess: () => {
      invalidate()
      toast.success("Driver status updated")
    },
  })
}

export function useDeleteDriver() {
  const invalidate = useInvalidateDrivers()
  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => {
      invalidate()
      toast.success("Driver deleted")
    },
  })
}
