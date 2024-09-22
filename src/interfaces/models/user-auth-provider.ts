export enum UserAuthProviderEnum {
  Google = 'google',
  Email = 'email',
}

export type UserAuthProvider = {
  provider: UserAuthProviderEnum;
  provider_id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
};
