import { notImplemented } from "./errors.js";

export function createOtpApi() {
  return {
    async send(_email: string): Promise<never> {
      return notImplemented("OTP");
    },
    async verify(_email: string, _code: string): Promise<never> {
      return notImplemented("OTP verification");
    },
  };
}

export function createWaitlistApi() {
  return {
    async add(_user: Record<string, unknown>): Promise<never> {
      return notImplemented("Waitlist");
    },
  };
}

export type OtpApi = ReturnType<typeof createOtpApi>;
export type WaitlistApi = ReturnType<typeof createWaitlistApi>;
