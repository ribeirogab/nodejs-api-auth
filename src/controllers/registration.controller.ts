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
    const { email, name } = request.body as Omit<User, 'id'>;

    const response = await this.registrationService.execute({ email, name });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }

  public async registrationConfirm(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { code, token } = request.body as RegistrationConfirmServiceDto;

    await this.registrationConfirmService.execute({ code, token });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
