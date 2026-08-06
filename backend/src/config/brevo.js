import { BrevoError } from "@getbrevo/brevo";
import process from "process";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  timeoutInSeconds: 30,
  maxRetries: 3,
});

export const sendMail = async (toEmail, toName, subject, htmlContent) => {
  if (!toEmail || !toName || !subject || !htmlContent) {
    throw new Error("Missing required fields");
  }

  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: htmlContent,
      sender: { name: "Quest Base", email: "hello@questbase.com" },
      to: [{ email: toEmail, name: toName }],
    });
    return result;
  } catch (err) {
    console.error(`Error sending email: ${err.message}`);
    if (err.statusCode === 401) {
      console.error("Invalid API key");
    } else if (err.statusCode === 429) {
      const retryAfter = err.rawResponse.headers["retry-after"];
      console.error(`Rate limited. Retry after ${retryAfter}s`);
    } else if (err.statusCode === 500) {
      console.error(`Internal server error ${err.statusCode}:`, err.message);
      throw new Error("Internal server error");
    }
    throw new Error("Unknown error");
  } finally {
    return result;
  }
};
