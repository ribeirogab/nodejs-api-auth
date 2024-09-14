import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { CreateUserService, User } from '@/interfaces';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserService')
    private readonly createUserService: CreateUserService,
  ) {}

  public async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, password } = request.body as Omit<User, 'id'>;
    const { token } = request.query as { token: string };

    await this.createUserService.execute({
      token,
      user: {
        password,
        email,
        name,
      },
    });

    return reply.code(HttpStatusCodesEnum.CREATED).send();
  }
}
