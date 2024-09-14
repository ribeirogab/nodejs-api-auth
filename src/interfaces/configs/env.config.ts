import type {
  EmailProviderEnum,
  NodeEnvEnum,
  StageEnum,
  UniqueIdProviderEnum,
} from '@/constants';

export type EnvConfig = {
  NODE_ENV: NodeEnvEnum;
  STAGE: StageEnum;
  PORT: number;
  CORS_ORIGIN: string;

  // Providers
  EMAIL_PROVIDER: EmailProviderEnum;
  UNIQUE_ID_PROVIDER: UniqueIdProviderEnum;
};
