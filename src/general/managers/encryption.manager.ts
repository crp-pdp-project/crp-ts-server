import { randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';

import { IEncryptionConfig } from 'src/general/managers/config/encryption.config';

export type PasswordHashResult = {
  hash: string;
  salt: string;
};

export interface IEncryptionManager {
  hashPassword(password: string): Promise<PasswordHashResult>;
  comparePassword(password: string, hashedPassword: string, salt: string): Promise<boolean>;
}

export class EncryptionManager implements IEncryptionManager {
  private asyncRandomBytes = promisify(randomBytes);
  private asyncPbkdf2 = promisify(pbkdf2);
  private readonly iterations: number;
  private readonly digest: string;
  private readonly encoding: BufferEncoding;
  private readonly keyLength: number;
  private readonly saltLength: number;

  constructor(encryptionConfig: IEncryptionConfig) {
    this.iterations = encryptionConfig.iterations;
    this.digest = encryptionConfig.digest;
    this.encoding = encryptionConfig.encoding;
    this.keyLength = encryptionConfig.keyLength;
    this.saltLength = encryptionConfig.saltLength;
  }

  async hashPassword(password: string): Promise<PasswordHashResult> {
    const bytes = await this.asyncRandomBytes(this.saltLength);
    const salt = bytes.toString(this.encoding);
    const hashBytes = await this.asyncPbkdf2(password, salt, this.iterations, this.keyLength, this.digest);
    const hash = hashBytes.toString(this.encoding);
    return { hash, salt };
  }

  async comparePassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
    const hashBytes = await this.asyncPbkdf2(password, salt, this.iterations, this.keyLength, this.digest);
    const hash = hashBytes.toString(this.encoding);
    return hashedPassword === hash;
  }
}
