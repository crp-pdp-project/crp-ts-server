export interface IEncryptionConfig {
  readonly iterations: number;
  readonly digest: string;
  readonly encoding: BufferEncoding;
  readonly keyLength: number;
  readonly saltLength: number;
}

export class EncryptionConfigSha512 implements IEncryptionConfig {
  readonly iterations = 500;
  readonly digest = 'sha512';
  readonly encoding = 'hex';
  readonly keyLength = 64;
  readonly saltLength = 16;
}
