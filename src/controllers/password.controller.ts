import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type {
  RecoveryPasswordService,
  RecoveryPasswordVerifyService,
  ResetPasswordService,
  ResetPasswordServiceDto,
} from '@/interfaces';

@injectable()
export class PasswordController {
  constructor(
    @inject('RecoveryPasswordVerifyService')
    private readonly recoveryPasswordVerifyService: RecoveryPasswordVerifyService,

    @inject('RecoveryPasswordService')
    private readonly recoveryPasswordService: RecoveryPasswordService,

    @inject('ResetPasswordService')
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  public async recovery(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as { email: string };

    await this.recoveryPasswordService.execute({ email });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }

  public async recoveryVerify(request: FastifyRequest, reply: FastifyReply) {
    const { code } = request.body as { code: string };

    await this.recoveryPasswordVerifyService.execute({ code });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }

  public async reset(request: FastifyRequest, reply: FastifyReply) {
    const { code, email, password } = request.body as ResetPasswordServiceDto;

    await this.resetPasswordService.execute({ code, email, password });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
