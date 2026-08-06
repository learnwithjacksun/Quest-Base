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

const app = express();

app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
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

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Quest Base API running on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
