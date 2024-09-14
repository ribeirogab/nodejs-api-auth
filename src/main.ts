import cors from '@fastify/cors';
import { fastify } from 'fastify';
import 'reflect-metadata';
import { container } from 'tsyringe';

import { EnvConfig } from './configs';
import { HttpMethodEnum } from './constants';
import './container';
import { ErrorHandler } from './errors/error-handler';
import { AppRouter } from './routers';

export const main = () => {
  const app = fastify({ logger: false });

  const errorHandler = container.resolve(ErrorHandler);
  const envConfig = container.resolve(EnvConfig);
  const appRouter = container.resolve(AppRouter);

  app.setErrorHandler(errorHandler.handle.bind(errorHandler));

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

  return { app, envConfig };
};
