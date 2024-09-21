export type LoginServiceDto = {
  email: string;
};

export interface LoginService {
  execute(dto: LoginServiceDto): Promise<{ token: string }>;
}
