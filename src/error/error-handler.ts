import { NotFoundError } from "./not-found-error.js";
import { ConflictError } from "./conflict-error.js";
import { InvalidReferenceError } from "./invalid-reference-error.js";
import type { FastifyRequest, FastifyReply } from "fastify";

// Erreurs Fastify (validation, JSON invalide…) : elles portent déjà un statusCode 4xx
function hasClientStatusCode(error: unknown): error is Error & { statusCode: number } {
  return (
    error instanceof Error &&
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    error.statusCode < 500
  );
}

export function errorHandler(
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof NotFoundError) {
    reply.status(404).send({ error: error.message });
  } else if (error instanceof ConflictError) {
    reply.status(409).send({ error: error.message });
  } else if (error instanceof InvalidReferenceError) {
    reply.status(400).send({ error: error.message });
  } else if (hasClientStatusCode(error)) {
    reply.status(error.statusCode).send({ error: error.message });
  } else {
    request.log.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}
