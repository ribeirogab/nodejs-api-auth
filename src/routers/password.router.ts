import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { PasswordController } from '@/controllers';
import type { Router } from '@/interfaces';

@injectable()
export class PasswordRouter implements Router {
  constructor(
    @inject('PasswordController')
    private readonly passwordController: PasswordController,
  ) {}

  public routes(
    app: FastifyInstance,
    _?: unknown,
    done?: (err?: Error) => void,
  ): FastifyInstance {
    app.post(
      '/recovery',
      this.passwordController.recovery.bind(this.passwordController),
    );

    app.post(
      '/recovery/verify',
      this.passwordController.recoveryVerify.bind(this.passwordController),
    );

    app.post(
      '/reset',
      this.passwordController.reset.bind(this.passwordController),
    );

    if (done) {
      done();
    }

    return app;
  }
}
