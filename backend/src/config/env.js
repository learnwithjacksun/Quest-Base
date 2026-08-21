import process from "process";

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function normalizeOrigin(value) {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).origin;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

function parseOriginList(raw) {
  return String(raw || "")
    .split(",")
    .map((o) => normalizeOrigin(o))
    .filter(Boolean);
}

const nodeEnv = optional("NODE_ENV", "development");
const isProd = nodeEnv === "production";
const clientUrl = normalizeOrigin(optional("CLIENT_URL", "http://localhost:3000")) ||
  "http://localhost:3000";

const corsOrigins = Array.from(
  new Set([
    ...parseOriginList(optional("CORS_ORIGINS", "http://localhost:3000")),
    // Setting CLIENT_URL alone must be enough for the dashboard origin.
    clientUrl,
  ]),
);

// Cross-site cookies (dashboard on questbase.orzn.app → API on questbase-server.orzn.app)
// require SameSite=None; Secure. Infer from HTTPS client URL if NODE_ENV was forgotten.
const cookieSecure =
  optional("COOKIE_SECURE", "false") === "true" ||
  isProd ||
  clientUrl.startsWith("https://");

export const env = {
  port: Number(optional("PORT", "9000")),
  nodeEnv,
  isProd,
  mongodbUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/questbase"),
  jwtAccessSecret: required(
    "JWT_ACCESS_SECRET",
    "dev-access-secret-change-me-32chars",
  ),
  jwtRefreshSecret: required(
    "JWT_REFRESH_SECRET",
    "dev-refresh-secret-change-me-32chars",
  ),
  jwtAccessExpiresIn: optional("JWT_ACCESS_EXPIRES_IN", "15m"),
  jwtRefreshExpiresIn: optional("JWT_REFRESH_EXPIRES_IN", "7d"),
  clientUrl,
  corsOrigins,
  cookieSecure,
  brevoApiKey: optional("BREVO_API_KEY"),
  mailFromEmail: optional("MAIL_FROM_EMAIL", "hello@questbase.com"),
  mailFromName: optional("MAIL_FROM_NAME", "Quest Base"),
  brevoSmsSender: optional("BREVO_SMS_SENDER", "QuestBase"),
  cloudinaryCloudName: optional("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: optional("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: optional("CLOUDINARY_API_SECRET"),
  rateLimitWindowMs: Number(optional("RATE_LIMIT_WINDOW_MS", "900000")),
  rateLimitMax: Number(optional("RATE_LIMIT_MAX", "100")),
  formRateLimitMax: Number(optional("FORM_RATE_LIMIT_MAX", "30")),
  otpRateLimitMax: Number(optional("OTP_RATE_LIMIT_MAX", "20")),
  otpSmsRateLimitMax: Number(optional("OTP_SMS_RATE_LIMIT_MAX", "8")),
  bcryptSaltRounds: Number(optional("BCRYPT_SALT_ROUNDS", "12")),
  refreshCookieName: "qb_refresh_token",
};
