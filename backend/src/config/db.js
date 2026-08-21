import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  // Fail fast on bad Atlas/URI so Orizon logs show the real error instead of hanging → 502.
  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 10_000,
  });
  console.log("MongoDB connected");
}
