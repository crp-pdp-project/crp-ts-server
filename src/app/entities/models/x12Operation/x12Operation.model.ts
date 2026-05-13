import { BaseModel } from 'src/app/entities/models/base.model';

export class X12OperationModel extends BaseModel {
  readonly encodedPayload?: string;
  readonly decodedPayload?: Record<string, unknown>;

  constructor(result: Record<string, unknown> | string) {
    super();

    if (typeof result === 'string') {
      this.encodedPayload = result;
    } else {
      this.decodedPayload = result;
    }
  }
}
