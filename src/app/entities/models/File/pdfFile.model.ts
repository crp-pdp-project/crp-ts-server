import { FileModel, MimeType } from './file.model';

export class PdfFileModel extends FileModel {
  readonly mimeType: MimeType = MimeType.PDF;

  private constructor(file: string | Buffer, filename?: string) {
    super(file, filename);
  }

  static fromBuffer(buffer: Buffer, filename?: string): PdfFileModel {
    return new PdfFileModel(buffer, filename);
  }

  static fromBase64(base64: string, filename?: string): PdfFileModel {
    return new PdfFileModel(base64, filename);
  }
}
