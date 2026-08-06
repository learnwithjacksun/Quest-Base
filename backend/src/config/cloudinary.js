import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    if (
      !env.cloudinaryCloudName ||
      !env.cloudinaryApiKey ||
      !env.cloudinaryApiSecret
    ) {
      return null;
    }
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}
