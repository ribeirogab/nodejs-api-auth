import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { UserController } from '@/controllers';
import type { Router } from '@/interfaces';

@injectable()
export class UserRouter implements Router {
  constructor(
    @inject('UserController') private readonly userController: UserController,
  ) {}

  public routes(
    app: FastifyInstance,
    _?: unknown,
    done?: (err?: Error) => void,
  ) {
    // Temporarily route to get all users
    app.get('/', this.userController.find.bind(this.userController));

    app.post('/', this.userController.create.bind(this.userController));

    if (done) {
      done();
    }

    return app;
  }
}
