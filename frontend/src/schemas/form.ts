import { z } from "zod";

export const createFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Form name must be at least 2 characters")
    .max(80, "Form name must be under 80 characters"),
  emails: z
    .array(
      z.object({
        value: z.email("Enter a valid email address"),
      }),
    )
    .min(1, "Add at least one email address")
    .max(2, "You can add a maximum of 2 email addresses"),
});

export type CreateFormValues = z.infer<typeof createFormSchema>;
