import * as apiKeyService from "../services/apiKey.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createApiKey = asyncHandler(async (req, res) => {
  const apiKey = await apiKeyService.createApiKey(
    req.params.projectId,
    req.userId,
    req.body,
  );
  return ApiResponse.success(res, {
    statusCode: 201,
    message: "API key created. Copy it now — it won't be shown again.",
    data: { apiKey },
  });
});

export const listApiKeys = asyncHandler(async (req, res) => {
  const apiKeys = await apiKeyService.listApiKeys(
    req.params.projectId,
    req.userId,
  );
  return ApiResponse.success(res, { data: { apiKeys } });
});

export const revokeApiKey = asyncHandler(async (req, res) => {
  const apiKey = await apiKeyService.revokeApiKey(
    req.params.projectId,
    req.params.keyId,
    req.userId,
  );
  return ApiResponse.success(res, {
    message: "API key revoked",
    data: { apiKey },
  });
});
