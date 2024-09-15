import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type {
  RegistrationConfirmService,
  RegistrationConfirmServiceDto,
  RegistrationService,
  User,
} from '@/interfaces';

@injectable()
export class RegistrationController {
  constructor(
    @inject('RegistrationService')
    private readonly registrationService: RegistrationService,

    @inject('RegistrationConfirmService')
    private readonly registrationConfirmService: RegistrationConfirmService,
  ) {}

  public async registration(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, password } = request.body as Omit<
      User,
      'id' | 'password_salt'
    >;

    await this.registrationService.execute({ email, name, password });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }

  public async registrationConfirm(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { code } = request.body as RegistrationConfirmServiceDto;

    await this.registrationConfirmService.execute({ code });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
