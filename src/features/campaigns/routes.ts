import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  campaignParamsSchema,
  campaignSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from "./schema.js";
import {
  createCampaign,
  deleteCampaign,
  findAllCampaigns,
  findCampaignById,
  updateCampaign,
} from "./repository.js";

// TODO étape 4 : chef_id viendra du token, plus du body
export const campaignRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    { schema: { response: { 200: z.array(campaignSchema) } } },
    async () => findAllCampaigns(),
  );

  fastify.get(
    "/:id",
    { schema: { params: campaignParamsSchema, response: { 200: campaignSchema } } },
    async (request) => findCampaignById(request.params.id),
  );

  fastify.post(
    "/",
    { schema: { body: createCampaignSchema, response: { 201: campaignSchema } } },
    async (request, reply) => {
      const campaign = await createCampaign(request.body);
      return reply.status(201).send(campaign);
    },
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        params: campaignParamsSchema,
        body: updateCampaignSchema,
        response: { 200: campaignSchema },
      },
    },
    async (request) => updateCampaign(request.params.id, request.body),
  );

  fastify.delete(
    "/:id",
    { schema: { params: campaignParamsSchema } },
    async (request, reply) => {
      await deleteCampaign(request.params.id);
      return reply.status(204).send();
    },
  );
};
