import type { NodeEnvEnum, StageEnum } from '@/constants';

export type EnvConfig = {
  NODE_ENV: NodeEnvEnum;
  STAGE: StageEnum;
  PORT: number;
  CORS_ORIGIN: string;
};
