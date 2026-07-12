import { Router } from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { vehicleRouter } from "./modules/vehicles/vehicle.routes.js";
import { driverRouter } from "./modules/drivers/driver.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/vehicles", vehicleRouter);
apiRouter.use("/drivers", driverRouter);
