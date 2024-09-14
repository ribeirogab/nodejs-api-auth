export enum RegisterTokenTypeEnum {
  Email = 'email',
}

export type RegisterToken = {
  type: RegisterTokenTypeEnum;
  external_id: string;
  id: string;
};
