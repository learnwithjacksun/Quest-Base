import { notImplemented } from "./errors.js";
export function createWaitlistApi() {
    return {
        async add(_user) {
            return notImplemented("Waitlist");
        },
    };
}
