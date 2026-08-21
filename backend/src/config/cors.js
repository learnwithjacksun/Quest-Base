import { env } from "./env.js";

function normalizeOrigin(origin) {
  if (!origin) return null;
  const trimmed = String(origin).trim();
  if (!trimmed) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).origin;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin requests (no Origin header)
    if (!origin) {
      return callback(null, true);
    }
    if (env.corsOrigins.includes("*")) {
      return callback(null, true);
    }
    const normalized = normalizeOrigin(origin);
    const allowed = env.corsOrigins.some(
      (entry) => normalizeOrigin(entry) === normalized,
    );
    if (allowed) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};
