import "dotenv/config";
import { z } from "zod";
import { parseDuration } from "../utils/duration.js";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // Comma-separated list of allowed frontend origins for CORS
  CLIENT_URL: z
    .string()
    .default("http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error(`Invalid environment configuration:\n${details}`);
  process.exit(1);
}

const clientOrigins = parsed.data.CLIENT_URL.split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

if (clientOrigins.length === 0) {
  console.error("Invalid environment configuration:\n  - CLIENT_URL: at least one origin is required");
  process.exit(1);
}

for (const origin of clientOrigins) {
  const result = z.url().safeParse(origin);
  if (!result.success) {
    console.error(`Invalid environment configuration:\n  - CLIENT_URL: invalid origin "${origin}"`);
    process.exit(1);
  }
}

export const env = {
  ...parsed.data,
  CLIENT_URL: clientOrigins[0]!,
  CLIENT_ORIGINS: clientOrigins,
};
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

export const accessTtlMs = parseDuration(env.JWT_ACCESS_EXPIRES_IN);
export const refreshTtlMs = parseDuration(env.JWT_REFRESH_EXPIRES_IN);
