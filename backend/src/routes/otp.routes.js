import { Router } from "express";
import * as otpController from "../controllers/otp.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateOtpConfigSchema } from "../validators/otp.validator.js";

const router = Router();

router.use(authenticate);

router.get("/:otpId", otpController.getOtpConfig);
router.patch(
  "/:otpId",
  validate(updateOtpConfigSchema),
  otpController.updateOtpConfig,
);
router.delete("/:otpId", otpController.deleteOtpConfig);

export default router;
