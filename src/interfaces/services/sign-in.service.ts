export type SignInServiceDto = {
  password: string;
  email: string;
};

export interface SignInService {
  execute(dto: SignInServiceDto): Promise<void>;
}
