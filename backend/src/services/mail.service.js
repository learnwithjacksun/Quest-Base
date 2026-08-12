import { sendMail } from "../config/brevo.js";
import {
  buildVerificationEmail,
  buildPasswordResetEmail,
  buildFormSubmissionEmail,
  buildProductOtpEmail,
} from "../templates/emails.js";

export async function sendVerificationEmail({ email, firstName, code }) {
  const html = buildVerificationEmail({ firstName, code });
  return sendMail(email, firstName, "Verify your Quest Base email", html);
}

export async function sendPasswordResetEmail({ email, firstName, resetUrl }) {
  const html = buildPasswordResetEmail({ firstName, resetUrl });
  return sendMail(email, firstName, "Reset your Quest Base password", html);
}

export async function sendOtpEmail({ email, subject, bodyText, code, minutes }) {
  const html = buildProductOtpEmail({ bodyText, code, minutes });
  return sendMail(email, email, subject || "Your verification code", html);
}

export async function sendFormSubmissionEmails({ emails, formName, fields, files }) {
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const html = buildFormSubmissionEmail({
    formName,
    fields,
    files,
    submittedAt,
  });
  const subject = `New submission · ${formName}`;

  const results = [];
  for (const email of emails) {
    // eslint-disable-next-line no-await-in-loop
    const result = await sendMail(email, email, subject, html);
    results.push(result);
  }
  return results;
}
