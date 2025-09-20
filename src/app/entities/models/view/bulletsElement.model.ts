import { BulletsDataDTO } from '../../dtos/service/viewElement.dto';

import { ViewElementModel, ViewElementType } from './view.model';

export class BulletsElementModel extends ViewElementModel {
  readonly type: ViewElementType = ViewElementType.BULLETS;
  readonly bullets: BulletsDataDTO;

  constructor(data: BulletsDataDTO) {
    super();

    this.bullets = data;
  }
}
