export type RegistrationServiceDto = {
  email: string;
  name: string;
};

export interface RegistrationService {
  execute(dto: RegistrationServiceDto): Promise<{ token: string }>;
}
