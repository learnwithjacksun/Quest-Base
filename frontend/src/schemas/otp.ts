import { z } from "zod";

export const createOtpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters"),
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
}).refine((v) => v.emailEnabled || v.smsEnabled, {
  message: "Enable email, SMS, or both",
  path: ["emailEnabled"],
});

export type CreateOtpValues = z.infer<typeof createOtpSchema>;
