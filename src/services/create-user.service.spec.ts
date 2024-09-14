import 'reflect-metadata';
import { container } from 'tsyringe';

import { CreateUserService } from './create-user.service';
import { AppErrorCodeEnum, HttpStatusCodesEnum } from '@/constants';
import { AppError } from '@/errors';
import { RegisterTokenTypeEnum } from '@/interfaces';
import {
  HashAdapterMock,
  RegisterTokenRepositoryMock,
  UserRepositoryMock,
} from '@tests/mocks';

const makeSut = () => {
  const registerTokenRepository = new RegisterTokenRepositoryMock();
  const userRepository = new UserRepositoryMock();
  const hashAdapterMock = new HashAdapterMock();

  container.registerInstance(
    'RegisterTokenRepository',
    registerTokenRepository,
  );

  container.registerInstance('UserRepository', userRepository);

  container.registerInstance('HashAdapter', hashAdapterMock);

  const sut = container.resolve(CreateUserService);

  return {
    registerTokenRepository,
    userRepository,
    hashAdapterMock,
    sut,
  };
};

describe('CreateUserService', () => {
  const payload = {
    token: '123',
    user: {
      email: 'john@example.com',
      name: 'John Doe',
      password: '123',
    },
  };

  it('should call userRepository.create with the correct user data', async () => {
    const { userRepository, registerTokenRepository, hashAdapterMock, sut } =
      makeSut();

    registerTokenRepository.findById.mockResolvedValueOnce({
      type: RegisterTokenTypeEnum.Email,
      external_id: payload.user.email,
      id: payload.token,
    });

    userRepository.findByEmail.mockResolvedValueOnce(null);

    const salt = 'randomSalt';
    const hashedPassword = 'hashedPassword';

    hashAdapterMock.generateSalt.mockReturnValueOnce(salt);
    hashAdapterMock.hash.mockReturnValueOnce(hashedPassword);

    await sut.execute(payload);

    expect(userRepository.create).toHaveBeenCalledWith({
      ...payload.user,
      password: hashedPassword,
      password_salt: salt,
    });
  });

  it('should throw an error if user with the same email already exists', async () => {
    const { userRepository, registerTokenRepository, sut } = makeSut();

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

  it('should throw an error if the token is not found', async () => {
    const { registerTokenRepository, sut } = makeSut();

    registerTokenRepository.findById.mockResolvedValueOnce(null);

    await expect(sut.execute(payload)).rejects.toThrow(
      new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      }),
    );
  });

  it('should throw an error if the token email does not match the user email', async () => {
    const { registerTokenRepository, sut } = makeSut();

    registerTokenRepository.findById.mockResolvedValueOnce({
      type: RegisterTokenTypeEnum.Email,
      external_id: 'wrong@example.com', // Different email
      id: payload.token,
    });

    await expect(sut.execute(payload)).rejects.toThrow(
      new AppError({
        status_code: HttpStatusCodesEnum.UNAUTHORIZED,
        message: 'Unauthorized',
      }),
    );
  });

  it('should throw an error if userRepository.create fails', async () => {
    const { userRepository, registerTokenRepository, sut } = makeSut();

    registerTokenRepository.findById.mockResolvedValueOnce({
      type: RegisterTokenTypeEnum.Email,
      external_id: payload.user.email,
      id: payload.token,
    });

    userRepository.findByEmail.mockResolvedValueOnce(null);

    userRepository.create.mockRejectedValueOnce(new Error('Database error'));

    await expect(sut.execute(payload)).rejects.toThrow('Database error');
  });

  it('should hash the password and generate a salt', async () => {
    const { registerTokenRepository, hashAdapterMock, sut } = makeSut();

    registerTokenRepository.findById.mockResolvedValueOnce({
      type: RegisterTokenTypeEnum.Email,
      external_id: payload.user.email,
      id: payload.token,
    });

    const salt = 'randomSalt';
    const hashedPassword = 'hashedPassword';

    hashAdapterMock.generateSalt.mockReturnValueOnce(salt);
    hashAdapterMock.hash.mockResolvedValueOnce(hashedPassword);

    await sut.execute(payload);

    expect(hashAdapterMock.generateSalt).toHaveBeenCalled();

    expect(hashAdapterMock.hash).toHaveBeenCalledWith({
      text: payload.user.password,
      salt,
    });
  });
});
