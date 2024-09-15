import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type {
  LoginService,
  LoginServiceDto,
  LogoutService,
  RefreshLoginService,
} from '@/interfaces';

@injectable()
export class AuthController {
  constructor(
    @inject('LoginService')
    private readonly loginService: LoginService,

    @inject('LogoutService')
    private readonly logoutService: LogoutService,

    @inject('RefreshLoginService')
    private readonly refreshLoginService: RefreshLoginService,
  ) {}

  public async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as LoginServiceDto;

    const response = await this.loginService.execute({ email, password });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }

  public async refreshLogin(request: FastifyRequest, reply: FastifyReply) {
    const { refresh_token: refreshToken } = request.body as {
      refresh_token: string;
    };

    const response = await this.refreshLoginService.execute({
      refresh_token: refreshToken,
    });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }

  public async logout(request: FastifyRequest, reply: FastifyReply) {
    await this.logoutService.execute({ user_id: request.user?.id });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
