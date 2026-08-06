import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { env } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || null;
  let code = err.code || null;

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Resource already exists";
    const field = Object.keys(err.keyPattern || {})[0];
    if (field) {
      errors = [{ path: field, message: `${field} already exists` }];
    }
  }

  if (err.message?.startsWith("CORS blocked")) {
    statusCode = 403;
  }

  if (!env.isProd && statusCode === 500) {
    console.error(err);
  }

  return ApiResponse.error(res, { statusCode, message, errors, code });
}
