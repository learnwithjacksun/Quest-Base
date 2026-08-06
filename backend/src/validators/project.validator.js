import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  platform: z.enum(["Web", "Mobile"]).default("Web"),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(500).optional(),
  platform: z.enum(["Web", "Mobile"]).optional(),
  status: z.enum(["Active", "Paused"]).optional(),
});
