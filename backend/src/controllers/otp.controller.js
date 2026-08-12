import * as otpConfigService from "../services/otpConfig.service.js";
import * as publicOtpService from "../services/publicOtp.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOtpConfig = asyncHandler(async (req, res) => {
  const config = await otpConfigService.createOtpConfig(
    req.params.projectId,
    req.userId,
    req.body,
  );
  return ApiResponse.success(res, {
    statusCode: 201,
    message: "OTP config created",
    data: { otp: config },
  });
});

export const listOtpConfigs = asyncHandler(async (req, res) => {
  const otps = await otpConfigService.listOtpConfigs(
    req.params.projectId,
    req.userId,
  );
  const stats = await otpConfigService.getProjectOtpStats(
    req.params.projectId,
    req.userId,
  );
  return ApiResponse.success(res, { data: { otps, stats } });
});

export const getOtpConfig = asyncHandler(async (req, res) => {
  const otp = await otpConfigService.getOtpConfigWithStats(
    req.params.otpId,
    req.userId,
  );
  return ApiResponse.success(res, { data: { otp } });
});

export const updateOtpConfig = asyncHandler(async (req, res) => {
  const otp = await otpConfigService.updateOtpConfig(
    req.params.otpId,
    req.userId,
    req.body,
  );
  return ApiResponse.success(res, {
    message: "OTP config updated",
    data: { otp },
  });
});

export const deleteOtpConfig = asyncHandler(async (req, res) => {
  await otpConfigService.deleteOtpConfig(req.params.otpId, req.userId);
  return ApiResponse.success(res, { message: "OTP config deleted" });
});

export const sendPublicOtp = asyncHandler(async (req, res) => {
  const result = await publicOtpService.sendPublicOtp(req.params.otpId, req);
  return ApiResponse.success(res, {
    message: "OTP sent",
    data: result,
  });
});

export const verifyPublicOtp = asyncHandler(async (req, res) => {
  const result = await publicOtpService.verifyPublicOtp(req.params.otpId, req);
  return ApiResponse.success(res, {
    message: "OTP verified",
    data: result,
  });
});
