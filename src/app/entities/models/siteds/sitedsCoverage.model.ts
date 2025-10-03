import { SitedsConstants } from 'src/general/contants/siteds.constants';

import { ConCod271DetailDTO } from '../../dtos/service/conCod271Detail.dto';
import { BaseModel } from '../base.model';

export class SitedsCoverageModel extends BaseModel {
  readonly coverageTypeCode?: string;
  readonly coverageSubtypeCode?: string;
  readonly currencyCode?: string;
  readonly copayFixed?: number;
  readonly serviceCalcCode?: string;
  readonly serviceCalcQuantity?: number;
  readonly copayVariable?: number;
  constructor(sitedsCoverage: ConCod271DetailDTO) {
    super();

    this.coverageTypeCode = sitedsCoverage.coverageTypeCode;
    this.coverageSubtypeCode = sitedsCoverage.coverageSubtypeCode;
    this.currencyCode = sitedsCoverage.currencyCode;
    this.copayFixed = sitedsCoverage.copayFixed ? Number(sitedsCoverage.copayFixed) : undefined;
    this.serviceCalcCode = sitedsCoverage.serviceCalcCode;
    this.serviceCalcQuantity = sitedsCoverage.serviceCalcQuantity
      ? Number(sitedsCoverage.serviceCalcQuantity)
      : undefined;
    this.copayVariable = sitedsCoverage.copayVariable ? Number(sitedsCoverage.copayVariable) : undefined;
  }

  get taxAmount(): number | undefined {
    if (this.copayFixed != null) {
      return (this.copayFixed * SitedsConstants.TAX_PERCENTAGE) / 100;
    }

    return this.copayFixed;
  }

  get preTaxAmount(): number | undefined {
    if (this.copayFixed != null) {
      return this.copayFixed - (this.taxAmount ?? 0);
    }

    return this.copayFixed;
  }
}
