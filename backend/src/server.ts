import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";
import { startLicenseReminders } from "./realtime/license-reminder.js";
import { initRealtime, shutdownRealtime } from "./realtime/socket.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`TransitOps API listening on port ${env.PORT}`);
});

initRealtime(server);
const reminderTimer = startLicenseReminders();

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}, shutting down gracefully`);

  clearInterval(reminderTimer);
  shutdownRealtime();

  server.close(() => {
    void prisma.$disconnect().finally(() => {
      process.exit(0);
    });
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled rejection: ${String(reason)}`);
});
