import cors from '@fastify/cors';
import { fastify } from 'fastify';
import 'reflect-metadata';
import { container } from 'tsyringe';

import { LoggerAdapter } from './adapters';
import { EnvConfig, RateLimit } from './configs';
import { HttpMethodEnum } from './constants';
import './container';
import { ErrorHandlingMiddleware, RequestAuditMiddleware } from './middlewares';
import { AppRouter } from './routers';

export const main = () => {
  const app = fastify({ logger: false });

  const errorHandler = container.resolve(ErrorHandlingMiddleware);
  const requestAudit = container.resolve(RequestAuditMiddleware);
  const rateLimit = container.resolve(RateLimit);
  const envConfig = container.resolve(EnvConfig);
  const appRouter = container.resolve(AppRouter);
  const logger = container.resolve(LoggerAdapter);

  app.setErrorHandler(errorHandler.middleware.bind(errorHandler));
  app.addHook('onRequest', requestAudit.middleware.bind(requestAudit));
  app.register(rateLimit.plugin, rateLimit.options);

  app.register(cors, {
    origin: envConfig.CORS_ORIGIN,
    methods: [
      HttpMethodEnum.DELETE,
      HttpMethodEnum.PATCH,
      HttpMethodEnum.POST,
      HttpMethodEnum.PUT,
      HttpMethodEnum.GET,
    ],
  });

  app.register(appRouter.routes.bind(appRouter));

  return { app, logger, envConfig };
};
