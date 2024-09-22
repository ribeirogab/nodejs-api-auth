import {
  GetItemCommand,
  type GetItemInput,
  PutItemCommand,
  type PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { type DynamoConfig, DynamoPartitionKeysEnum } from '@/configs';
import {
  type LoggerAdapter,
  type UniqueIdAdapter,
  type User,
  type UserRepository as UserRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: user
 - SK: id:{id}
 - Content: { name, email, id, created_at }
 - TTL: INT
 */

@injectable()
export class UserRepository implements UserRepositoryInterface {
  private readonly PK = DynamoPartitionKeysEnum.User;
  private readonly schema: z.ZodType<Omit<User, 'id'>> = z.object({
    email: z.string().email().optional(),
    name: z.string().min(2).max(255),
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

  public async findOne({ id }: { id: string }): Promise<User | null> {
    try {
      const params: GetItemInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: `id:${id}`,
        }),
      };

      const { Item } = await this.dynamoConfig.client.send(
        new GetItemCommand(params),
      );

      if (!Item) {
        return null;
      }

      const user = unmarshall(Item) as {
        Content: User;
      };

      this.logger.debug('User data retrieved:', user);

      return user.Content;
    } catch (error) {
      this.logger.error('Error retrieving verification code:', error);

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
