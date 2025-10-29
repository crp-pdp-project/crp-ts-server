import { BaseModel } from '../base.model';

export enum ViewElementType {
  TITLE = 'title',
  PARAGRAPH = 'paragraph',
  BULLETS = 'bullets',
  SUB_TITLE = 'subTitle',
  IMAGE = 'image',
}

export abstract class ViewElementModel extends BaseModel {
  abstract readonly type: ViewElementType;
}

export abstract class ViewModel extends BaseModel {
  readonly #elements: ViewElementModel[] = [];

  get view(): ViewElementModel[] {
    return this.#elements;
  }

  addElement(element: ViewElementModel): this {
    this.#elements.push(element);
    return this;
  }

  addElements(element: ViewElementModel[]): this {
    this.#elements.push(...element);
    return this;
  }
}
