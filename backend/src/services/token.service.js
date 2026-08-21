import { env } from "../config/env.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { hashToken } from "../utils/crypto.js";
import {
  parseDurationToMs,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import { AppError } from "../utils/AppError.js";

export function buildAccessToken(user) {
  return signAccessToken({
    sub: user._id.toString(),
    email: user.email,
  });
}

export async function issueRefreshToken(user, meta = {}) {
  const token = signRefreshToken({ sub: user._id.toString() });
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + parseDurationToMs(env.jwtRefreshExpiresIn),
  );

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
    userAgent: meta.userAgent || "",
    ip: meta.ip || "",
  });

  return { token, expiresAt };
}

function refreshCookieOptions() {
  // Cross-origin HTTPS dashboards need SameSite=None; Secure or the browser
  // drops the refresh cookie and every subsequent API call looks "broken".
  const crossSite = env.cookieSecure;
  return {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? "none" : "lax",
    path: "/api/v1/auth",
  };
}

export function setRefreshCookie(res, token) {
  res.cookie(env.refreshCookieName, token, {
    ...refreshCookieOptions(),
    maxAge: parseDurationToMs(env.jwtRefreshExpiresIn),
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(env.refreshCookieName, refreshCookieOptions());
}

export async function rotateRefreshToken(rawToken, meta = {}) {
  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401, null, "UNAUTHORIZED");
  }

  const tokenHash = hashToken(rawToken);
  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AppError("Refresh token revoked or expired", 401, null, "UNAUTHORIZED");
  }

  stored.revokedAt = new Date();
  await stored.save();

  const { User } = await import("../models/User.js");
  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError("User not found", 401, null, "UNAUTHORIZED");
  }

  const accessToken = buildAccessToken(user);
  const refresh = await issueRefreshToken(user, meta);
  return { user, accessToken, refreshToken: refresh.token };
}

export async function revokeRefreshToken(rawToken) {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
