import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import {
  generateOtpCode,
  generateRandomToken,
  hashToken,
} from "../utils/crypto.js";
import { env } from "../config/env.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./mail.service.js";
import {
  buildAccessToken,
  clearRefreshCookie,
  issueRefreshToken,
  revokeRefreshToken,
  rotateRefreshToken,
  setRefreshCookie,
} from "./token.service.js";

const OTP_TTL_MS = 15 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

export async function registerUser(input) {
  const email = input.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const code = generateOtpCode();
  const user = await User.create({
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    password: input.password,
    isEmailVerified: false,
    emailVerificationCode: code,
    emailVerificationExpires: new Date(Date.now() + OTP_TTL_MS),
  });

  await sendVerificationEmail({
    email: user.email,
    firstName: user.firstName,
    code,
  });

  return {
    user: user.toSafeObject(),
    email: user.email,
  };
}

export async function verifyEmail({ email, code }) {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+emailVerificationCode +emailVerificationExpires",
  );
  if (!user) {
    throw new AppError("Invalid verification code", 400);
  }
  if (user.isEmailVerified) {
    return user.toSafeObject();
  }
  if (
    !user.emailVerificationCode ||
    user.emailVerificationCode !== code ||
    !user.emailVerificationExpires ||
    user.emailVerificationExpires < new Date()
  ) {
    throw new AppError("Invalid or expired verification code", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  return user.toSafeObject();
}

export async function resendVerification(email) {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+emailVerificationCode +emailVerificationExpires",
  );
  if (!user) {
    // Avoid email enumeration
    return { sent: true };
  }
  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  const code = generateOtpCode();
  user.emailVerificationCode = code;
  user.emailVerificationExpires = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  await sendVerificationEmail({
    email: user.email,
    firstName: user.firstName,
    code,
  });
  return { sent: true };
}

export async function loginUser({ email, password }, meta, res) {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      "Please verify your email before signing in",
      403,
      null,
      "EMAIL_NOT_VERIFIED",
    );
  }

  const accessToken = buildAccessToken(user);
  const { token: refreshToken } = await issueRefreshToken(user, meta);
  setRefreshCookie(res, refreshToken);

  return {
    accessToken,
    user: user.toSafeObject(),
  };
}

export async function logoutUser(req, res) {
  const raw = req.cookies?.[env.refreshCookieName];
  await revokeRefreshToken(raw);
  clearRefreshCookie(res);
}

export async function refreshSession(req, res) {
  const raw = req.cookies?.[env.refreshCookieName];
  if (!raw) {
    throw new AppError("Refresh token missing", 401, null, "UNAUTHORIZED");
  }

  const result = await rotateRefreshToken(raw, {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });
  setRefreshCookie(res, result.refreshToken);

  return {
    accessToken: result.accessToken,
    user: result.user.toSafeObject(),
  };
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return { sent: true };
  }

  const rawToken = generateRandomToken(32);
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_TTL_MS);
  await user.save();

  const resetUrl = `${env.clientUrl}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail({
    email: user.email,
    firstName: user.firstName,
    resetUrl,
  });

  return { sent: true };
}

export async function resetPassword({ token, password }) {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return user.toSafeObject();
}

export async function updateProfile(userId, input) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (input.firstName !== undefined) user.firstName = input.firstName;
  if (input.lastName !== undefined) user.lastName = input.lastName;
  await user.save();
  return user.toSafeObject();
}
