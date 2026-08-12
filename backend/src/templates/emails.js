import { escapeHtml, humanizeFieldKey } from "../utils/helpers.js";

function imageBlock(file) {
  const thumb = file.url.includes("/upload/")
    ? file.url.replace("/upload/", "/upload/c_fill,w_480,h_320,q_auto,f_auto/")
    : file.url;
  return `
    <tr>
      <td style="padding:0 0 16px;">
        <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;">
          <img src="${escapeHtml(thumb)}" alt="${escapeHtml(file.originalName || "Image")}"
            width="520"
            style="display:block;width:100%;max-width:520px;height:auto;border-radius:10px;border:1px solid #e5e7eb;" />
          <p style="margin:10px 0 0;font-size:15px;line-height:1.5;color:#374151;">
            ${escapeHtml(file.originalName || "Image")}
            ${file.size ? ` · ${Math.round(file.size / 1024)} KB` : ""}
          </p>
        </a>
      </td>
    </tr>`;
}

function pdfBlock(file) {
  return `
    <tr>
      <td style="padding:0 0 16px;">
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;background:#f9fafb;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b91c1c;">
            PDF
          </p>
          <p style="margin:8px 0 0;font-size:17px;font-weight:600;color:#111827;line-height:1.4;word-break:break-word;">
            ${escapeHtml(file.originalName || "Document.pdf")}
          </p>
          <p style="margin:6px 0 0;font-size:14px;color:#6b7280;">
            ${file.size ? `${Math.round(file.size / 1024)} KB` : "PDF document"}
          </p>
          <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer"
            style="display:inline-block;margin-top:16px;padding:12px 18px;background:#111827;color:#ffffff;
            border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;">
            View PDF
          </a>
        </div>
      </td>
    </tr>`;
}

function otherFileBlock(file) {
  return `
    <tr>
      <td style="padding:0 0 16px;">
        <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;background:#f9fafb;">
          <p style="margin:0;font-size:17px;font-weight:600;color:#111827;line-height:1.4;word-break:break-word;">
            ${escapeHtml(file.originalName || "Attachment")}
          </p>
          <p style="margin:6px 0 0;font-size:14px;color:#6b7280;">
            ${[
              file.mimeType || "File",
              file.size ? `${Math.round(file.size / 1024)} KB` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer"
            style="display:inline-block;margin-top:16px;padding:12px 18px;background:#111827;color:#ffffff;
            border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;">
            Download
          </a>
        </div>
      </td>
    </tr>`;
}

export function buildVerificationEmail({ firstName, code }) {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" style="background:#ffffff;border-radius:12px;padding:36px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Quest Base</p>
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.3;color:#111827;">Verify your email</h1>
          <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.6;">
            Hi ${escapeHtml(firstName)}, use this code to verify your Quest Base account:
          </p>
          <p style="margin:0 0 24px;font-size:36px;letter-spacing:0.28em;font-weight:700;color:#111827;text-align:center;">
            ${escapeHtml(code)}
          </p>
          <p style="margin:0;font-size:14px;color:#9ca3af;">This code expires in 15 minutes.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function buildPasswordResetEmail({ firstName, resetUrl }) {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" style="background:#ffffff;border-radius:12px;padding:36px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Quest Base</p>
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.3;color:#111827;">Reset your password</h1>
          <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.6;">
            Hi ${escapeHtml(firstName)}, click the button below to choose a new password.
          </p>
          <p style="margin:0 0 24px;text-align:center;">
            <a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:14px 22px;background:#111827;color:#fff;
              border-radius:8px;font-size:16px;font-weight:600;text-decoration:none;">Reset password</a>
          </p>
          <p style="margin:0;font-size:14px;color:#9ca3af;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function buildFormSubmissionEmail({ formName, fields, files, submittedAt }) {
  const fieldRows = Object.entries(fields || {})
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding:16px 18px;border-bottom:1px solid #f3f4f6;font-size:15px;line-height:1.5;color:#6b7280;width:34%;vertical-align:top;">
          ${escapeHtml(humanizeFieldKey(key))}
        </td>
        <td style="padding:16px 18px;border-bottom:1px solid #f3f4f6;font-size:16px;line-height:1.6;color:#111827;word-break:break-word;">
          ${escapeHtml(Array.isArray(value) ? value.join(", ") : String(value ?? ""))}
        </td>
      </tr>`,
    )
    .join("");

  const images = (files || []).filter((f) => f.mimeType?.startsWith("image/"));
  const pdfs = (files || []).filter((f) => f.mimeType === "application/pdf");
  const others = (files || []).filter(
    (f) => !f.mimeType?.startsWith("image/") && f.mimeType !== "application/pdf",
  );

  const mediaSections = [];
  if (images.length) {
    mediaSections.push(`
      <h2 style="margin:32px 0 14px;font-size:18px;line-height:1.4;color:#111827;">Images</h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${images.map(imageBlock).join("")}
      </table>`);
  }
  if (pdfs.length) {
    mediaSections.push(`
      <h2 style="margin:32px 0 14px;font-size:18px;line-height:1.4;color:#111827;">Documents</h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${pdfs.map(pdfBlock).join("")}
      </table>`);
  }
  if (others.length) {
    mediaSections.push(`
      <h2 style="margin:32px 0 14px;font-size:18px;line-height:1.4;color:#111827;">Attachments</h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${others.map(otherFileBlock).join("")}
      </table>`);
  }

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px;">
    <tr><td align="center">
      <table width="640" style="background:#ffffff;border-radius:14px;padding:40px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">
            Quest Base · Form submission
          </p>
          <h1 style="margin:0 0 10px;font-size:28px;line-height:1.3;color:#111827;">
            ${escapeHtml(formName)}
          </h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.5;color:#9ca3af;">
            Received ${escapeHtml(submittedAt)}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
            ${
              fieldRows ||
              `<tr><td style="padding:20px;color:#6b7280;font-size:16px;">No fields submitted.</td></tr>`
            }
          </table>
          ${mediaSections.join("")}
          <p style="margin:32px 0 0;font-size:13px;line-height:1.5;color:#9ca3af;">
            Delivered by Quest Base Form-to-Mail
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function buildProductOtpEmail({ bodyText, code, minutes }) {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" style="background:#ffffff;border-radius:12px;padding:36px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Verification code</p>
          <h1 style="margin:0 0 16px;font-size:26px;line-height:1.3;color:#111827;">Enter this code to continue</h1>
          <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.6;">
            ${escapeHtml(bodyText || "Use the code below to verify.")}
          </p>
          <p style="margin:0 0 24px;font-size:36px;letter-spacing:0.28em;font-weight:700;color:#111827;text-align:center;">
            ${escapeHtml(code)}
          </p>
          <p style="margin:0;font-size:14px;color:#9ca3af;">
            This code expires in ${escapeHtml(String(minutes || 5))} minutes.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
