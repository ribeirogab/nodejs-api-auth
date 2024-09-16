export type RecoveryPasswordVerifyServiceDto = {
  code: string;
};

export interface RecoveryPasswordVerifyService {
  execute(dto: RecoveryPasswordVerifyServiceDto): Promise<void>;
}
