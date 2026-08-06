import { hashToken } from "../utils/crypto.js";
import { ApiKey } from "../models/ApiKey.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Optional API key resolver. Sets req.apiKey and req.apiKeyProjectId when present.
 */
export const resolveApiKey = asyncHandler(async (req, res, next) => {
  const raw =
    req.headers["x-api-key"] ||
    (req.headers.authorization?.startsWith("Bearer qb_")
      ? req.headers.authorization.slice(7)
      : null);

  if (!raw) {
    return next();
  }

  const keyHash = hashToken(raw);
  const apiKey = await ApiKey.findOne({ keyHash, revokedAt: null });
  if (!apiKey) {
    throw new AppError("Invalid API key", 401, null, "INVALID_API_KEY");
  }

  apiKey.lastUsedAt = new Date();
  await apiKey.save();

  req.apiKey = apiKey;
  req.apiKeyProjectId = apiKey.project.toString();
  next();
});
