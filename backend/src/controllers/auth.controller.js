import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function requestMeta(req) {
  return {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  };
}

export const register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);
  return ApiResponse.success(res, {
    statusCode: 201,
    message: "Account created. Check your email for a verification code.",
    data,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.body);
  return ApiResponse.success(res, {
    message: "Email verified successfully",
    data: { user },
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  await authService.resendVerification(req.body.email);
  return ApiResponse.success(res, {
    message: "If an account exists, a new code has been sent",
    data: { sent: true },
  });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body, requestMeta(req), res);
  return ApiResponse.success(res, {
    message: "Logged in successfully",
    data,
  });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req, res);
  return ApiResponse.success(res, { message: "Logged out successfully" });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const data = await authService.refreshSession(req, res);
  return ApiResponse.success(res, {
    message: "Token refreshed",
    data,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return ApiResponse.success(res, {
    message: "If an account exists, a reset link has been sent",
    data: { sent: true },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  return ApiResponse.success(res, {
    message: "Password reset successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {
    data: { user: req.user.toSafeObject() },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.userId, req.body);
  return ApiResponse.success(res, {
    message: "Profile updated",
    data: { user },
  });
});
