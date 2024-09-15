import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { AuthService, AuthServiceDto, LogoutService } from '@/interfaces';

@injectable()
export class AuthController {
  constructor(
    @inject('AuthService')
    private readonly authService: AuthService,

    @inject('LogoutService')
    private readonly logoutService: LogoutService,
  ) {}

  public async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as AuthServiceDto;

    const response = await this.authService.execute({ email, password });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }

  public async logout(_request: FastifyRequest, reply: FastifyReply) {
    await this.logoutService.execute({ user_id: '123' });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
