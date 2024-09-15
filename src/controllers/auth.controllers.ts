import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type { LoginService, LoginServiceDto, LogoutService } from '@/interfaces';

@injectable()
export class AuthController {
  constructor(
    @inject('LoginService')
    private readonly loginService: LoginService,

    @inject('LogoutService')
    private readonly logoutService: LogoutService,
  ) {}

  public async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as LoginServiceDto;

    const response = await this.loginService.execute({ email, password });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }

  public async logout(_request: FastifyRequest, reply: FastifyReply) {
    await this.logoutService.execute({ user_id: '123' });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
