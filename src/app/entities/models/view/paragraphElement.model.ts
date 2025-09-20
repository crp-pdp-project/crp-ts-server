import { ParagraphDataDTO } from '../../dtos/service/viewElement.dto';

import { ViewElementModel, ViewElementType } from './view.model';

export class ParagraphElementModel extends ViewElementModel {
  readonly type: ViewElementType = ViewElementType.PARAGRAPH;
  readonly paragraph: ParagraphDataDTO;

  constructor(data: ParagraphDataDTO) {
    super();

    this.paragraph = data;
  }
}
