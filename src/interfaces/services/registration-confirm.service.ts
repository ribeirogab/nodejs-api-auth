export type RegistrationConfirmServiceDto = {
  code: string;
};

export interface RegistrationConfirmService {
  execute(dto: RegistrationConfirmServiceDto): Promise<void>;
}
