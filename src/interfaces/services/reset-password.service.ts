export type ResetPasswordServiceDto = {
  password: string;
  email: string;
  code: string;
};

export interface ResetPasswordService {
  execute(dto: ResetPasswordServiceDto): Promise<void>;
}
