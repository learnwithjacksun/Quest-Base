import { createFormsApi } from "./forms.js";
import { createOtpApi, createWaitlistApi } from "./stubs.js";
/**
 * Create a unified Quest Base client.
 *
 * @example
 * const qb = questbase({ apiKey: "qb_..." });
 * await qb.forms.submit("formId", { email, message });
 */
export function questbase(config = {}) {
    return {
        forms: createFormsApi(config),
        otp: createOtpApi(),
        waitlist: createWaitlistApi(),
    };
}
