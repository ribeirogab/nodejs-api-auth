export enum UserTokenTypeEnum {
  RecoveryPassword = 'recovery-password',
}

export type UserToken = {
  type: UserTokenTypeEnum;
  expires_at: string;
  user_id: string;
  id: string;
};
