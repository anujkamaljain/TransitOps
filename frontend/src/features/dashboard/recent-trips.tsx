import { Route } from "lucide-react"
import { EmptyState } from "@/components/states/empty-state"
import { ErrorState } from "@/components/states/error-state"
import { TableSkeleton } from "@/components/states/table-skeleton"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TRIP_STATUS_LABELS, TRIP_STATUS_TONES } from "@/config/labels"
import { relativeTime } from "@/lib/format"
import { useRecentTrips } from "@/features/dashboard/use-dashboard"

export function RecentTrips({ enabled }: { enabled: boolean }) {
  const { data, isLoading, isError, refetch } = useRecentTrips(enabled)

  return (
    <Card className="animate-rise">
      <CardHeader>
        <CardTitle className="text-base">Recent Trips</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {!enabled ? (
          <EmptyState
            icon={Route}
            title="Trips are out of your scope"
            description="Your role does not include trip visibility."
          />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={5} rows={5} />
              ) : data && data.length > 0 ? (
                data.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <p className="font-medium">{trip.tripCode}</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.source} → {trip.destination}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {trip.vehicle?.registrationNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {trip.driver?.fullName ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        tone={TRIP_STATUS_TONES[trip.status]}
                        label={TRIP_STATUS_LABELS[trip.status]}
                      />
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {relativeTime(trip.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <EmptyState
                      icon={Route}
                      title="No trips yet"
                      description="Dispatched trips will appear here."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
