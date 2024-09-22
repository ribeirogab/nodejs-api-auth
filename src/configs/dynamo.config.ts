import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { inject, injectable } from 'tsyringe';

import type { EnvConfig } from './env.config';

export enum DynamoPartitionKeysEnum {
  VerificationCode = 'verification-code',
  UserAuthProvider = 'user-auth-provider',
  User = 'user',
}

export enum DynamoGSIEnum {
  ReferenceIdIndex = 'ReferenceIdIndex',
}

@injectable()
export class DynamoConfig {
  public readonly client: DynamoDBClient;
  public readonly tableName: string;

  constructor(@inject('EnvConfig') private readonly envConfig: EnvConfig) {
    this.client = new DynamoDBClient({ region: this.envConfig.AWS_REGION });
    this.tableName = this.envConfig.AWS_DYNAMO_TABLE_NAME;
  }

  public getTTL(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }
}
