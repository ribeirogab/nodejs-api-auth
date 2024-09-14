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

  public routes(app: FastifyInstance) {
    app.post('/', this.registerController.create.bind(this.registerController));

    app.get(
      '/:token',
      this.registerController.findById.bind(this.registerController),
    );

    return app;
  }
}
