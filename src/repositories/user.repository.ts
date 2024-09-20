import {
  PutItemCommand,
  type PutItemCommandInput,
  QueryCommand,
  type QueryCommandInput,
  UpdateItemCommand,
  type UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { inject, injectable } from 'tsyringe';

import {
  type DynamoConfig,
  DynamoGSIEnum,
  DynamoPartitionKeysEnum,
} from '@/configs';
import type {
  LoggerAdapter,
  UniqueIdAdapter,
  User,
  UserRepository as UserRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: user
 - SK: id:{id}
 - ReferenceId: [reference_type]:{reference_value}
 - Content: { name, email, password, id, created_at }
 - TTL: INT
 */

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private readonly PK = DynamoPartitionKeysEnum.User;

  constructor(
    @inject('UniqueIdAdapter')
    private readonly uniqueIdAdapter: UniqueIdAdapter,

    @inject('DynamoConfig') private readonly dynamoConfig: DynamoConfig,

    @inject('LoggerAdapter') private readonly logger: LoggerAdapter,
  ) {
    this.logger.setPrefix(this.logger, UserRepository.name);
  }

  public async create(dto: Omit<User, 'id'>): Promise<User> {
    try {
      const user: User = {
        id: this.uniqueIdAdapter.generate(),
        ...dto,
        created_at: new Date().toISOString(),
      };

      const params: PutItemCommandInput = {
        TableName: this.dynamoConfig.tableName,
        Item: marshall({
          PK: this.PK,
          SK: `id:${user.id}`,
          ReferenceId: `email:${user.email}`,
          Content: user,
        }),
      };

      await this.dynamoConfig.client.send(new PutItemCommand(params));

      this.logger.debug('User created:', user);

      return user;
    } catch (error) {
      this.logger.error('Error creating user:', error);

      throw error;
    }
  }

  public async findByEmail(dto: { email: string }): Promise<User | null> {
    try {
      const params: QueryCommandInput = {
        TableName: this.dynamoConfig.tableName,
        IndexName: DynamoGSIEnum.ReferenceIdIndex,
        KeyConditionExpression: 'PK = :pk AND ReferenceId = :reference',
        ExpressionAttributeValues: marshall({
          ':pk': this.PK,
          ':reference': `email:${dto.email}`,
        }),
      };

      const { Items } = await this.dynamoConfig.client.send(
        new QueryCommand(params),
      );

      if (!Items || Items.length === 0) {
        return null;
      }

      const user = unmarshall(Items[0]) as { Content: User };

      this.logger.debug('User found by email:', user);

      return user.Content;
    } catch (error) {
      this.logger.error('Error finding user by email:', error);

      throw error;
    }
  }

  public async updateByEmail({
    update,
    email,
  }: {
    update: Partial<Omit<User, 'id' | 'email' | 'created_at'>>;
    email: string;
  }): Promise<void> {
    try {
      const user = await this.findByEmail({ email });

      if (!user) {
        return this.logger.warn('User not found for update:', email);
      }

      const updateExpressions: string[] = [];
      const expressionAttributeValues: Record<string, unknown> = {};
      const expressionAttributeNames: Record<string, string> = {};

      for (const [key, value] of Object.entries(update)) {
        const attributeName = `#${key}`;
        const attributeValue = `:${key}`;

        updateExpressions.push(`Content.${attributeName} = ${attributeValue}`);
        expressionAttributeValues[attributeValue] = value;
        expressionAttributeNames[attributeName] = key;
      }

      const params: UpdateItemCommandInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: `id:${user.id}`,
        }),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'UPDATED_NEW',
      };

      await this.dynamoConfig.client.send(new UpdateItemCommand(params));

      this.logger.debug('User updated');
    } catch (error) {
      this.logger.error('Error updating user:', error);

      throw error;
    }
  }
}
