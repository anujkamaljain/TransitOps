import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Download, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { ErrorState } from "@/components/states/error-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRealtime } from "@/hooks/use-realtime"
import { notifyError } from "@/lib/api/mutation-error"
import { downloadReportCsv } from "@/features/reports/reports.api"
import { FleetReportTable } from "@/features/reports/fleet-report-table"
import { MonthlyRevenueChart } from "@/features/reports/monthly-revenue-chart"
import { ReportKpis } from "@/features/reports/report-kpis"
import { TopCostliestChart } from "@/features/reports/top-costliest-chart"
import { useFleetReport } from "@/features/reports/use-reports"

export function ReportsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useFleetReport()
  const [exporting, setExporting] = useState(false)

  const onRealtime = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["reports"] })
  }, [queryClient])
  useRealtime(onRealtime)

  async function handleExport() {
    setExporting(true)
    try {
      await downloadReportCsv()
    } catch (error) {
      notifyError(error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Fleet performance, costs, and return on investment."
        actions={
          <Button variant="outline" onClick={handleExport} disabled={exporting || !data}>
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Export CSV
          </Button>
        }
      />

      {isError ? (
        <ErrorState title="Unable to load reports" onRetry={() => refetch()} />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <ReportKpis summary={data.summary} />
          <div className="grid gap-4 lg:grid-cols-2">
            <MonthlyRevenueChart data={data.monthlyRevenue} />
            <TopCostliestChart data={data.topCostliest} />
          </div>
          <FleetReportTable rows={data.vehicles} />
        </>
      )}
    </div>
  )
}
