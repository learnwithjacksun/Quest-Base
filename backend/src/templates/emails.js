import { escapeHtml, humanizeFieldKey } from "../utils/helpers.js";

function imageBlock(file) {
  const thumb = file.url.includes("/upload/")
    ? file.url.replace("/upload/", "/upload/c_fill,w_240,h_180,q_auto,f_auto/")
    : file.url;
  return `
    <td style="padding:8px;vertical-align:top;">
      <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
        <img src="${escapeHtml(thumb)}" alt="${escapeHtml(file.originalName || "Image")}"
          width="240" height="180"
          style="display:block;border-radius:8px;border:1px solid #e5e7eb;object-fit:cover;max-width:240px;" />
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">${escapeHtml(file.originalName || "Image")}</p>
      </a>
    </td>`;
}

function pdfBlock(file) {
  return `
    <td style="padding:8px;vertical-align:top;width:50%;">
      <div style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;background:#f9fafb;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:48px;border-radius:6px;background:#fee2e2;color:#b91c1c;
            font-size:11px;font-weight:700;text-align:center;line-height:48px;">PDF</div>
          <div style="flex:1;min-width:0;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;word-break:break-word;">
              ${escapeHtml(file.originalName || "Document.pdf")}
            </p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">
              ${file.size ? `${Math.round(file.size / 1024)} KB` : "PDF document"}
            </p>
          </div>
        </div>
        <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;margin-top:14px;padding:8px 14px;background:#111827;color:#fff;
          border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;">
          View PDF
        </a>
      </div>
    </td>`;
}

export function buildVerificationEmail({ firstName, code }) {
  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="480" style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Quest Base</p>
          <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Verify your email</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.5;">
            Hi ${escapeHtml(firstName)}, use this code to verify your Quest Base account:
          </p>
          <p style="margin:0 0 24px;font-size:32px;letter-spacing:0.3em;font-weight:700;color:#111827;text-align:center;">
            ${escapeHtml(code)}
          </p>
          <p style="margin:0;font-size:13px;color:#9ca3af;">This code expires in 15 minutes.</p>
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
      <table width="480" style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Quest Base</p>
          <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Reset your password</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.5;">
            Hi ${escapeHtml(firstName)}, click the button below to choose a new password.
          </p>
          <p style="margin:0 0 24px;text-align:center;">
            <a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:12px 20px;background:#111827;color:#fff;
              border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Reset password</a>
          </p>
          <p style="margin:0;font-size:13px;color:#9ca3af;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
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
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;width:36%;vertical-align:top;">
          ${escapeHtml(humanizeFieldKey(key))}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;word-break:break-word;">
          ${escapeHtml(Array.isArray(value) ? value.join(", ") : String(value ?? ""))}
        </td>
      </tr>`,
    )
    .join("");

  const images = (files || []).filter((f) => f.mimeType?.startsWith("image/"));
  const pdfs = (files || []).filter((f) => f.mimeType === "application/pdf");

  const mediaSections = [];
  if (images.length) {
    mediaSections.push(`
      <h2 style="margin:28px 0 12px;font-size:15px;color:#111827;">Images</h2>
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        ${images.map(imageBlock).join("")}
      </tr></table>`);
  }
  if (pdfs.length) {
    mediaSections.push(`
      <h2 style="margin:28px 0 12px;font-size:15px;color:#111827;">Documents</h2>
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        ${pdfs.map(pdfBlock).join("")}
      </tr></table>`);
  }

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">Quest Base · Form submission</p>
          <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">${escapeHtml(formName)}</h1>
          <p style="margin:0 0 24px;font-size:13px;color:#9ca3af;">
            Received ${escapeHtml(submittedAt)}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            ${fieldRows || `<tr><td style="padding:16px;color:#6b7280;font-size:14px;">No fields submitted.</td></tr>`}
          </table>
          ${mediaSections.join("")}
          <p style="margin:28px 0 0;font-size:12px;color:#9ca3af;">
            Delivered by Quest Base Form-to-Mail
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
