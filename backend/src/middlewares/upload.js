import multer from "multer";
import { AppError } from "../utils/AppError.js";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]);

const storage = multer.memoryStorage();

export const uploadFormFiles = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(
        new AppError(
          "Only JPG, JPEG, PNG, and PDF files are allowed",
          400,
          null,
          "INVALID_FILE_TYPE",
        ),
      );
    }
    return cb(null, true);
  },
}).array("files", 5);

export const ALLOWED_MIME_TYPES = ALLOWED_MIME;
