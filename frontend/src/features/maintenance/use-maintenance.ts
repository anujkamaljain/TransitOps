import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  closeMaintenance,
  createMaintenance,
  deleteMaintenance,
  listMaintenance,
  updateMaintenance,
  type MaintenanceListParams,
} from "@/features/maintenance/maintenance.api"
import type { MaintenanceFormValues } from "@/features/maintenance/maintenance-schema"

const KEY = ["maintenance"]

export function useMaintenanceList(params: MaintenanceListParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => listMaintenance(params),
    placeholderData: keepPreviousData,
  })
}

function useInvalidate() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: KEY })
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    void queryClient.invalidateQueries({ queryKey: ["options"] })
  }
}

export function useCreateMaintenance() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (values: MaintenanceFormValues) => createMaintenance(values),
    onSuccess: () => {
      invalidate()
      toast.success("Maintenance logged")
    },
  })
}

export function useUpdateMaintenance(id: string) {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (values: MaintenanceFormValues) => updateMaintenance(id, values),
    onSuccess: () => {
      invalidate()
      toast.success("Maintenance updated")
    },
  })
}

export function useCloseMaintenance() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => closeMaintenance(id),
    onSuccess: () => {
      invalidate()
      toast.success("Maintenance closed")
    },
  })
}

export function useDeleteMaintenance() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => deleteMaintenance(id),
    onSuccess: () => {
      invalidate()
      toast.success("Maintenance record deleted")
    },
  })
}
