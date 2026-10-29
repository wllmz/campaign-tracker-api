import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const clientSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type Client = z.infer<typeof clientSchema>;
