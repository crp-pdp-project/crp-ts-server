export interface IEncryptionConfig {
  readonly iterations: number;
  readonly digest: string;
  readonly encoding: BufferEncoding;
  readonly keyLength: number;
  readonly saltLength: number;
}

export class EncryptionConfigSha512 implements IEncryptionConfig {
  readonly iterations: number = 500;
  readonly digest: string = 'sha512';
  readonly encoding: BufferEncoding = 'hex';
  readonly keyLength: number = 64;
  readonly saltLength: number = 16;
}
