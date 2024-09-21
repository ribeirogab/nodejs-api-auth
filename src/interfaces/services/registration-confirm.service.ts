export type RegistrationConfirmServiceDto = {
  token: string;
  code: string;
};

export interface RegistrationConfirmService {
  execute(dto: RegistrationConfirmServiceDto): Promise<void>;
}
