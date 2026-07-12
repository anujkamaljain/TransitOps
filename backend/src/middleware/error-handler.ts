import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/api-error.js";
import { logger } from "../lib/logger.js";
import { isProduction } from "../config/env.js";

interface ErrorBody {
  message: string;
  details?: unknown;
}

function fieldName(target: unknown): string | undefined {
  if (Array.isArray(target)) {
    return target.join(", ");
  }
  return typeof target === "string" ? target : undefined;
}

function mapKnownError(error: Prisma.PrismaClientKnownRequestError): {
  status: number;
  body: ErrorBody;
} {
  if (error.code === "P2002") {
    const field = fieldName(error.meta?.["target"]);
    return {
      status: 409,
      body: { message: field ? `${field} already exists` : "Duplicate value" },
    };
  }
  if (error.code === "P2025") {
    return { status: 404, body: { message: "Record not found" } };
  }
  if (error.code === "P2003") {
    return { status: 409, body: { message: "Related record constraint failed" } };
  }
  return { status: 400, body: { message: "Database request error" } };
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    res.status(422).json({
      success: false,
      error: { message: "Validation failed", details },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, body } = mapKnownError(err);
    res.status(status).json({ success: false, error: body });
    return;
  }

  const error = err instanceof Error ? err : new Error("Unknown error");
  logger.error(error.stack ?? error.message);
  res.status(500).json({
    success: false,
    error: {
      message: isProduction ? "Internal server error" : error.message,
    },
  });
};
