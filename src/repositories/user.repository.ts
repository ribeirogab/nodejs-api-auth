import {
  PutItemCommand,
  type PutItemCommandInput,
  QueryCommand,
  type QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

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
 - Content: { name, email, id, created_at }
 - TTL: INT
 */

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private readonly PK = DynamoPartitionKeysEnum.User;
  private readonly schema: z.ZodType<Omit<User, 'id'>> = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
  });

  constructor(
    @inject('UniqueIdAdapter')
    private readonly uniqueIdAdapter: UniqueIdAdapter,

    @inject('DynamoConfig')
    private readonly dynamoConfig: DynamoConfig,

    @inject('LoggerAdapter')
    private readonly logger: LoggerAdapter,
  ) {
    this.logger.setPrefix(this.logger, UserRepository.name);
  }

  public async create(dto: Omit<User, 'id'>): Promise<User> {
    try {
      const { data: parsedUser } = this.parse(dto);

      const user: User = {
        id: this.uniqueIdAdapter.generate(),
        ...parsedUser,
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

  private parse(user: Omit<User, 'id'>): {
    data: Omit<User, 'id'>;
    success: boolean;
  } {
    const { success, data, error } = this.schema.safeParse(user);

    if (!success || !data) {
      throw new Error(error?.message || 'Error parsing user');
    }

    return { success, data };
  }
}
