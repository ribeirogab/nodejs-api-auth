import type {
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';

export interface HookMiddleware {
  middleware: (
    request: FastifyRequest,
    reply: FastifyReply,
    done?: HookHandlerDoneFunction,
  ) => Promise<void>;
}
