import Fastify from "fastify";
import { env } from "./config/env.js";

const fastify = Fastify({
  logger: true,
});

fastify.get("/health", async () => {
  return { status: "ok" };
});

fastify.listen({ port: env.PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
