import { FileModel, MimeType } from './file.model';

export class PdfFileModel extends FileModel {
  readonly mimeType: MimeType;

  constructor(base64: string, filename?: string) {
    super(base64, filename);

    this.mimeType = MimeType.PDF;
  }
}
