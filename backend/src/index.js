import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { corsOptions } from "./config/cors.js";
import { globalRateLimiter } from "./middlewares/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.js";
import v1Routes from "./routes/index.js";
import publicFormRoutes from "./routes/publicForm.routes.js";
import publicOtpRoutes from "./routes/publicOtp.routes.js";

const app = express();

// Orizon (and most PaaS proxies) terminate TLS upstream.
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const publicCors = cors({
  origin: true,
  credentials: false,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Accept",
    "X-Requested-With",
    "X-Api-Key",
    "Authorization",
  ],
});

// Public form endpoints — reflect the caller origin in CORS headers.
// Per-form `allowedOrigins` is enforced in publicForm.service (not here).
app.use("/f", publicCors);

// Public OTP endpoints — same CORS posture; per-config origins enforced in service.
app.use("/o", publicCors);

// Dashboard / authenticated API only — do NOT apply this globally or /f breaks in prod.
app.use("/api/v1", cors(corsOptions));
app.use(morgan(env.isProd ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(globalRateLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quest Base API",
    version: "v1",
  });
});

app.use("/api/v1", v1Routes);
app.use("/f", publicFormRoutes);
app.use("/o", publicOtpRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  // Orizon proxies to PORT and requires binding on 0.0.0.0 (not localhost).
  // Listening on the wrong host/port surfaces as Cloudflare 502 on *.orzn.app.
  app.listen(env.port, "0.0.0.0", () => {
    console.log(`Quest Base API listening on 0.0.0.0:${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
