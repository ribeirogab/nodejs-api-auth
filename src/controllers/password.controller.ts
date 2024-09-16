import type { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';

import { HttpStatusCodesEnum } from '@/constants';

@injectable()
export class PasswordController {
  public recovery(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }

  public recoveryVerify(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }

  public reset(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(HttpStatusCodesEnum.NO_CONTENT).send();
  }
}
