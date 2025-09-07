import { TipDTO } from 'src/app/entities/dtos/service/tip.dto';

import { BaseModel } from '../base.model';

export class TipModel extends BaseModel {
  readonly title?: string;
  readonly content?: string[];

  constructor(tip: TipDTO) {
    super();

    this.title = tip.title;
    this.content = tip.content ?? [];
  }
}
