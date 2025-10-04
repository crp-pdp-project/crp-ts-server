import { BaseModel } from '../base.model';

export class PatientResultURLModel extends BaseModel {
  readonly url: string;

  constructor(url: string) {
    super();

    this.url = url;
  }
}
