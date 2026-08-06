import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z.string().trim().min(2).max(80).optional().default("Default key"),
});