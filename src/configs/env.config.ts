import 'dotenv/config';
import { get } from 'env-var';
import { injectable } from 'tsyringe';

import {
  EmailProviderEnum,
  NodeEnvEnum,
  StageEnum,
  UniqueIdProviderEnum,
} from '@/constants';
import type { EnvConfig as EnvConfigInterface } from '@/interfaces';

@injectable()
export class EnvConfig implements EnvConfigInterface {
  public readonly NODE_ENV = get('NODE_ENV')
    .default(NodeEnvEnum.Production)
    .asEnum(Object.values(NodeEnvEnum));

  public readonly STAGE = get('STAGE')
    .default(StageEnum.Prod)
    .asEnum(Object.values(StageEnum));

  public readonly PORT = get('PORT').default(8080).asPortNumber();
  public readonly CORS_ORIGIN = get('CORS_ORIGIN').default('*').asString();

  public readonly EMAIL_PROVIDER = get('EMAIL_PROVIDER')
    .default(EmailProviderEnum.Resend)
    .asEnum(Object.values(EmailProviderEnum));

  public readonly UNIQUE_ID_PROVIDER = get('UNIQUE_ID_PROVIDER')
    .default(UniqueIdProviderEnum.Uuid)
    .asEnum(Object.values(UniqueIdProviderEnum));
}
