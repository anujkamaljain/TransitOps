import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/api-error.js";

const fifteenMinutes = 15 * 60 * 1000;

export const generalLimiter = rateLimit({
  windowMs: fifteenMinutes,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests());
  },
});

export const authLimiter = rateLimit({
  windowMs: fifteenMinutes,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests("Too many authentication attempts, try again later"));
  },
});
