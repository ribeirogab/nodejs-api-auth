export type RegistrationServiceDto = {
  password: string;
  email: string;
  name: string;
};

export interface RegistrationService {
  execute(dto: RegistrationServiceDto): Promise<void>;
}
