import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { RegistrationController } from '@/controllers';
import type { Router } from '@/interfaces';

@injectable()
export class RegistrationRouter implements Router {
  constructor(
    @inject('RegistrationController')
    private readonly registrationController: RegistrationController,
  ) {}

  public routes(
    app: FastifyInstance,
    _?: unknown,
    done?: (err?: Error) => void,
  ) {
    app.post(
      '/',
      {
        config: {
          rateLimit: {
            timeWindow: 1000 * 60, // 1 minute
            max: 2,
          },
        },
      },
      this.registrationController.registration.bind(
        this.registrationController,
      ),
    );

    app.post(
      '/confirm',
      this.registrationController.registrationConfirm.bind(
        this.registrationController,
      ),
    );

    if (done) {
      done();
    }

    return app;
  }
}
