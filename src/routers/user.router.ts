import type { FastifyInstance } from 'fastify';
import { inject, injectable } from 'tsyringe';

import type { UserController } from '@/controllers';
import type { Router, User } from '@/interfaces';

@injectable()
export class UserRouter implements Router {
  constructor(
    @inject('UserController') private readonly userController: UserController,
  ) {}

  public routes(app: FastifyInstance) {
    app.get('/', this.userController.list.bind(this.userController));

    app.post<{ Body: User }>(
      '/',
      this.userController.create.bind(this.userController),
    );

    return app;
  }
}
