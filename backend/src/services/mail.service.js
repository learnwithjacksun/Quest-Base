import { sendMail } from "../config/brevo.js";
import {
  buildVerificationEmail,
  buildPasswordResetEmail,
  buildFormSubmissionEmail,
} from "../templates/emails.js";

export async function sendVerificationEmail({ email, firstName, code }) {
  const html = buildVerificationEmail({ firstName, code });
  return sendMail(email, firstName, "Verify your Quest Base email", html);
}

export async function sendPasswordResetEmail({ email, firstName, resetUrl }) {
  const html = buildPasswordResetEmail({ firstName, resetUrl });
  return sendMail(email, firstName, "Reset your Quest Base password", html);
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
