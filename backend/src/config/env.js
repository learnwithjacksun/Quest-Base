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

export const env = {
  port: Number(optional("PORT", "9000")),
  nodeEnv: optional("NODE_ENV", "development"),
  isProd: optional("NODE_ENV", "development") === "production",
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
  clientUrl: optional("CLIENT_URL", "http://localhost:3000"),
  corsOrigins: optional("CORS_ORIGINS", "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  cookieSecure: optional("COOKIE_SECURE", "false") === "true",
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
