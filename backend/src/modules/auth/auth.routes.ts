import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authLimiter } from "../../middleware/rate-limit.js";
import { validate } from "../../middleware/validate.js";
import { login, logout, me, refresh } from "./auth.controller.js";
import { loginSchema } from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/login", authLimiter, validate({ body: loginSchema }), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);
