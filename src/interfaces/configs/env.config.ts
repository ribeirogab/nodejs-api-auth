import type {
  EmailProviderEnum,
  HashProviderEnum,
  NodeEnvEnum,
  StageEnum,
  UniqueIdProviderEnum,
} from '@/constants';

export type EnvConfig = {
  NODE_ENV: NodeEnvEnum;
  STAGE: StageEnum;
  PORT: number;
  CORS_ORIGIN: string;

  EMAIL_PROVIDER: EmailProviderEnum;
  UNIQUE_ID_PROVIDER: UniqueIdProviderEnum;
  HASH_PROVIDER: HashProviderEnum;
  WEBSITE_BASE_URL: string;
};
