import { createFormsApi } from "./forms.js";
import { createOtpApi } from "./otp.js";
import { createWaitlistApi } from "./stubs.js";
/**
 * Create a unified Quest Base client.
 *
 * @example
 * const qb = questbase({ apiKey: "qb_..." });
 * await qb.forms.submit("formId", { email, message });
 * await qb.otp.send("otpId", { channel: "email", to: email });
 */
export function questbase(config = {}) {
    return {
        forms: createFormsApi(config),
        otp: createOtpApi(config),
        waitlist: createWaitlistApi(),
    };
}
