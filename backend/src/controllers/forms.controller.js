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

  const accept = req.headers.accept || "";
  const contentType = req.headers["content-type"] || "";
  const explicitlyWantsJson =
    accept.includes("application/json") ||
    contentType.includes("application/json") ||
    req.headers["x-requested-with"] === "XMLHttpRequest";

  // Classic browser form navigation (urlencoded / multipart, no JSON Accept)
  const isHtmlFormNavigation =
    !explicitlyWantsJson &&
    (contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data"));

  // XHR / fetch / SDK: JSON only — clients redirect themselves if needed
  if (!isHtmlFormNavigation) {
    return ApiResponse.success(res, {
      message: result.spam
        ? "Submission received"
        : "Form submitted successfully",
      data: {
        id: result.submission.id,
        status: result.submission.status,
        redirect: result.redirect || null,
      },
    });
  }

  // Classic HTML form POST: browser navigated to the API — send them away
  // Prefer thank-you URL; otherwise bounce back to the referring page
  if (result.redirect) {
    return res.redirect(303, result.redirect);
  }

  // Last resort: tiny success page with a back link (no thank-you, no referer)
  res
    .status(200)
    .type("html")
    .send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Submission received</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;color:#222}
a{color:#006239}</style></head>
<body>
  <h1>Thanks — your form was submitted.</h1>
  <p><a href="javascript:history.back()">Go back</a></p>
</body>
</html>`);
});
