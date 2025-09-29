import { ConNom271DTO } from '../../dtos/service/conNom271.dto';
import { BaseModel } from '../base.model';

export class SitedsModel extends BaseModel {
  readonly data: ConNom271DTO;

  // TODO SITEDS MODEL

  constructor(sitedsResult: ConNom271DTO) {
    super();

    this.data = sitedsResult;
  }
}
