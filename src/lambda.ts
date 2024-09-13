import { type PromiseHandler, awsLambdaFastify } from '@fastify/aws-lambda';

import { main } from './main';

let app: PromiseHandler;

const proxy = async () => {
  if (app) {
    return app;
  }

  app = awsLambdaFastify(main().app);

  return app;
};

export const handler = proxy;
