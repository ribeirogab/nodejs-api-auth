import 'reflect-metadata';
import { container } from 'tsyringe';

import { CreateUserService } from './create-user.service';
import { AppErrorCodeEnum } from '@/constants';
import { RegisterTokenTypeEnum } from '@/interfaces';
import {
  RegisterTokenRepositoryMock,
  UserRepositoryMock,
} from '@tests/mocks/repositories';

const makeSut = () => {
  const registerTokenRepository = new RegisterTokenRepositoryMock();
  const userRepository = new UserRepositoryMock();

  container.registerInstance(
    'RegisterTokenRepository',
    registerTokenRepository,
  );

  container.registerInstance('UserRepository', userRepository);

  const sut = container.resolve(CreateUserService);

  return {
    registerTokenRepository,
    userRepository,
    sut,
  };
};

describe('CreateUserService', () => {
  it('should call userRepository.create with the correct user data', async () => {
    const { userRepository, registerTokenRepository, sut } = makeSut();

    const payload = {
      token: '123',
      user: {
        email: 'john@example.com',
        name: 'John Doe',
        password: '123',
      },
    };

    registerTokenRepository.findById.mockResolvedValueOnce({
      type: RegisterTokenTypeEnum.Email,
      external_id: payload.user.email,
      id: payload.token,
    });

    userRepository.findByEmail.mockResolvedValueOnce(null);

    await sut.execute(payload);

    expect(userRepository.create).toHaveBeenCalledWith(payload.user);
  });

  it('should throw an error if user with the same email already exists', async () => {
    const { userRepository, registerTokenRepository, sut } = makeSut();

    const payload = {
      token: '123',
      user: {
        email: 'john@example.com',
        name: 'John Doe',
        password: '123',
      },
    };

    registerTokenRepository.findById.mockResolvedValueOnce({
      type: RegisterTokenTypeEnum.Email,
      external_id: payload.user.email,
      id: payload.token,
    });

    userRepository.findByEmail.mockResolvedValueOnce({
      ...payload.user,
      id: '123',
    });

    await expect(sut.execute(payload)).rejects.toThrow(
      AppErrorCodeEnum.EmailAlreadyInUse,
    );
  });
});
