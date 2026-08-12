import { Router } from "express";
import * as otpController from "../controllers/otp.controller.js";
import { resolveApiKey } from "../middlewares/apiKey.js";
import { otpSendRateLimiter, otpVerifyRateLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import {
  publicOtpSendSchema,
  publicOtpVerifySchema,
} from "../validators/otp.validator.js";

const router = Router();

router.post(
  "/:otpId/send",
  otpSendRateLimiter,
  resolveApiKey,
  validate(publicOtpSendSchema),
  otpController.sendPublicOtp,
);

router.post(
  "/:otpId/verify",
  otpVerifyRateLimiter,
  resolveApiKey,
  validate(publicOtpVerifySchema),
  otpController.verifyPublicOtp,
);

export default router;
