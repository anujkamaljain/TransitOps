import { Router } from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes.js";
import { driverRouter } from "./modules/drivers/driver.routes.js";
import { tripRouter } from "./modules/trips/trip.routes.js";
import { maintenanceRouter } from "./modules/maintenance/maintenance.routes.js";
import { fuelRouter } from "./modules/fuel/fuel.routes.js";
import { expenseRouter } from "./modules/expenses/expense.routes.js";
import { analyticsRouter } from "./modules/analytics/analytics.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/vehicles", vehicleRouter);
apiRouter.use("/drivers", driverRouter);
apiRouter.use("/trips", tripRouter);
apiRouter.use("/maintenance", maintenanceRouter);
apiRouter.use("/fuel-logs", fuelRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/analytics", analyticsRouter);
