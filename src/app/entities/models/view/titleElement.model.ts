import { TitleDataDTO } from '../../dtos/service/viewElement.dto';

import { ViewElementModel, ViewElementType } from './view.model';

export class TitleElementModel extends ViewElementModel {
  readonly type: ViewElementType = ViewElementType.TITLE;
  readonly title: TitleDataDTO;

  constructor(data: TitleDataDTO) {
    super();

    this.title = data;
  }
}
