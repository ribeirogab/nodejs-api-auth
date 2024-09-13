import type { FastifyInstance } from 'fastify';

export type Router = {
  routes(app: FastifyInstance): FastifyInstance;
};
