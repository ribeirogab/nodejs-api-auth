import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { CreateUserService, User } from '@/interfaces';
import type { UserRepository } from '@/repositories';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserService')
    private readonly createUserService: CreateUserService,

    @inject('UserRepository')
    private readonly userRepository: UserRepository,
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

  // Temporarily route to get all users
  public find(_: FastifyRequest, reply: FastifyReply) {
    const data = this.userRepository.find();

    return reply.code(HttpStatusCodesEnum.OK).send(data);
  }
}
