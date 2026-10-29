import { z } from "zod";

export const createCampaignSchema = z.object({
  // \p{Cc} = caractères de contrôle (\u0000…) : Postgres refuse l'octet nul → 500
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^\P{Cc}*$/u, "Name must not contain control characters"),
  client_id: z.uuid(),
  chef_id: z.uuid(),
});

export const updateCampaignSchema = createCampaignSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const campaignParamsSchema = z.object({
  id: z.uuid(),
});

export const campaignSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  client_id: z.uuid(),
  chef_id: z.uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type Campaign = z.infer<typeof campaignSchema>;
