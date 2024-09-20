import {
  DeleteItemCommand,
  type DeleteItemCommandInput,
  GetItemCommand,
  type GetItemInput,
  PutItemCommand,
  type PutItemInput,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { inject, injectable } from 'tsyringe';

import { type DynamoConfig, DynamoPartitionKeysEnum } from '@/configs';
import type {
  LoggerAdapter,
  VerificationCode,
  VerificationCodeRepositoryFilterDto,
  VerificationCodeRepositoryFindOneByContentDto,
  VerificationCodeRepository as VerificationCodeRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: verification-code
 - SK: type:{type}::code:{code}
 - Content: { code, type, expires_at, data }
 - TTL: INT
 */

@injectable()
export class VerificationCodeRepository
  implements VerificationCodeRepositoryInterface
{
  private readonly PK = DynamoPartitionKeysEnum.VerificationCode;

  constructor(
    @inject('DynamoConfig') private readonly dynamoConfig: DynamoConfig,
    @inject('LoggerAdapter') private readonly logger: LoggerAdapter,
  ) {
    this.logger.setPrefix(this.logger, VerificationCodeRepository.name);
  }

  public async create(
    dto: Omit<VerificationCode, 'code'>,
  ): Promise<VerificationCode> {
    try {
      const code = this.generateCode(6);
      const verificationCode = { ...dto, code };

      const params: PutItemInput = {
        TableName: this.dynamoConfig.tableName,
        Item: marshall({
          PK: this.PK,
          SK: `type:${dto.type}::code:${code}`,
          TTL: this.dynamoConfig.getTTL(new Date(dto.expires_at)),
          Content: {
            ...verificationCode.data,
            expires_at: verificationCode.expires_at,
            code: verificationCode.code,
            type: verificationCode.type,
          },
        }),
      };

      await this.dynamoConfig.client.send(new PutItemCommand(params));

      this.logger.debug('Verification code created:', verificationCode);

      return verificationCode;
    } catch (error) {
      this.logger.error('Error creating verification code:', error);

      throw error;
    }
  }

  public async findOne({
    code,
    type,
  }: VerificationCodeRepositoryFilterDto): Promise<VerificationCode | null> {
    try {
      const params: GetItemInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: `type:${type}::code:${code}`,
        }),
      };

      const { Item } = await this.dynamoConfig.client.send(
        new GetItemCommand(params),
      );

      if (!Item) {
        return null;
      }

      const verificationCode = unmarshall(Item) as VerificationCode;

      this.logger.debug('Verification code retrieved:', verificationCode);

      return verificationCode;
    } catch (error) {
      this.logger.error('Error retrieving verification code:', error);

      throw error;
    }
  }

  public async findOneByContent({
    content,
    type,
  }: VerificationCodeRepositoryFindOneByContentDto): Promise<VerificationCode | null> {
    try {
      const params: QueryCommandInput = {
        TableName: this.dynamoConfig.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :type)',
        FilterExpression: 'contains(Content.#key, :value)',
        ExpressionAttributeValues: marshall({
          ':pk': this.PK,
          ':value': content.value,
          ':type': `type:${type}`,
        }),
        ExpressionAttributeNames: {
          '#key': content.key,
        },
      };

      const { Items } = await this.dynamoConfig.client.send(
        new QueryCommand(params),
      );

      if (!Items || Items.length === 0) {
        return null;
      }

      const verificationCode = unmarshall(Items[0]) as {
        Content: VerificationCode;
      };

      this.logger.debug(
        'Verification code retrieved by content:',
        verificationCode,
      );

      return verificationCode.Content;
    } catch (error) {
      this.logger.error(
        'Error retrieving verification code by content:',
        error,
      );

      throw error;
    }
  }

  public async deleteOne({
    code,
    type,
  }: VerificationCodeRepositoryFilterDto): Promise<void> {
    try {
      const params: DeleteItemCommandInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: `type:${type}::code:${code}`,
        }),
      };

      await this.dynamoConfig.client.send(new DeleteItemCommand(params));

      this.logger.debug(
        `Verification code with code ${code} and type ${type} deleted`,
      );
    } catch (error) {
      this.logger.error('Error deleting verification code:', error);

      throw error;
    }
  }

  private generateCode(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
