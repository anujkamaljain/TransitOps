import { useEffect } from "react"
import { getSocket } from "@/lib/api/socket"

export const REALTIME_EVENTS = [
  "trip:updated",
  "maintenance:updated",
  "license:expiring",
] as const

export type RealtimeEvent = (typeof REALTIME_EVENTS)[number]

export function useRealtime(
  onEvent: (event: RealtimeEvent, payload: unknown) => void,
): void {
  useEffect(() => {
    const socket = getSocket()
    const bindings = REALTIME_EVENTS.map((event) => {
      const handler = (payload: unknown) => onEvent(event, payload)
      socket.on(event, handler)
      return [event, handler] as const
    })
    return () => {
      bindings.forEach(([event, handler]) => socket.off(event, handler))
    }
  }, [onEvent])
}
