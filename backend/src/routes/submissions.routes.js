import { Router } from "express";
import * as submissionsController from "../controllers/submissions.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);
router.get("/:submissionId", submissionsController.getSubmission);

export default router;
