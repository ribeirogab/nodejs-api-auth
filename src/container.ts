import { container } from 'tsyringe';

import { EmailAdapter, HashAdapter, UniqueIdAdapter } from './adapters';
import { EnvConfig } from './configs';
import { AuthController, RegisterController, UserController } from './controllers';
import { ErrorHandlingMiddleware } from './middlewares';
import { EmailTemplateRepository, RegisterTokenRepository, UserRepository } from './repositories';
import { AppRouter, AuthRouter, RegisterRouter, UserRouter } from './routers';
import { AuthService, CreateRegisterTokenService, CreateUserService, GetRegisterTokenService } from './services';

// Adapters
container.registerSingleton<UniqueIdAdapter>('UniqueIdAdapter', UniqueIdAdapter);
container.registerSingleton<EmailAdapter>('EmailAdapter', EmailAdapter);
container.registerSingleton<HashAdapter>('HashAdapter', HashAdapter);

// Configs
container.registerSingleton<EnvConfig>('EnvConfig', EnvConfig);

// Middlewares
container.registerSingleton<ErrorHandlingMiddleware>('ErrorHandlingMiddleware', ErrorHandlingMiddleware);

// Repositories
container.registerSingleton<RegisterTokenRepository>('RegisterTokenRepository', RegisterTokenRepository);
container.registerSingleton<EmailTemplateRepository>('EmailTemplateRepository', EmailTemplateRepository);
container.registerSingleton<UserRepository>('UserRepository', UserRepository);

// Services
container.registerSingleton<CreateRegisterTokenService>('CreateRegisterTokenService', CreateRegisterTokenService);
container.registerSingleton<GetRegisterTokenService>('GetRegisterTokenService', GetRegisterTokenService);
container.registerSingleton<CreateUserService>('CreateUserService', CreateUserService);
container.registerSingleton<AuthService>('AuthService', AuthService);

// Controllers
container.registerSingleton<RegisterController>('RegisterController', RegisterController);
container.registerSingleton<UserController>('UserController', UserController);
container.registerSingleton<AuthController>('AuthController', AuthController);

// Routers
container.registerSingleton<RegisterRouter>('RegisterRouter', RegisterRouter);
container.registerSingleton<UserRouter>('UserRouter', UserRouter);
container.registerSingleton<AuthRouter>('AuthRouter', AuthRouter);
container.registerSingleton<AppRouter>('AppRouter', AppRouter);
