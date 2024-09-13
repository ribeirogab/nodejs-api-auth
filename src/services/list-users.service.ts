import { inject, injectable } from 'tsyringe';

import type { User, UserRepository } from '@/interfaces';

@injectable()
export class ListUsersService {
  constructor(
    @inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  public async execute(): Promise<User[]> {
    return this.userRepository.find();
  }
}
