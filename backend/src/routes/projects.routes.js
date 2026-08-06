import { Router } from "express";
import * as projectsController from "../controllers/projects.controller.js";
import * as formsController from "../controllers/forms.controller.js";
import * as apiKeysController from "../controllers/apiKeys.controller.js";
import * as submissionsController from "../controllers/submissions.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator.js";
import {
  createFormSchema,
  updateFormSchema,
} from "../validators/form.validator.js";
import { createApiKeySchema } from "../validators/apiKey.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", projectsController.listProjects);
router.post("/", validate(createProjectSchema), projectsController.createProject);
router.get("/:projectId", projectsController.getProject);
router.patch(
  "/:projectId",
  validate(updateProjectSchema),
  projectsController.updateProject,
);
router.delete("/:projectId", projectsController.deleteProject);

router.get("/:projectId/forms", formsController.listForms);
router.post(
  "/:projectId/forms",
  validate(createFormSchema),
  formsController.createForm,
);

router.get("/:projectId/api-keys", apiKeysController.listApiKeys);
router.post(
  "/:projectId/api-keys",
  validate(createApiKeySchema),
  apiKeysController.createApiKey,
);
router.delete(
  "/:projectId/api-keys/:keyId",
  apiKeysController.revokeApiKey,
);

router.get(
  "/:projectId/submissions",
  submissionsController.listProjectSubmissions,
);

export default router;
