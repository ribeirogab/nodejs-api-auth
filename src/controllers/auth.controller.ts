import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type {
  LoginConfirmService,
  LoginConfirmServiceDto,
  LoginService,
  LoginServiceDto,
  LogoutService,
  RefreshLoginService,
} from '@/interfaces';

@injectable()
export class AuthController {
  constructor(
    @inject('RefreshLoginService')
    private readonly refreshLoginService: RefreshLoginService,

    @inject('LoginConfirmService')
    private readonly loginConfirmService: LoginConfirmService,

    @inject('LogoutService')
    private readonly logoutService: LogoutService,

    @inject('LoginService')
    private readonly loginService: LoginService,
  ) {}

  public async login(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as LoginServiceDto;

    const response = await this.loginService.execute({ email });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }

  public async loginConfirm(request: FastifyRequest, reply: FastifyReply) {
    const { code, token } = request.body as LoginConfirmServiceDto;

    const response = await this.loginConfirmService.execute({ code, token });

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
