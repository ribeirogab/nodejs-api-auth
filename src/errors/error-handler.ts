import { injectable } from 'tsyringe';
import { ZodError } from 'zod';

import { AppError } from './app.error';
import { HttpStatusCodesEnum } from '@/constants';

@injectable()
export class ErrorHandler {
  public handle(error: unknown) {
    if (error instanceof AppError) {
      console.error(error);

      return error;
    }

    if (error instanceof ZodError) {
      const errorBody = {
        status_code: HttpStatusCodesEnum.BAD_REQUEST,
        message: 'Payload validation error',
        details: error.issues,
      };

      console.error('Payload validation error', errorBody);

      return new AppError(errorBody);
    }

    console.error('Unknown error', error);

    return new AppError({
      status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
