import { z } from "zod";

const originSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (v) => v === "*" || /^https?:\/\//i.test(v),
    "Origin must be * or a full http(s) URL",
  );

const smsSenderSchema = z
  .string()
  .trim()
  .max(15)
  .refine(
    (v) =>
      v === "" ||
      (/^[A-Za-z0-9]+$/.test(v) && v.length <= 11) ||
      (/^\d+$/.test(v) && v.length <= 15),
    "SMS sender must be ≤11 alphanumeric or ≤15 numeric characters",
  );

export const createOtpConfigSchema = z.object({
  name: z.string().trim().min(2).max(80),
  emailEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
});

export const updateOtpConfigSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  allowedOrigins: z.array(originSchema).optional(),
  emailEnabled: z.boolean().optional(),
  smsEnabled: z.boolean().optional(),
  codeLength: z.number().int().min(4).max(8).optional(),
  expirySeconds: z.number().int().min(60).max(3600).optional(),
  maxAttempts: z.number().int().min(1).max(20).optional(),
  emailSubject: z.string().trim().min(1).max(120).optional(),
  emailTemplate: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .refine((v) => v.includes("{{code}}"), "Must include {{code}}")
    .optional(),
  smsSender: smsSenderSchema.optional(),
  smsTemplate: z
    .string()
    .trim()
    .min(1)
    .max(320)
    .refine((v) => v.includes("{{code}}"), "Must include {{code}}")
    .optional(),
  isActive: z.boolean().optional(),
});

export const publicOtpSendSchema = z.object({
  channel: z.enum(["email", "sms"]),
  to: z.string().trim().min(3).max(320),
});

export const publicOtpVerifySchema = z.object({
  to: z.string().trim().min(3).max(320),
  code: z.string().trim().regex(/^\d{4,8}$/, "Enter a valid code"),
});
