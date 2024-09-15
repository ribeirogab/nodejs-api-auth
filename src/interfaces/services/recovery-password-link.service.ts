export type RecoveryPasswordLinkServiceDto = {
  email: string;
};

export interface RecoveryPasswordLinkService {
  execute(dto: RecoveryPasswordLinkServiceDto): Promise<void>;
}
