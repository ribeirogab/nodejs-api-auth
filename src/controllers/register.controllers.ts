import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';
import type {
  CreateRegisterTokenService,
  CreateRegisterTokenServiceDto,
  GetRegisterTokenService,
} from '@/interfaces';

@injectable()
export class RegisterController {
  constructor(
    @inject('CreateRegisterTokenService')
    private readonly createRegisterTokenService: CreateRegisterTokenService,
    @inject('GetRegisterTokenService')
    private readonly getRegisterTokenService: GetRegisterTokenService,
  ) {}

  public async create(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as CreateRegisterTokenServiceDto;

    await this.createRegisterTokenService.execute({ email });

    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }

  public async findById(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    const response = await this.getRegisterTokenService.execute({ token });

    return reply.code(HttpStatusCodesEnum.OK).send(response);
  }
}
