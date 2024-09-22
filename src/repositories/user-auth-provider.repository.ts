import {
  GetItemCommand,
  type GetItemInput,
  PutItemCommand,
  type PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { inject, injectable } from 'tsyringe';

import { type DynamoConfig, DynamoPartitionKeysEnum } from '@/configs';
import type {
  LoggerAdapter,
  UserAuthProvider,
  UserAuthProviderEnum,
  UserAuthProviderRepository as UserAuthProviderRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: user-auth-provider
 - SK: provider:{provider}::provider_id:{provider_id}
 - Content: { user_id, provider_id, provider, created_at }
 - TTL: INT
 */

@injectable()
export class UserAuthProviderRepository
  implements UserAuthProviderRepositoryInterface
{
  private readonly PK = DynamoPartitionKeysEnum.UserAuthProvider;

  constructor(
    @inject('DynamoConfig')
    private readonly dynamoConfig: DynamoConfig,

    @inject('LoggerAdapter')
    private readonly logger: LoggerAdapter,
  ) {
    this.logger.setPrefix(this.logger, UserAuthProviderRepository.name);
  }

  public async create({
    provider_id,
    provider,
    user_id,
  }: UserAuthProvider): Promise<void> {
    try {
      const userAuthProvider: UserAuthProvider = {
        provider_id,
        provider,
        user_id,
        created_at: new Date().toISOString(),
      };

      const params: PutItemCommandInput = {
        TableName: this.dynamoConfig.tableName,
        Item: marshall({
          PK: this.PK,
          SK: `provider:${provider}::provider_id:${provider_id}`,
          Content: userAuthProvider,
        }),
      };

      await this.dynamoConfig.client.send(new PutItemCommand(params));

      this.logger.info('Auth provider created:', userAuthProvider);
    } catch (error) {
      this.logger.error('Error creating auth provider:', error);

      throw error;
    }
  }

  public async findOne({
    provider_id,
    provider,
  }: {
    provider: UserAuthProviderEnum;
    provider_id: string;
  }): Promise<UserAuthProvider | null> {
    try {
      const params: GetItemInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: `provider:${provider}::provider_id:${provider_id}`,
        }),
      };

      const { Item } = await this.dynamoConfig.client.send(
        new GetItemCommand(params),
      );

      if (!Item) {
        return null;
      }

      const userAuthProvider = unmarshall(Item) as {
        Content: UserAuthProvider;
      };

      this.logger.debug('Auth provider retrieved:', userAuthProvider);

      return userAuthProvider.Content;
    } catch (error) {
      this.logger.error('Error retrieving verification code:', error);

      throw error;
    }
  }
}
