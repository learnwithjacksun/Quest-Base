import { BrevoClient } from "@getbrevo/brevo";
import { env } from "./env.js";

let brevo = null;

function getBrevoClient() {
  if (!env.brevoApiKey) {
    return null;
  }
  if (!brevo) {
    brevo = new BrevoClient({
      apiKey: env.brevoApiKey,
      timeoutInSeconds: 30,
      maxRetries: 3,
    });
  }
  return brevo;
}

/**
 * Send a transactional email via Brevo.
 * In development without BREVO_API_KEY, logs and returns a mock result.
 */
export async function sendMail(toEmail, toName, subject, htmlContent) {
  if (!toEmail || !subject || !htmlContent) {
    throw new Error("Missing required fields for sendMail");
  }

  const client = getBrevoClient();

  if (!client) {
    console.warn(
      `[mail:dev] Skipping Brevo send → ${toEmail} | ${subject}`,
    );
    return { messageId: `dev-${Date.now()}`, skipped: true };
  }

  try {
    const result = await client.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: {
        name: env.mailFromName,
        email: env.mailFromEmail,
      },
      to: [{ email: toEmail, name: toName || toEmail }],
    });
    return result;
  } catch (err) {
    console.error(`Error sending email: ${err.message}`);
    if (err.statusCode === 401) {
      console.error("Invalid Brevo API key");
    } else if (err.statusCode === 429) {
      const retryAfter = err.rawResponse?.headers?.["retry-after"];
      console.error(`Rate limited. Retry after ${retryAfter}s`);
    }
    throw new Error("Failed to send email");
  }
}
