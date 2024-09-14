export type CreateRegisterTokenServiceDto = {
  email: string;
};

export interface CreateRegisterTokenService {
  execute(dto: CreateRegisterTokenServiceDto): Promise<void>;
}
