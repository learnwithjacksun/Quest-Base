import { notImplemented } from "./errors.js";

export function createWaitlistApi() {
  return {
    async add(_user: Record<string, unknown>): Promise<never> {
      return notImplemented("Waitlist");
    },
  };
}

export type WaitlistApi = ReturnType<typeof createWaitlistApi>;
