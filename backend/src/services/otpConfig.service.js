import mongoose from "mongoose";
import { OtpConfig } from "../models/OtpConfig.js";
import { OtpChallenge } from "../models/OtpChallenge.js";
import { AppError } from "../utils/AppError.js";
import { generatePublicId } from "../utils/crypto.js";
import { getProjectForOwner } from "./project.service.js";

async function uniquePublicId() {
  let id = generatePublicId(8);
  while (await OtpConfig.exists({ publicId: id })) {
    id = generatePublicId(8);
  }
  return id;
}

export async function createOtpConfig(projectId, ownerId, input) {
  const project = await getProjectForOwner(projectId, ownerId);
  const publicId = await uniquePublicId();
  const config = await OtpConfig.create({
    project: project._id,
    owner: ownerId,
    publicId,
    name: input.name.trim(),
    emailEnabled: input.emailEnabled !== false,
    smsEnabled: Boolean(input.smsEnabled),
    allowedOrigins: [],
  });
  return config.toSafeObject();
}

export async function listOtpConfigs(projectId, ownerId) {
  const project = await getProjectForOwner(projectId, ownerId);
  const configs = await OtpConfig.find({
    project: project._id,
    owner: ownerId,
  }).sort({ createdAt: -1 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stats = await OtpChallenge.aggregate([
    {
      $match: {
        project: project._id,
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: "$otpConfig",
        sent24h: { $sum: 1 },
      },
    },
  ]);
  const sentByConfig = new Map(
    stats.map((row) => [row._id.toString(), row.sent24h]),
  );

  return configs.map((c) =>
    c.toSafeObject({ sent24h: sentByConfig.get(c._id.toString()) || 0 }),
  );
}

export async function getOtpConfigForOwner(otpId, ownerId) {
  let config = await OtpConfig.findOne({ publicId: otpId, owner: ownerId });
  if (!config && mongoose.isValidObjectId(otpId)) {
    config = await OtpConfig.findOne({ _id: otpId, owner: ownerId });
  }
  if (!config) {
    throw new AppError("OTP config not found", 404);
  }
  return config;
}

export async function getOtpConfigWithStats(otpId, ownerId) {
  const config = await getOtpConfigForOwner(otpId, ownerId);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sent24h = await OtpChallenge.countDocuments({
    otpConfig: config._id,
    createdAt: { $gte: since },
  });
  return config.toSafeObject({ sent24h });
}

export async function updateOtpConfig(otpId, ownerId, input) {
  const config = await getOtpConfigForOwner(otpId, ownerId);

  if (input.name !== undefined) config.name = input.name;
  if (input.allowedOrigins !== undefined) {
    config.allowedOrigins = input.allowedOrigins.map((o) => o.trim());
  }
  if (input.emailEnabled !== undefined) config.emailEnabled = input.emailEnabled;
  if (input.smsEnabled !== undefined) config.smsEnabled = input.smsEnabled;
  if (input.codeLength !== undefined) config.codeLength = input.codeLength;
  if (input.expirySeconds !== undefined) {
    config.expirySeconds = input.expirySeconds;
  }
  if (input.maxAttempts !== undefined) config.maxAttempts = input.maxAttempts;
  if (input.emailSubject !== undefined) {
    config.emailSubject = String(input.emailSubject || "").trim();
  }
  if (input.emailTemplate !== undefined) {
    config.emailTemplate = String(input.emailTemplate || "").trim();
  }
  if (input.smsSender !== undefined) {
    config.smsSender = String(input.smsSender || "").trim();
  }
  if (input.smsTemplate !== undefined) {
    config.smsTemplate = String(input.smsTemplate || "").trim();
  }
  if (input.isActive !== undefined) config.isActive = input.isActive;

  if (config.emailTemplate && !config.emailTemplate.includes("{{code}}")) {
    throw new AppError("Email template must include {{code}}", 400);
  }
  if (config.smsTemplate && !config.smsTemplate.includes("{{code}}")) {
    throw new AppError("SMS template must include {{code}}", 400);
  }

  await config.save();
  return config.toSafeObject();
}

export async function deleteOtpConfig(otpId, ownerId) {
  const config = await getOtpConfigForOwner(otpId, ownerId);
  await OtpChallenge.deleteMany({ otpConfig: config._id });
  await config.deleteOne();
  return { deleted: true };
}

export async function getPublicOtpConfig(publicId) {
  const config = await OtpConfig.findOne({ publicId }).populate("project");
  if (!config || !config.isActive) {
    throw new AppError("OTP config not found", 404);
  }
  if (config.project?.status === "Paused") {
    throw new AppError("This OTP endpoint is currently unavailable", 403);
  }
  return config;
}

export async function getProjectOtpStats(projectId, ownerId) {
  const project = await getProjectForOwner(projectId, ownerId);
  const configs = await OtpConfig.find({
    project: project._id,
    owner: ownerId,
  });
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sent24h = await OtpChallenge.countDocuments({
    project: project._id,
    createdAt: { $gte: since },
  });

  return {
    total: configs.length,
    emailEnabled: configs.some((c) => c.emailEnabled),
    smsEnabled: configs.some((c) => c.smsEnabled),
    sent24h,
  };
}
