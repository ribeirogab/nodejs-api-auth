import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { Router } from '@/interfaces';

@injectable()
export class AppRouter implements Router {
  constructor(@inject('UserRouter') private readonly userRouter: Router) {}

  public routes(app: FastifyInstance): FastifyInstance {
    app.get('/health', async (_, reply) =>
      reply.send().code(HttpStatusCodesEnum.OK),
    );

    app.register(this.userRouter.routes.bind(this.userRouter), {
      prefix: '/v1/users',
    });

    return app;
  }
}
