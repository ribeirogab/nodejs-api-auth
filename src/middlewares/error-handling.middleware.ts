import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'tsyringe';
import { ZodError } from 'zod';

import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type { ErrorMiddleware } from '@/interfaces';

@injectable()
export class ErrorHandlingMiddleware implements ErrorMiddleware {
  public async middleware(
    error: FastifyError,
    _request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    if (error instanceof AppError) {
      return reply.status(error.status_code).send({
        status_code: error.status_code,
        message: error.message,
        details: error.details,
      });
    }

    if (error instanceof ZodError) {
      const errorBody = {
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        message: 'Payload validation error',
        details: error.issues,
      };

      console.error('Payload validation error', errorBody);

      return reply.status(errorBody.status_code).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        message: 'Payload validation error',
        details: error.issues,
      });
    }

    console.error('Unknown error', error);

    return reply.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
      status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
