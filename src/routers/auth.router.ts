import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { AuthController } from '@/controllers';
import type { Router } from '@/interfaces';

@injectable()
export class AuthRouter implements Router {
  constructor(
    @inject('AuthController')
    private readonly authController: AuthController,
  ) {}

  public routes(
    app: FastifyInstance,
    _?: unknown,
    done?: (err?: Error) => void,
  ) {
    app.post('/login', this.authController.login.bind(this.authController));

    app.delete('/logout', this.authController.logout.bind(this.authController));

    if (done) {
      done();
    }

    return app;
  }
}
