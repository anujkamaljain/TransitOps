import { EventEmitter } from "node:events";

export const AppEvent = {
  TripUpdated: "trip:updated",
  MaintenanceUpdated: "maintenance:updated",
  LicenseExpiring: "license:expiring",
} as const;

export type AppEventName = (typeof AppEvent)[keyof typeof AppEvent];

export const appEvents = new EventEmitter();

export function publish(event: AppEventName, payload: unknown): void {
  appEvents.emit(event, payload);
}
