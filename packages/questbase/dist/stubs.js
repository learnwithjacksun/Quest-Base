import { notImplemented } from "./errors.js";
export function createOtpApi() {
    return {
        async send(_email) {
            return notImplemented("OTP");
        },
        async verify(_email, _code) {
            return notImplemented("OTP verification");
        },
    };
}
export function createWaitlistApi() {
    return {
        async add(_user) {
            return notImplemented("Waitlist");
        },
    };
}
