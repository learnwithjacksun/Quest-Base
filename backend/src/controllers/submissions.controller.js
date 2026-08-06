import * as submissionService from "../services/submission.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProjectSubmissions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const data = await submissionService.listProjectSubmissions(
    req.params.projectId,
    req.userId,
    { page, limit },
  );
  return ApiResponse.success(res, { data });
});

export const listFormSubmissions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const data = await submissionService.listFormSubmissions(
    req.params.formId,
    req.userId,
    { page, limit },
  );
  return ApiResponse.success(res, { data });
});

export const getSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.getSubmission(
    req.params.submissionId,
    req.userId,
  );
  return ApiResponse.success(res, { data: { submission } });
});
