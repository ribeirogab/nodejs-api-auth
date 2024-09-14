export type HashAdapterHashDto = {
  text: string;
  salt: string;
};

export type HashAdapterCompareDto = {
  decrypted: string;
  encrypted: string;
  salt: string;
};

export interface HashAdapter {
  generateSalt(length?: number): string;

  hash(dto: HashAdapterHashDto): string;

  compare(dto: HashAdapterCompareDto): boolean;
}
