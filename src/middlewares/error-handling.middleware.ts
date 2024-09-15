import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { ZodError } from 'zod';

import { HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import type { ErrorMiddleware, LoggerAdapter } from '@/interfaces';

@injectable()
export class ErrorHandlingMiddleware implements ErrorMiddleware {
  constructor(@inject('LoggerAdapter') private readonly logger: LoggerAdapter) {
    this.logger.setPrefix(this.logger, ErrorHandlingMiddleware.name);
  }

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

      this.logger.error('Payload validation error', errorBody);

      return reply.status(errorBody.status_code).send({
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        message: 'Payload validation error',
        details: error.issues,
      });
    }

    if (
      error.statusCode &&
      error.statusCode !== HttpStatusCodesEnum.INTERNAL_SERVER_ERROR
    ) {
      const errorBody = {
        status_code: error.statusCode,
        message: error.message,
      };

      this.logger.error('Fastify error', errorBody);

      return reply.status(error.statusCode).send(errorBody);
    }

    console.error('Unknown error', error);

    return reply.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
      status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
