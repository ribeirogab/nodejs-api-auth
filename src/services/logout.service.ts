import { inject, injectable } from 'tsyringe';

import type {
  LogoutServiceDto,
  LogoutService as LogoutServiceInterface,
  SessionRepository,
} from '@/interfaces';

@injectable()
export class LogoutService implements LogoutServiceInterface {
  constructor(
    @inject('SessionRepository')
    private sessionRepository: SessionRepository,
  ) {}

  async execute({ user_id }: LogoutServiceDto): Promise<void> {
    await this.sessionRepository.deleteByUserId({ user_id });
  }
}
