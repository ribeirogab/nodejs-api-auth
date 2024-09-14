import type { FastifyInstance } from 'fastify';

export type Router = {
  routes(
    app: FastifyInstance,
    options?: unknown,
    done?: (err?: Error) => void,
  ): FastifyInstance;
};
