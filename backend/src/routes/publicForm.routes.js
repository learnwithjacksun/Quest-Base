import { Router } from "express";
import * as formsController from "../controllers/forms.controller.js";
import { resolveApiKey } from "../middlewares/apiKey.js";
import { formSubmitRateLimiter } from "../middlewares/rateLimit.js";
import { uploadFormFiles } from "../middlewares/upload.js";

const router = Router();

router.post(
  "/:formId",
  formSubmitRateLimiter,
  resolveApiKey,
  (req, res, next) => {
    uploadFormFiles(req, res, (err) => {
      if (err) return next(err);
      return next();
    });
  },
  formsController.submitPublicForm,
);

export default router;
