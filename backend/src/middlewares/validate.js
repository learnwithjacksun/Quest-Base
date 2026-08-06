import { AppError } from "../utils/AppError.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const payload = req[source] ?? {};
    const result = schema.safeParse(payload);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return next(new AppError("Validation failed", 400, errors, "VALIDATION_ERROR"));
    }
    req[source] = result.data;
    return next();
  };
}
