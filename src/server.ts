import Fastify from "fastify";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

const fastify = Fastify({
  logger: true,
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

fastify.listen({ port: env.PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
