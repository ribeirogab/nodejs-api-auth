import { container } from 'tsyringe';

import { EmailAdapter, HashAdapter, LoggerAdapter, UniqueIdAdapter } from './adapters';
import { EnvConfig, JwtConfig } from './configs';
import { AuthController, RegisterController, UserController } from './controllers';
import { AuthHelper } from './helpers';
import { ErrorHandlingMiddleware } from './middlewares';
import { EmailTemplateRepository, RegisterTokenRepository, SessionRepository, UserRepository } from './repositories';
import { AppRouter, AuthRouter, RegisterRouter, UserRouter } from './routers';
import {
  CreateRegisterTokenService,
  CreateUserService,
  GetRegisterTokenService,
  LoginService,
  LogoutService,
  RefreshLoginService,
} from './services';

// Adapters
container.registerSingleton<UniqueIdAdapter>('UniqueIdAdapter', UniqueIdAdapter);
container.registerSingleton<LoggerAdapter>('LoggerAdapter', LoggerAdapter);
container.registerSingleton<EmailAdapter>('EmailAdapter', EmailAdapter);
container.registerSingleton<HashAdapter>('HashAdapter', HashAdapter);

// Configs
container.registerSingleton<EnvConfig>('EnvConfig', EnvConfig);
container.registerSingleton<JwtConfig>('JwtConfig', JwtConfig);

// Helpers
container.registerSingleton<AuthHelper>('AuthHelper', AuthHelper);

// Middlewares
container.registerSingleton<ErrorHandlingMiddleware>('ErrorHandlingMiddleware', ErrorHandlingMiddleware);

// Repositories
container.registerSingleton<RegisterTokenRepository>('RegisterTokenRepository', RegisterTokenRepository);
container.registerSingleton<EmailTemplateRepository>('EmailTemplateRepository', EmailTemplateRepository);
container.registerSingleton<RefreshLoginService>('RefreshLoginService', RefreshLoginService);
container.registerSingleton<SessionRepository>('SessionRepository', SessionRepository);
container.registerSingleton<UserRepository>('UserRepository', UserRepository);

// Services
container.registerSingleton<CreateRegisterTokenService>('CreateRegisterTokenService', CreateRegisterTokenService);
container.registerSingleton<GetRegisterTokenService>('GetRegisterTokenService', GetRegisterTokenService);
container.registerSingleton<CreateUserService>('CreateUserService', CreateUserService);
container.registerSingleton<LogoutService>('LogoutService', LogoutService);
container.registerSingleton<LoginService>('LoginService', LoginService);

// Controllers
container.registerSingleton<RegisterController>('RegisterController', RegisterController);
container.registerSingleton<UserController>('UserController', UserController);
container.registerSingleton<AuthController>('AuthController', AuthController);

// Routers
container.registerSingleton<RegisterRouter>('RegisterRouter', RegisterRouter);
container.registerSingleton<UserRouter>('UserRouter', UserRouter);
container.registerSingleton<AuthRouter>('AuthRouter', AuthRouter);
container.registerSingleton<AppRouter>('AppRouter', AppRouter);
