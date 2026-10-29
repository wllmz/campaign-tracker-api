import { z } from "zod";

export const createClientSchema = z.object({
  // \p{Cc} = caractères de contrôle (\u0000…) : Postgres refuse l'octet nul → 500
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^\P{Cc}*$/u, "Name must not contain control characters"),
});

export const clientSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type Client = z.infer<typeof clientSchema>;
