import { container } from 'tsyringe';

import { EmailAdapter, LoggerAdapter, UniqueIdAdapter } from './adapters';
import { DynamoConfig, EnvConfig, JwtConfig, RateLimit } from './configs';
import { AuthController, RegistrationController } from './controllers';
import { AuthHelper } from './helpers';
import { EnsureAuthenticatedMiddleware, ErrorHandlingMiddleware, RequestAuditMiddleware } from './middlewares';
import { EmailTemplateRepository, SessionRepository, UserRepository, VerificationCodeRepository } from './repositories';
import { AppRouter, AuthRouter, RegistrationRouter } from './routers';
import {
  LoginConfirmService,
  LoginService,
  LogoutService,
  RefreshLoginService,
  RegistrationConfirmService,
  RegistrationService,
  ResetPasswordService,
} from './services';

// Adapters
container.registerSingleton<UniqueIdAdapter>('UniqueIdAdapter', UniqueIdAdapter);
container.registerSingleton<LoggerAdapter>('LoggerAdapter', LoggerAdapter);
container.registerSingleton<EmailAdapter>('EmailAdapter', EmailAdapter);

// Configs
container.registerSingleton<DynamoConfig>('DynamoConfig', DynamoConfig);
container.registerSingleton<EnvConfig>('EnvConfig', EnvConfig);
container.registerSingleton<JwtConfig>('JwtConfig', JwtConfig);
container.registerSingleton<RateLimit>('RateLimit', RateLimit);

// Helpers
container.registerSingleton<AuthHelper>('AuthHelper', AuthHelper);

// Middlewares
container.registerSingleton<EnsureAuthenticatedMiddleware>('EnsureAuthenticatedMiddleware', EnsureAuthenticatedMiddleware);
container.registerSingleton<ErrorHandlingMiddleware>('ErrorHandlingMiddleware', ErrorHandlingMiddleware);
container.registerSingleton<RequestAuditMiddleware>('RequestAuditMiddleware', RequestAuditMiddleware);

// Repositories
container.registerSingleton<VerificationCodeRepository>('VerificationCodeRepository', VerificationCodeRepository);
container.registerSingleton<EmailTemplateRepository>('EmailTemplateRepository', EmailTemplateRepository);
container.registerSingleton<SessionRepository>('SessionRepository', SessionRepository);
container.registerSingleton<UserRepository>('UserRepository', UserRepository);

// Services
container.registerSingleton<RegistrationConfirmService>('RegistrationConfirmService', RegistrationConfirmService);
container.registerSingleton<ResetPasswordService>('ResetPasswordService', ResetPasswordService);
container.registerSingleton<RegistrationService>('RegistrationService', RegistrationService);
container.registerSingleton<RefreshLoginService>('RefreshLoginService', RefreshLoginService);
container.registerSingleton<LoginConfirmService>('LoginConfirmService', LoginConfirmService);
container.registerSingleton<LogoutService>('LogoutService', LogoutService);
container.registerSingleton<LoginService>('LoginService', LoginService);

// Controllers
container.registerSingleton<RegistrationController>('RegistrationController', RegistrationController);
container.registerSingleton<AuthController>('AuthController', AuthController);

// Routers
container.registerSingleton<RegistrationRouter>('RegistrationRouter', RegistrationRouter);
container.registerSingleton<AuthRouter>('AuthRouter', AuthRouter);
container.registerSingleton<AppRouter>('AppRouter', AppRouter);
