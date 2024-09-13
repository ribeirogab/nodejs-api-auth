import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { User } from '@/interfaces';
import type { CreateUserService, ListUsersService } from '@/services';

@injectable()
export class UserController {
  constructor(
    @inject('CreateUserService')
    private readonly createUserService: CreateUserService,
    @inject('ListUsersService') private readonly listUsers: ListUsersService,
  ) {}

  public async create(request: FastifyRequest, reply: FastifyReply) {
    await this.createUserService.execute(request.body as Omit<User, 'id'>);

    return reply.code(HttpStatusCodesEnum.CREATED).send();
  }

  public async list(_request: FastifyRequest, reply: FastifyReply) {
    const users = await this.listUsers.execute();

    return reply.code(HttpStatusCodesEnum.OK).send(users);
  }
}
