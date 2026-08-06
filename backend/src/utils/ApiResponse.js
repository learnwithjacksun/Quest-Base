export class ApiResponse {
  static success(res, { statusCode = 200, message = "Success", data = null } = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, { statusCode = 500, message = "Error", errors = null, code = null } = {}) {
    const body = {
      success: false,
      message,
    };
    if (errors) body.errors = errors;
    if (code) body.code = code;
    return res.status(statusCode).json(body);
  }
}
