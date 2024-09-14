import type { RegisterToken } from '../models/register-token';

export type GetRegisterTokenServiceDto = {
  token: string;
};

export interface GetRegisterTokenService {
  execute(dto: GetRegisterTokenServiceDto): Promise<RegisterToken>;
}
