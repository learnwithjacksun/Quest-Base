import { env } from "../config/env.js";
import { sendSms } from "../config/brevo.js";
import { OtpChallenge } from "../models/OtpChallenge.js";
import { AppError } from "../utils/AppError.js";
import {
  generateOtpCode,
  hashToken,
  timingSafeEqualHash,
} from "../utils/crypto.js";
import { sendOtpEmail } from "./mail.service.js";
import { getPublicOtpConfig } from "./otpConfig.service.js";
import { validateFormOrigin } from "./publicForm.service.js";

const EMAIL_SEND_WINDOW_MS = 15 * 60 * 1000;
const SMS_SEND_WINDOW_MS = 15 * 60 * 1000;
const EMAIL_SEND_MAX = 5;
const SMS_SEND_MAX = 3;

function normalizeOrigin(origin) {
  if (!origin) return null;
  const trimmed = String(origin).trim();
  if (!trimmed) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    return url.origin.toLowerCase();
  } catch {
    return trimmed.replace(/\/+$/, "").toLowerCase();
  }
}

/**
 * Auth rule for public OTP (same hybrid model as forms):
 * - Valid project API key → allowed
 * - Browser Origin/Referer matching allowedOrigins → allowed
 * - Server-to-server without key → rejected
 */
export function assertOtpAuthorized(config, req) {
  const origin = req.headers.origin || req.headers.referer;
  const projectId =
    config.project?._id?.toString?.() || config.project?.toString?.();
  const hasApiKey = req.apiKey && req.apiKeyProjectId === projectId;

  if (hasApiKey) {
    return { via: "apiKey", origin: origin || null };
  }

  if (!req.headers.origin && !req.headers.referer) {
    throw new AppError(
      "API key required for server-to-server OTP requests",
      401,
      null,
      "API_KEY_REQUIRED",
    );
  }

  if (!validateFormOrigin(config, origin)) {
    throw new AppError(
      "Origin not allowed for this OTP endpoint",
      403,
      null,
      "ORIGIN_DENIED",
    );
  }

  return { via: "origin", origin: normalizeOrigin(origin) || origin || null };
}

export function normalizeEmail(value) {
  const email = String(value || "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Enter a valid email address", 400, null, "INVALID_TO");
  }
  return email;
}

/**
 * Normalize phone to E.164-ish (+digits).
 * Brevo expects 6–15 digits, optionally prefixed with +.
 */
export function normalizePhone(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    throw new AppError("Enter a valid phone number", 400, null, "INVALID_TO");
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length < 6 || digits.length > 15) {
    throw new AppError(
      "Phone must include country code (6–15 digits)",
      400,
      null,
      "INVALID_TO",
    );
  }
  return `+${digits}`;
}

export function normalizeDestination(channel, to) {
  if (channel === "email") return normalizeEmail(to);
  if (channel === "sms") return normalizePhone(to);
  throw new AppError("channel must be email or sms", 400, null, "INVALID_CHANNEL");
}

function renderTemplate(template, { code, minutes }) {
  return String(template || "")
    .replaceAll("{{code}}", code)
    .replaceAll("{{minutes}}", String(minutes));
}

function hashOtpCode(config, destination, code) {
  return hashToken(`${config.publicId}:${destination}:${code}`);
}

async function assertSendRateLimit(config, channel, destination) {
  const windowMs = channel === "sms" ? SMS_SEND_WINDOW_MS : EMAIL_SEND_WINDOW_MS;
  const max = channel === "sms" ? SMS_SEND_MAX : EMAIL_SEND_MAX;
  const since = new Date(Date.now() - windowMs);
  const count = await OtpChallenge.countDocuments({
    otpConfig: config._id,
    destination,
    channel,
    createdAt: { $gte: since },
  });
  if (count >= max) {
    throw new AppError(
      "Too many OTP requests for this destination. Try again later.",
      429,
      null,
      "OTP_RATE_LIMITED",
    );
  }
}

