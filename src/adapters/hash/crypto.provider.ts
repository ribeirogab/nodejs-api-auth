import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import type {
  HashAdapterCompareDto,
  HashAdapterHashDto,
  HashAdapter as HashAdapterInterface,
} from '@/interfaces';

export class CryptoProvider implements HashAdapterInterface {
  public generateSalt(length = 8): string {
    return randomBytes(length).toString('hex');
  }

  public hash({ salt, text }: HashAdapterHashDto): string {
    return createHash('sha512')
      .update(salt + text)
      .digest('hex');
  }

  public compare({
    decrypted,
    encrypted,
    salt,
  }: HashAdapterCompareDto): boolean {
    const hashToCompare = createHash('sha512')
      .update(salt + decrypted)
      .digest('hex');

    // Compare the two hashes securely using timingSafeEqual to avoid timing attacks
    return timingSafeEqual(
      Buffer.from(encrypted, 'hex'),
      Buffer.from(hashToCompare, 'hex'),
    );
  }
}
