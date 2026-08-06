import * as formService from "../services/form.service.js";
import * as publicFormService from "../services/publicForm.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createForm = asyncHandler(async (req, res) => {
  const form = await formService.createForm(
    req.params.projectId,
    req.userId,
    req.body,
  );
  return ApiResponse.success(res, {
    statusCode: 201,
    message: "Form created",
    data: { form },
  });
});

export const listForms = asyncHandler(async (req, res) => {
  const forms = await formService.listForms(req.params.projectId, req.userId);
  return ApiResponse.success(res, { data: { forms } });
});

export const getForm = asyncHandler(async (req, res) => {
  const form = await formService.getFormForOwner(req.params.formId, req.userId);
  return ApiResponse.success(res, { data: { form: form.toSafeObject() } });
});

export const updateForm = asyncHandler(async (req, res) => {
  const form = await formService.updateForm(
    req.params.formId,
    req.userId,
    req.body,
  );
  return ApiResponse.success(res, {
    message: "Form updated",
    data: { form },
  });
});

export const deleteForm = asyncHandler(async (req, res) => {
  await formService.deleteForm(req.params.formId, req.userId);
  return ApiResponse.success(res, { message: "Form deleted" });
});

export const submitPublicForm = asyncHandler(async (req, res) => {
  const result = await publicFormService.processFormSubmission(
    req.params.formId,
    req,
  );

  if (result.redirect && !req.headers.accept?.includes("application/json")) {
    return res.redirect(303, result.redirect);
  }

  return ApiResponse.success(res, {
    message: result.spam ? "Submission received" : "Form submitted successfully",
    data: {
      id: result.submission.id,
      status: result.submission.status,
    },
  });
});
