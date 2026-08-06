import { env } from "./env.js";

export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin requests (no Origin header)
    if (!origin) {
      return callback(null, true);
    }
    if (env.corsOrigins.includes(origin) || env.corsOrigins.includes("*")) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};
