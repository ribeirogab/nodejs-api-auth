import {
  DeleteItemCommand,
  type DeleteItemCommandInput,
  GetItemCommand,
  type GetItemCommandInput,
  PutItemCommand,
  type PutItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { inject, injectable } from 'tsyringe';

import type { DynamoConfig } from '@/configs';
import type {
  Session,
  SessionRepository as SessionRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: session
 - SK: user_id:{user_id}
 - Content: { access_token, refresh_token, expires_at, user_id }
 - TTL: INT
 */

@injectable()
export class SessionRepository implements SessionRepositoryInterface {
  private readonly PK = 'session';

  constructor(
    @inject('DynamoConfig')
    private readonly dynamoConfig: DynamoConfig,
  ) {}

  public async upsert(session: Session): Promise<Session> {
    const params: PutItemCommandInput = {
      TableName: this.dynamoConfig.tableName,
      Item: marshall({
        PK: this.PK,
        SK: `user_id:${session.user_id}`,
        Content: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          user_id: session.user_id,
        },
        TTL: this.dynamoConfig.getTTL(new Date(session.expires_at)),
      }),
    };

    await this.dynamoConfig.client.send(new PutItemCommand(params));

    return session;
  }

  public async deleteByUserId({ user_id }: { user_id: string }): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: this.dynamoConfig.tableName,
      Key: marshall({
        PK: this.PK,
        SK: `user_id:${user_id}`,
      }),
    };

    await this.dynamoConfig.client.send(new DeleteItemCommand(params));
  }

  public async findByUserId({
    user_id,
  }: {
    user_id: string;
  }): Promise<Session | null> {
    const params: GetItemCommandInput = {
      TableName: this.dynamoConfig.tableName,
      Key: marshall({
        PK: this.PK,
        SK: `user_id:${user_id}`,
      }),
    };

    const { Item } = await this.dynamoConfig.client.send(
      new GetItemCommand(params),
    );

    if (!Item) {
      return null;
    }

    const session = unmarshall(Item).Content as Session;

    return session;
  }
}
