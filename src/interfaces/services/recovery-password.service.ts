export type RecoveryPasswordServiceDto = {
  email: string;
};

export interface RecoveryPasswordService {
  execute(dto: RecoveryPasswordServiceDto): Promise<void>;
}
