import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendSuccess } from "../../utils/api-response.js";
import { toCsv } from "../../utils/csv.js";
import { getDashboardKpis } from "./dashboard.service.js";
import {
  getFleetReport,
  getVehicleOperationalCost,
} from "./reports.service.js";
import type { DashboardQuery } from "./analytics.schema.js";

const reportColumns = [
  { key: "registrationNumber", header: "Registration" },
  { key: "name", header: "Vehicle" },
  { key: "acquisitionCost", header: "Acquisition Cost" },
  { key: "revenue", header: "Revenue" },
  { key: "fuelCost", header: "Fuel Cost" },
  { key: "fuelLiters", header: "Fuel (L)" },
  { key: "maintenanceCost", header: "Maintenance Cost" },
  { key: "operationalCost", header: "Operational Cost" },
  { key: "distanceKm", header: "Distance (km)" },
  { key: "fuelEfficiencyKmPerL", header: "Fuel Efficiency (km/L)" },
  { key: "roi", header: "ROI" },
];

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as DashboardQuery;
  sendSuccess(res, await getDashboardKpis(query));
});

export const reports = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, await getFleetReport());
});

export const vehicleCost = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, await getVehicleOperationalCost(req.params.vehicleId));
});

export const exportReport = asyncHandler(async (_req: Request, res: Response) => {
  const report = await getFleetReport();
  const csv = toCsv(reportColumns, report.vehicles);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="transitops-fleet-report.csv"',
  );
  res.status(200).send(csv);
});
