import { getCloudinary } from "../config/cloudinary.js";
import { AppError } from "../utils/AppError.js";

export async function uploadBufferToCloudinary(file) {
  const cloudinary = getCloudinary();
  if (!cloudinary) {
    // Dev fallback: data URL (not for production)
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: base64,
      resourceType: file.mimetype.startsWith("image/") ? "image" : "raw",
      publicId: `local-${Date.now()}`,
      format: file.originalname.split(".").pop(),
    };
  }

  const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "questbase/forms",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(new AppError("File upload failed", 500));
        }
        resolve({
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: result.secure_url,
          resourceType: result.resource_type,
          publicId: result.public_id,
          format: result.format,
        });
      },
    );
    stream.end(file.buffer);
  });
}

export async function uploadFormFiles(files = []) {
  const uploaded = [];
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    uploaded.push(await uploadBufferToCloudinary(file));
  }
  return uploaded;
}
