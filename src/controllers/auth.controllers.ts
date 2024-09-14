import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { AuthService, AuthServiceDto } from '@/interfaces';

@injectable()
export class AuthController {
  constructor(
    @inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  public async auth(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as AuthServiceDto;

    const response = await this.authService.execute({ email, password });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }
}
