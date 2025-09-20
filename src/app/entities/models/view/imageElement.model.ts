import { ImageDataDTO } from '../../dtos/service/viewElement.dto';

import { ViewElementModel, ViewElementType } from './view.model';

export class ImageElementModel extends ViewElementModel {
  readonly type: ViewElementType = ViewElementType.IMAGE;
  readonly image: ImageDataDTO;

  constructor(data: ImageDataDTO) {
    super();

    this.image = data;
  }
}
