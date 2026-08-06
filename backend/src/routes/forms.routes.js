import { Router } from "express";
import * as formsController from "../controllers/forms.controller.js";
import * as submissionsController from "../controllers/submissions.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateFormSchema } from "../validators/form.validator.js";

const router = Router();

router.use(authenticate);

router.get("/:formId", formsController.getForm);
router.patch(
  "/:formId",
  validate(updateFormSchema),
  formsController.updateForm,
);
router.delete("/:formId", formsController.deleteForm);
router.get("/:formId/submissions", submissionsController.listFormSubmissions);

export default router;
