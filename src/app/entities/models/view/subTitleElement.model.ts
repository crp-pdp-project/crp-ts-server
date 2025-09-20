import { SubTitleDataDTO } from '../../dtos/service/viewElement.dto';

import { ViewElementModel, ViewElementType } from './view.model';

export class SubTitleElementModel extends ViewElementModel {
  readonly type: ViewElementType = ViewElementType.SUB_TITLE;
  readonly subTitle: SubTitleDataDTO;

  constructor(data: SubTitleDataDTO) {
    super();

    this.subTitle = data;
  }
}
