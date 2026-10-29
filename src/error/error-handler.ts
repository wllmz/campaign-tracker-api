import { NotFoundError } from "./not-found-error.js";
import { ConflictError } from "./conflict-error.js";
import { InvalidReferenceError } from "./invalid-reference-error.js";
import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof NotFoundError) {
    reply.status(404).send({ error: error.message });
  } else if (error instanceof ConflictError) {
    reply.status(409).send({ error: error.message });
  } else if (error instanceof InvalidReferenceError) {
    reply.status(400).send({ error: error.message });
  } else if (error.statusCode !== undefined && error.statusCode < 500) {
    reply.status(error.statusCode).send({ error: error.message });
  } else {
    request.log.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}
