import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createFuelLog,
  deleteFuelLog,
  listFuelLogs,
  updateFuelLog,
  type FuelListParams,
} from "@/features/fuel/fuel.api"
import type { FuelFormValues } from "@/features/fuel/fuel-schema"

const KEY = ["fuel-logs"]

export function useFuelLogs(params: FuelListParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => listFuelLogs(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: KEY })
    void queryClient.invalidateQueries({ queryKey: ["reports"] })
  }
}

export function useCreateFuelLog() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (values: FuelFormValues) => createFuelLog(values),
    onSuccess: () => {
      invalidate()
      toast.success("Fuel log added")
    },
  })
}

export function useUpdateFuelLog(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (values: FuelFormValues) => updateFuelLog(id, values),
    onSuccess: () => {
      invalidate()
      toast.success("Fuel log updated")
    },
  })
}

export function useDeleteFuelLog() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => deleteFuelLog(id),
    onSuccess: () => {
      invalidate()
      toast.success("Fuel log deleted")
    },
  })
}
