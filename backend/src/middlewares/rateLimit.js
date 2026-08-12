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

export const otpSendRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: (req) =>
    String(req.body?.channel || "").toLowerCase() === "sms"
      ? env.otpSmsRateLimitMax
      : env.otpRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.ip || req.socket?.remoteAddress || "unknown");
    const channel = String(req.body?.channel || "any").toLowerCase();
    return `${ip}:${req.params.otpId || "otp"}:${channel}`;
  },
  message: {
    success: false,
    message: "OTP send rate limit exceeded",
  },
});

export const otpVerifyRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.otpRateLimitMax * 2,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.ip || req.socket?.remoteAddress || "unknown");
    return `${ip}:${req.params.otpId || "otp"}:verify`;
  },
  message: {
    success: false,
    message: "OTP verify rate limit exceeded",
  },
});
