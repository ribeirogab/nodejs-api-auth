import 'dotenv/config';
import { get } from 'env-var';
import { injectable } from 'tsyringe';

import { EmailProviderEnum, LoggerProviderEnum, NodeEnvEnum, StageEnum, UniqueIdProviderEnum } from '@/constants';
import { LogLevelKeyEnum } from '@/interfaces';

@injectable()
export class EnvConfig {
  public readonly NODE_ENV = get('NODE_ENV').default(NodeEnvEnum.Production).asEnum(Object.values(NodeEnvEnum));
  public readonly STAGE = get('STAGE').default(StageEnum.Prod).asEnum(Object.values(StageEnum));
  public readonly IS_DEBUG = this.NODE_ENV !== NodeEnvEnum.Production || this.STAGE === StageEnum.Dev;

  public readonly PORT = get('PORT').default(8080).asPortNumber();
  public readonly CORS_ORIGIN = get('CORS_ORIGIN').default('*').asString();
  public readonly JWT_SECRET = get('JWT_SECRET').required().asString();
  public readonly JWT_SECRET_VERIFICATION_TOKEN = get('JWT_SECRET_VERIFICATION_TOKEN').required().asString();
  public readonly APPLICATION_BASE_URL = get('APPLICATION_BASE_URL').required().asString();
  public readonly FRONTEND_CONFIRM_SIGN_UP_URL = get('FRONTEND_CONFIRM_SIGN_UP_URL').required().asString();
  public readonly FRONTEND_CONFIRM_SIGN_IN_URL = get('FRONTEND_CONFIRM_SIGN_IN_URL').required().asString();

  public readonly RATE_LIMIT_MAX = get('RATE_LIMIT_MAX').default(60).asIntPositive();
  public readonly RATE_LIMIT_TIME_WINDOW_MS = get('RATE_LIMIT_TIME_WINDOW_MS')
    .default(1000 * 60) // 1 minute
    .asIntPositive();

  public readonly AWS_REGION = get('AWS_REGION').default('us-east-1').asString();
  public readonly AWS_DYNAMO_TABLE_NAME = get('AWS_DYNAMO_TABLE_NAME').required().asString();

  public readonly GOOGLE_CLIENT_SECRET = get('GOOGLE_CLIENT_SECRET').required().asString();
  public readonly GOOGLE_CLIENT_ID = get('GOOGLE_CLIENT_ID').required().asString();
  public readonly GOOGLE_SSO_ENABLED = get('GOOGLE_SSO_ENABLED').default('true').asBool();

  public readonly EMAIL_PROVIDER = get('EMAIL_PROVIDER')
    .default(EmailProviderEnum.Resend)
    .asEnum(Object.values(EmailProviderEnum));

  public readonly DEFAULT_SENDER_EMAIL = get('DEFAULT_SENDER_EMAIL').required().asString();

  public readonly RESEND_API_KEY = get('RESEND_API_KEY')
    .required(this.EMAIL_PROVIDER === EmailProviderEnum.Resend)
    .asString();

  public readonly UNIQUE_ID_PROVIDER = get('UNIQUE_ID_PROVIDER')
    .default(UniqueIdProviderEnum.Uuid)
    .asEnum(Object.values(UniqueIdProviderEnum));

  public readonly LOGGER_PROVIDER = get('LOGGER_PROVIDER')
    .default(LoggerProviderEnum.Winston)
    .asEnum(Object.values(LoggerProviderEnum));

  public readonly LOG_LEVEL = get('LOG_LEVEL')
    .default(this.IS_DEBUG ? LogLevelKeyEnum.debug : LogLevelKeyEnum.info)
    .asEnum(Object.keys(LogLevelKeyEnum));
}
