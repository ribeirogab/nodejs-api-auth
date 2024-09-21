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
import {
  type LoggerAdapter,
  type VerificationCode,
  type VerificationCodeRepositoryCreateDto,
  type VerificationCodeRepositoryFilterDto,
  type VerificationCodeRepositoryFindOneByContentDto,
  type VerificationCodeRepository as VerificationCodeRepositoryInterface,
  VerificationCodeReservedFieldEnum,
} from '@/interfaces';

/** DynamoDB structure
 - PK: verification-code
 - SK: type:{type}::token:{token}
 - Content: { code, type, expires_at, token, ...data }
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
    dto: VerificationCodeRepositoryCreateDto,
  ): Promise<VerificationCode> {
    try {
      const code = this.generateCode(6);
      const verificationCode = {
        ...dto.content,
        code_expires_at: dto.code_expires_at,
        code_type: dto.code_type,
        token: dto.token,
        code,
      };

      const params: PutItemInput = {
        TableName: this.dynamoConfig.tableName,
        Item: marshall({
          PK: this.PK,
          SK: this.getSortKey(dto.code_type, dto.token),
          TTL: this.dynamoConfig.getTTL(new Date(dto.code_expires_at)),
          Content: verificationCode,
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
    code_type,
    token,
  }: VerificationCodeRepositoryFilterDto): Promise<VerificationCode | null> {
    try {
      const params: GetItemInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: this.getSortKey(code_type, token),
        }),
      };

      const { Item } = await this.dynamoConfig.client.send(
        new GetItemCommand(params),
      );

      if (!Item) {
        return null;
      }

      const verificationCode = unmarshall(Item) as {
        Content: VerificationCode;
      };

      this.logger.debug('Verification code retrieved:', verificationCode);

      return verificationCode.Content;
    } catch (error) {
      this.logger.error('Error retrieving verification code:', error);

      throw error;
    }
  }

  public async findOneByContent({
    code_type,
    content,
  }: VerificationCodeRepositoryFindOneByContentDto): Promise<VerificationCode | null> {
    try {
      const params: QueryCommandInput = {
        TableName: this.dynamoConfig.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :type)',
        FilterExpression: 'contains(Content.#key, :value)',
        ExpressionAttributeValues: marshall({
          ':pk': this.PK,
          ':value': content.value,
          ':type': `type:${code_type}`,
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
    code_type,
    token,
  }: VerificationCodeRepositoryFilterDto): Promise<void> {
    try {
      const params: DeleteItemCommandInput = {
        TableName: this.dynamoConfig.tableName,
        Key: marshall({
          PK: this.PK,
          SK: this.getSortKey(code_type, token),
        }),
      };

      await this.dynamoConfig.client.send(new DeleteItemCommand(params));

      this.logger.debug(
        `Verification code with token ${token} and type ${code_type} deleted`,
      );
    } catch (error) {
      this.logger.error('Error deleting verification code:', error);

      throw error;
    }
  }

  public removeReservedFields<T>(verificationCode: VerificationCode) {
    const data = Object.fromEntries(
      Object.entries(verificationCode).filter(
        ([key]) =>
          !(
            Object.values(VerificationCodeReservedFieldEnum) as string[]
          ).includes(key),
      ),
    );

    return data as T;
  }

  private generateCode(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  private getSortKey(codeType: string, token: string): string {
    return `type:${codeType}::token:${token}`;
  }
}
