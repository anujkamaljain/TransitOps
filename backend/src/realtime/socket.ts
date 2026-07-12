import type { Server as HttpServer } from "node:http";
import { Server, type Socket } from "socket.io";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { ACCESS_COOKIE } from "../modules/auth/auth.cookies.js";
import { verifyAccessToken } from "../modules/auth/token.service.js";
import { AppEvent, appEvents } from "./event-bus.js";

const OPS_ROOM = "ops";

function extractToken(socket: Socket): string | undefined {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.length > 0) {
    return authToken;
  }
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return undefined;
  }
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ACCESS_COOKIE}=`));
  return match?.slice(ACCESS_COOKIE.length + 1);
}

let io: Server | undefined;

export function initRealtime(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = extractToken(socket);
      if (!token) {
        next(new Error("Unauthorized"));
        return;
      }
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    void socket.join(OPS_ROOM);
    logger.debug(`Realtime client connected: ${socket.id}`);
  });

  for (const event of Object.values(AppEvent)) {
    appEvents.on(event, (payload) => io?.to(OPS_ROOM).emit(event, payload));
  }

  return io;
}

export function shutdownRealtime(): void {
  io?.close();
  io = undefined;
}
