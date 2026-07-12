import { useQuery } from "@tanstack/react-query"
import { getFleetReport } from "@/features/reports/reports.api"

export function useFleetReport() {
  return useQuery({
    queryKey: ["reports", "fleet"],
    queryFn: getFleetReport,
  })
}