async function deliverOtp(config, channel, destination, code) {
  const minutes = Math.max(1, Math.round(config.expirySeconds / 60));
  const text = renderTemplate(
    channel === "sms" ? config.smsTemplate : config.emailTemplate,
    { code, minutes },
  );

  if (channel === "email") {
    const subject = renderTemplate(config.emailSubject || "Your verification code", {
      code,
      minutes,
    });
    const result = await sendOtpEmail({
      email: destination,
      subject,
      bodyText: text,
      code,
      minutes,
    });
    if (result?.skipped && !env.isProd) {
      console.warn(`[otp:dev] email code for ${destination}: ${code}`);
    }
    return;
  }

  const sender =
    (config.smsSender && config.smsSender.trim()) || env.brevoSmsSender;
  if (!sender) {
    throw new AppError(
      "SMS sender is not configured",
      400,
      null,
      "SMS_SENDER_REQUIRED",
    );
  }

  const result = await sendSms({
    recipient: destination.replace(/^\+/, ""),
    sender,
    content: text.slice(0, 160),
  });
  if (result?.skipped && !env.isProd) {
    console.warn(`[otp:dev] sms code for ${destination}: ${code}`);
  }
}

export async function sendPublicOtp(publicId, req) {
  const config = await getPublicOtpConfig(publicId);
  assertOtpAuthorized(config, req);

  const channel = String(req.body?.channel || "").trim().toLowerCase();
  if (channel !== "email" && channel !== "sms") {
    throw new AppError(
      "channel must be email or sms",
      400,
      null,
      "INVALID_CHANNEL",
    );
  }

  if (channel === "email" && !config.emailEnabled) {
    throw new AppError("Email OTP is disabled for this endpoint", 400);
  }
  if (channel === "sms" && !config.smsEnabled) {
    throw new AppError("SMS OTP is disabled for this endpoint", 400);
  }

  const destination = normalizeDestination(channel, req.body?.to);
  await assertSendRateLimit(config, channel, destination);

  const code = generateOtpCode(config.codeLength);
  const codeHash = hashOtpCode(config, destination, code);
  const expiresAt = new Date(Date.now() + config.expirySeconds * 1000);

  await OtpChallenge.updateMany(
    {
      otpConfig: config._id,
      destination,
      verifiedAt: null,
      invalidatedAt: null,
      expiresAt: { $gt: new Date() },
    },
    { $set: { invalidatedAt: new Date() } },
  );

  const challenge = await OtpChallenge.create({
    otpConfig: config._id,
    project: config.project._id,
    channel,
    destination,
    codeHash,
    expiresAt,
    maxAttempts: config.maxAttempts,
  });

  try {
    await deliverOtp(config, channel, destination, code);
  } catch (err) {
    await challenge.deleteOne();
    throw new AppError(
      err.message || "Failed to deliver OTP",
      502,
      null,
      "OTP_DELIVERY_FAILED",
    );
  }

  return {
    success: true,
    channel,
    to: destination,
    expiresIn: config.expirySeconds,
  };
}

export async function verifyPublicOtp(publicId, req) {
  const config = await getPublicOtpConfig(publicId);
  assertOtpAuthorized(config, req);

  const rawCode = String(req.body?.code || "").trim();
  if (!/^\d{4,8}$/.test(rawCode)) {
    throw new AppError("Invalid or expired code", 400, null, "OTP_INVALID");
  }

  // Accept email or phone without requiring channel on verify
  let destination;
  const to = String(req.body?.to || "").trim();
  if (to.includes("@")) {
    destination = normalizeEmail(to);
  } else {
    destination = normalizePhone(to);
  }

  const challenge = await OtpChallenge.findOne({
    otpConfig: config._id,
    destination,
    verifiedAt: null,
    invalidatedAt: null,
  }).sort({ createdAt: -1 });

  if (!challenge || challenge.expiresAt.getTime() <= Date.now()) {
    throw new AppError("Invalid or expired code", 400, null, "OTP_INVALID");
  }

  if (challenge.attempts >= challenge.maxAttempts) {
    challenge.invalidatedAt = new Date();
    await challenge.save();
    throw new AppError("Invalid or expired code", 400, null, "OTP_INVALID");
  }

  challenge.attempts += 1;
  const expectedHash = hashOtpCode(config, destination, rawCode);
  const ok = timingSafeEqualHash(challenge.codeHash, expectedHash);

  if (!ok) {
    await challenge.save();
    throw new AppError("Invalid or expired code", 400, null, "OTP_INVALID");
  }

  challenge.verifiedAt = new Date();
  await challenge.save();

  return {
    success: true,
    verified: true,
    channel: challenge.channel,
    to: destination,
  };
}
