import { z } from "zod";

export const createFormSchema = z.object({
  name: z.string().trim().min(2).max(80),
  emails: z
    .array(z.email("Enter a valid email address"))
    .min(1, "Add at least one email address")
    .max(10),
});

export const updateFormSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  emails: z
    .array(z.email("Enter a valid email address"))
    .min(1)
    .max(10)
    .optional(),
  allowedOrigins: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .refine(
          (v) => v === "*" || /^https?:\/\//i.test(v),
          "Origin must be * or a full http(s) URL",
        ),
    )
    .optional(),
  redirectUrl: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .url("Redirect URL must be a valid URL")
        .refine(
          (v) => /^https?:\/\//i.test(v),
          "Redirect URL must use http or https",
        ),
    ])
    .optional(),
  isActive: z.boolean().optional(),
});
