import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export interface ErrorMiddleware {
  middleware: (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void>;
}
