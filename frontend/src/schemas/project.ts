import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(60, "Project name must be under 60 characters"),
  description: z
    .string()
    .trim()
    .max(160, "Description must be under 160 characters")
    .optional()
    .or(z.literal("")),
  platform: z.enum(["Web", "Mobile"]),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
