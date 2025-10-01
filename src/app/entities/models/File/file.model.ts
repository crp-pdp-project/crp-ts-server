import { Readable } from 'node:stream';

import { TextHelper } from 'src/general/helpers/text.helper';

import { ErrorModel } from '../error/error.model';

export enum MimeType {
  PDF = 'application/pdf',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
  SVG = 'image/svg+xml',
  GIF = 'image/gif',
  TXT = 'text/plain; charset=utf-8',
  CSV = 'text/csv; charset=utf-8',
  JSON = 'application/json',
  ZIP = 'application/zip',
}

export abstract class FileModel {
  abstract readonly mimeType: MimeType;
  protected readonly normalizedBase64: string;
  protected readonly preferredFilename: string;

  private decodedBytes?: Buffer;

  constructor(base64: string, filename?: string) {
    this.normalizedBase64 = FileModel.normalizeBase64(base64);
    this.preferredFilename = filename?.trim() ?? TextHelper.genUniqueName();
  }

  static normalizeBase64(value: string): string {
    return value
      .replace(/^data:[^;]+;base64,?/i, '')
      .replace(/\s+/g, '')
      .trim();
  }

  toBuffer(): Buffer {
    if (!this.decodedBytes) {
      const bytes: Buffer = Buffer.from(this.normalizedBase64, 'base64');

      if (!bytes || bytes.length === 0) {
        throw ErrorModel.unprocessable({ message: 'Empty file payload.' });
      }

      this.decodedBytes = bytes;
    }
    return this.decodedBytes;
  }

  toStream(): Readable {
    return Readable.from(this.toBuffer());
  }

  get contentLength(): number {
    return this.toBuffer().length;
  }

  get filename(): string {
    return this.preferredFilename;
  }
}
