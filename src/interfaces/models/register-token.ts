export enum RegisterTokenTypeEnum {
  Email = 'email',
}

export type RegisterToken = {
  data: Record<string, string>;
  type: RegisterTokenTypeEnum;
  id: string;
};
