import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { clientSchema, createClientSchema } from "./schema.js";
import { createClient, findAllClients } from "./repository.js";

export const clientRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    { schema: { response: { 200: z.array(clientSchema) } } },
    async () => findAllClients(),
  );

  fastify.post(
    "/",
    { schema: { body: createClientSchema, response: { 201: clientSchema } } },
    async (request, reply) => {
      const client = await createClient(request.body);
      return reply.status(201).send(client);
    },
  );
};
