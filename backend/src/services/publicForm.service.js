import { Submission } from "../models/Submission.js";
import { AppError } from "../utils/AppError.js";
import { getPublicForm } from "./form.service.js";
import { uploadFormFiles } from "./cloudinary.service.js";
import { sendFormSubmissionEmails } from "./mail.service.js";

const RESERVED_KEYS = new Set([
  "_gotcha",
  "website",
  "_redirect",
  "_next",
  "files",
]);

const MAX_FIELDS = 50;
const MAX_FIELD_VALUE_LENGTH = 5000;

function normalizeOrigin(origin) {
  if (!origin) return null;
  try {
    const url = new URL(origin);
    return url.origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
}

export function validateFormOrigin(form, requestOrigin) {
  const allowed = form.allowedOrigins || [];
  if (!allowed.length) {
    return true;
  }
  if (allowed.includes("*")) {
    return true;
  }
  if (!requestOrigin) {
    return false;
  }
  const normalized = normalizeOrigin(requestOrigin);
  return allowed.some((o) => normalizeOrigin(o) === normalized);
}

export function extractFields(body = {}) {
  const fields = {};
  let count = 0;
  for (const [key, value] of Object.entries(body)) {
    if (RESERVED_KEYS.has(key)) continue;
    if (count >= MAX_FIELDS) break;
    const str = Array.isArray(value)
      ? value.map(String).join(", ")
      : String(value ?? "");
    if (str.length > MAX_FIELD_VALUE_LENGTH) {
      throw new AppError(`Field "${key}" exceeds maximum length`, 400);
    }
    fields[key] = str;
    count += 1;
  }
  return fields;
}

export function isHoneypotTriggered(body = {}) {
  const gotcha = body._gotcha ?? body.website;
  return Boolean(gotcha && String(gotcha).trim());
}

/**
 * Auth rule for public submit:
 * - Browser requests with Origin: allowed if origins empty OR origin matches OR valid API key for project
 * - Server-to-server (no Origin): require valid API key for the form's project
 */
export function assertSubmitAuthorized(form, req) {
  const origin = req.headers.origin || req.headers.referer;
  const hasApiKey =
    req.apiKey &&
    req.apiKeyProjectId === form.project._id.toString();

  if (hasApiKey) {
    return { via: "apiKey", origin: origin || null };
  }

  if (!req.headers.origin && !req.headers.referer) {
    throw new AppError(
      "API key required for server-to-server submissions",
      401,
      null,
      "API_KEY_REQUIRED",
    );
  }

  if (!validateFormOrigin(form, origin)) {
    throw new AppError("Origin not allowed for this form", 403, null, "ORIGIN_DENIED");
  }

  return { via: "origin", origin: origin || null };
}

export async function processFormSubmission(publicId, req) {
  const form = await getPublicForm(publicId);
  const auth = assertSubmitAuthorized(form, req);

  const body = req.body || {};
  const honeypot = isHoneypotTriggered(body);
  const fields = extractFields(body);
  const redirect = body._redirect || body._next || null;

  let files = [];
  if (req.files?.length) {
    files = await uploadFormFiles(req.files);
  }

  const submission = await Submission.create({
    form: form._id,
    project: form.project._id,
    fields,
    files,
    meta: {
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
      origin: auth.origin || "",
    },
    status: honeypot ? "spam" : "pending",
    spamScore: honeypot ? 1 : 0,
  });

  if (honeypot) {
    return {
      submission: submission.toSafeObject(),
      redirect,
      spam: true,
    };
  }

  try {
    await sendFormSubmissionEmails({
      emails: form.emails,
      formName: form.name,
      fields,
      files,
    });
    submission.status = "delivered";
    await submission.save();
  } catch (err) {
    submission.status = "failed";
    submission.errorMessage = err.message;
    await submission.save();
    throw new AppError("Submission saved but email delivery failed", 502);
  }

  return {
    submission: submission.toSafeObject(),
    redirect,
    spam: false,
  };
}
