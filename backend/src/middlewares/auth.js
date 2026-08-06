import { verifyAccessToken } from "../utils/tokens.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401, null, "UNAUTHORIZED");
  }

  const token = header.slice(7);
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new AppError("Invalid or expired access token", 401, null, "UNAUTHORIZED");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError("User not found", 401, null, "UNAUTHORIZED");
  }

  req.user = user;
  req.userId = user._id.toString();
  next();
});
