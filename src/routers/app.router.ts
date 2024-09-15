import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { Router } from '@/interfaces';

@injectable()
export class AppRouter implements Router {
  constructor(
    @inject('RegistrationRouter') private readonly registrationRouter: Router,

    @inject('AuthRouter') private readonly authRouter: Router,
  ) {}

  public routes(
    app: FastifyInstance,
    _options?: unknown,
    done?: (err?: Error) => void,
  ): FastifyInstance {
    app.get('/health', async (_, reply) =>
      reply.send().code(HttpStatusCodesEnum.OK),
    );

    app.register(this.registrationRouter.routes.bind(this.registrationRouter), {
      prefix: '/v1/registration',
    });

    app.register(this.authRouter.routes.bind(this.authRouter), {
      prefix: '/v1/auth',
    });

    if (done) {
      done();
    }

    return app;
  }
}
