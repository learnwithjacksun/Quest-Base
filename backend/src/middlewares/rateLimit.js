import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { env } from "../config/env.js";

export const globalRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

export const formSubmitRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.formRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.ip || req.socket?.remoteAddress || "unknown");
    return `${ip}:${req.params.formId || "form"}`;
  },
  message: {
    success: false,
    message: "Form submission rate limit exceeded",
  },
});
