import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { AuthController } from '@/controllers';
import type { Router } from '@/interfaces';
import type { EnsureAuthenticatedMiddleware } from '@/middlewares';

@injectable()
export class AuthRouter implements Router {
  constructor(
    @inject('AuthController')
    private readonly authController: AuthController,

    @inject('EnsureAuthenticatedMiddleware')
    private readonly ensureAuthenticatedMiddleware: EnsureAuthenticatedMiddleware,
  ) {}

  public routes(
    app: FastifyInstance,
    _?: unknown,
    done?: (err?: Error) => void,
  ) {
    app.post('/login', this.authController.login.bind(this.authController));

    app.route({
      handler: this.authController.login.bind(this.authController),
      url: '/login/refresh',
      method: 'POST',
      preHandler: this.ensureAuthenticatedMiddleware.middleware.bind(
        this.ensureAuthenticatedMiddleware,
      ),
    });

    app.delete('/logout', this.authController.logout.bind(this.authController));

    if (done) {
      done();
    }

    return app;
  }
}
