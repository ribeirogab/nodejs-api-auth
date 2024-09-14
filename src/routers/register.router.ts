import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { RegisterController } from '@/controllers';
import type { Router } from '@/interfaces';

@injectable()
export class RegisterRouter implements Router {
  constructor(
    @inject('RegisterController')
    private readonly registerController: RegisterController,
  ) {}

  public routes(
    app: FastifyInstance,
    _?: unknown,
    done?: (err?: Error) => void,
  ) {
    // Temporarily route to get all tokens
    app.get('/', this.registerController.find.bind(this.registerController));

    app.post('/', this.registerController.create.bind(this.registerController));

    app.get(
      '/:token',
      this.registerController.findById.bind(this.registerController),
    );

    if (done) {
      done();
    }

    return app;
  }
}
