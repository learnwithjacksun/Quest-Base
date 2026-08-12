import type { QuestbaseConfig } from "./config.js";
import { createFormsApi } from "./forms.js";
import { createOtpApi } from "./otp.js";
import { createWaitlistApi } from "./stubs.js";

export type QuestbaseClient = {
  forms: ReturnType<typeof createFormsApi>;
  otp: ReturnType<typeof createOtpApi>;
  waitlist: ReturnType<typeof createWaitlistApi>;
};

/**
 * Create a unified Quest Base client.
 *
 * @example
 * const qb = questbase({ apiKey: "qb_..." });
 * await qb.forms.submit("formId", { email, message });
 * await qb.otp.send("otpId", { channel: "email", to: email });
 */
export function questbase(config: QuestbaseConfig = {}): QuestbaseClient {
  return {
    forms: createFormsApi(config),
    otp: createOtpApi(config),
    waitlist: createWaitlistApi(),
  };
}
