import { BaseModel } from 'src/app/entities/models/base.model';
import { StatusCode } from 'src/general/enums/status.enum';

export class CardModel extends BaseModel {
  readonly redirectStatus = StatusCode.SEE_OTHER;

  readonly #redirectUrl: URL;
  #tokenId?: string;

  constructor(redirectUrl: string) {
    super();

    this.#redirectUrl = new URL(redirectUrl);
  }

  get redirectUrl(): string {
    this.#redirectUrl.searchParams.set('isSuccess', String(!!this.#tokenId));

    if (this.#tokenId) {
      this.#redirectUrl.searchParams.set('tokenId', this.#tokenId);
    }

    return this.#redirectUrl.toString();
  }

  inyectTokenId(tokenId?: string): this {
    this.#tokenId = tokenId;

    return this;
  }
}
