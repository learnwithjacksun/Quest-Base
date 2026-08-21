import { escapeHtml, humanizeFieldKey } from "../utils/helpers.js";

const EMAIL_FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

function formatFieldValue(value) {
  const raw = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  const safe = escapeHtml(raw);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim())) {
    return `<a href="mailto:${safe}" style="color:#111111;text-decoration:underline;">${safe}</a>`;
  }
  if (/^https?:\/\//i.test(raw.trim())) {
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer" style="color:#111111;text-decoration:underline;">${safe}</a>`;
  }
  return safe.replace(/\n/g, "<br />");
}

function brandHeader({ logoUrl, subtitle }) {
  const mark = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" width="32" height="32" alt=""
          style="display:block;width:32px;height:32px;border:0;outline:none;border-radius:6px;" />`
    : `<span style="display:block;width:32px;height:32px;border-radius:6px;background:#17CF97;"></span>`;

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 40px;border-collapse:collapse;">
      <tr>
        <td valign="middle" width="32" style="width:32px;padding:0;line-height:0;">${mark}</td>
        <td valign="middle" style="padding:0 0 0 14px;">
          <p style="margin:0;font-family:${EMAIL_FONT};font-size:18px;line-height:1.2;font-weight:600;color:#0a0a0a;letter-spacing:-0.02em;">
            Questbase
          </p>
          ${
            subtitle
              ? `<p style="margin:5px 0 0;font-family:${EMAIL_FONT};font-size:13px;line-height:1.3;color:#737373;">${escapeHtml(subtitle)}</p>`
              : ""
          }
        </td>
      </tr>
    </table>`;
}

function imageBlock(file) {
  const thumb = file.url.includes("/upload/")
    ? file.url.replace("/upload/", "/upload/c_fill,w_640,h_400,q_auto,f_auto/")
    : file.url;
  return `
    <tr>
      <td style="padding:0 0 20px;">
        <a href="${escapeHtml(file.url)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;">
          <img src="${escapeHtml(thumb)}" alt="${escapeHtml(file.originalName || "Image")}"
            width="600"
            style="display:block;width:100%;max-width:600px;height:auto;border-radius:8px;border:1px solid #ececec;" />
          <p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#525252;">
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

export function buildFormSubmissionEmail({
  formName,
  fields,
  files,
  submittedAt,
  logoUrl,
}) {
  const entries = Object.entries(fields || {});
  const fieldRows = entries
    .map(([key, value], index) => {
      const isLast = index === entries.length - 1;
      const padTop = index === 0 ? "0" : "24px";
      const padBottom = isLast ? "0" : "24px";
      const border = isLast ? "" : "border-bottom:1px solid #ececec;";
      return `
      <tr>
        <td style="padding:${padTop} 0 ${padBottom};${border}">
          <p style="margin:0 0 6px;font-family:${EMAIL_FONT};font-size:13px;line-height:1.4;font-weight:500;color:#737373;text-transform:none;">
            ${escapeHtml(humanizeFieldKey(key))}
          </p>
          <p style="margin:0;font-family:${EMAIL_FONT};font-size:16px;line-height:1.55;color:#0a0a0a;word-break:break-word;">
            ${formatFieldValue(value)}
          </p>
        </td>
      </tr>`;
    })
    .join("");

  const images = (files || []).filter((f) => f.mimeType?.startsWith("image/"));
  const pdfs = (files || []).filter((f) => f.mimeType === "application/pdf");
  const others = (files || []).filter(
    (f) => !f.mimeType?.startsWith("image/") && f.mimeType !== "application/pdf",
  );

  const mediaSections = [];
  if (images.length) {
    mediaSections.push(`
      <h2 style="margin:40px 0 16px;font-size:15px;line-height:1.4;font-weight:600;color:#0a0a0a;">Images</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${images.map(imageBlock).join("")}
      </table>`);
  }
  if (pdfs.length) {
    mediaSections.push(`
      <h2 style="margin:40px 0 16px;font-size:15px;line-height:1.4;font-weight:600;color:#0a0a0a;">Documents</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${pdfs.map(pdfBlock).join("")}
      </table>`);
  }
  if (others.length) {
    mediaSections.push(`
      <h2 style="margin:40px 0 16px;font-size:15px;line-height:1.4;font-weight:600;color:#0a0a0a;">Attachments</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${others.map(otherFileBlock).join("")}
      </table>`);
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>New submission · ${escapeHtml(formName)}</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:${EMAIL_FONT};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f7f7;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:720px;width:100%;">
          <tr>
            <td style="background:#ffffff;border:1px solid #ececec;border-radius:12px;padding:52px 48px;">
              ${brandHeader({ logoUrl, subtitle: "Form submission" })}

              <h1 style="margin:0 0 10px;font-family:${EMAIL_FONT};font-size:30px;line-height:1.25;font-weight:600;letter-spacing:-0.03em;color:#0a0a0a;">
                ${escapeHtml(formName)}
              </h1>
              <p style="margin:0 0 40px;font-family:${EMAIL_FONT};font-size:14px;line-height:1.5;color:#737373;">
                Received ${escapeHtml(submittedAt)}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${
                  fieldRows ||
                  `<tr><td style="padding:0;font-family:${EMAIL_FONT};font-size:15px;color:#737373;">No fields submitted.</td></tr>`
                }
              </table>

              ${mediaSections.join("")}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 8px 0;text-align:center;">
              <p style="margin:0;font-family:${EMAIL_FONT};font-size:13px;line-height:1.5;color:#a3a3a3;">
                Delivered by Questbase Form-to-Mail
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
