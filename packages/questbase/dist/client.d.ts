import type { QuestbaseConfig } from "./config.js";
import { createFormsApi } from "./forms.js";
import { createOtpApi, createWaitlistApi } from "./stubs.js";
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
 */
export declare function questbase(config?: QuestbaseConfig): QuestbaseClient;
//# sourceMappingURL=client.d.ts.map