import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { AuthController } from '@/controllers';
import type { Router } from '@/interfaces';
import type { EnsureAuthenticatedMiddleware } from '@/middlewares';
import { loginConfirmSchema, loginRefreshSchema, loginSchema } from '@/schemas';

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
    app.post(
      '/login',
      { schema: loginSchema },
      this.authController.login.bind(this.authController),
    );

    app.post(
      '/login/confirm',
      { schema: loginConfirmSchema },
      this.authController.loginConfirm.bind(this.authController),
    );

    app.post(
      '/login/refresh',
      {
        schema: loginRefreshSchema,
        preHandler: [
          this.ensureAuthenticatedMiddleware.middleware.bind(
            this.ensureAuthenticatedMiddleware,
          ),
        ],
      },
      this.authController.refreshLogin.bind(this.authController),
    );

    app.post(
      '/logout',
      {
        preHandler: [
          this.ensureAuthenticatedMiddleware.middleware.bind(
            this.ensureAuthenticatedMiddleware,
          ),
        ],
      },
      this.authController.logout.bind(this.authController),
    );

    if (done) {
      done();
    }

    return app;
  }
}
