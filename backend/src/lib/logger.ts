import { createLogger, format, transports } from "winston";
import { env, isProduction } from "../config/env.js";

const devFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack ?? message}`;
  }),
);

export const logger = createLogger({
  level: isProduction ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    isProduction ? format.json() : devFormat,
  ),
  defaultMeta: { service: "transitops-api", env: env.NODE_ENV },
  transports: [new transports.Console()],
});
