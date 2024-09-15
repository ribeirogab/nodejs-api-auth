export type RecoveryPasswordServiceDto = {
  password: string;
  token: string;
};

export interface RecoveryPasswordService {
  execute(dto: RecoveryPasswordServiceDto): Promise<void>;
}
