import Fastify from "fastify";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { errorHandler } from "./error/error-handler.js";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);
fastify.setErrorHandler(errorHandler);

fastify.addHook("onClose", async () => {
  await pool.end();
});

fastify.get("/health", async (request, reply) => {
  try {
    await pool.query("SELECT 1");
    return { status: "ok", db: "ok" };
  } catch (err) {
    request.log.error(err);
    return reply.status(503).send({ status: "error", db: "error" });
  }
});

const shutdown = async (signal: NodeJS.Signals) => {
  fastify.log.info(`${signal} received, shutting down`);
  try {
    await fastify.close();
    process.exit(0);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

fastify.listen({ port: env.PORT, host: env.HOST }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
