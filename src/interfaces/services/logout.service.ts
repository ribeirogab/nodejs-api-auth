export type LogoutServiceDto = {
  user_id: string;
};

export interface LogoutService {
  execute(dto: LogoutServiceDto): Promise<void>;
}
