import { LoggerClient } from 'src/clients/logger.client';
import { SitedsConstants } from 'src/general/contants/siteds.constants';

import { ConAse270DTO } from '../../dtos/service/conAse270.dto';
import { ConCod271DTO } from '../../dtos/service/conCod271.dto';
import { ConCod271DetailDTO } from '../../dtos/service/conCod271Detail.dto';
import { ConNom271DetailDTO } from '../../dtos/service/conNom271Detail.dto';
import { BaseModel } from '../base.model';

import { SitedsCoverageModel } from './sitedsCoverage.model';

export class SitedsDetailModel extends BaseModel {
  readonly #logger: LoggerClient = LoggerClient.instance;

  readonly #rawData: ConNom271DetailDTO;

  readonly patientEntityType?: string;
  readonly patientLastName?: string;
  readonly patientFirstName?: string;
  readonly patientMemberId?: string;
  readonly patientSecondLastName?: string;
  readonly patientDocumentType?: string;
  readonly patientDocumentNumber?: string;
  readonly productCode?: string;
  readonly productDescription?: string;
  readonly contractorEntityType?: string;
  readonly contractorFirstName?: string;
  readonly contractorDocumentType?: string;
  readonly contractorIdQualifier?: string;
  readonly contractorId?: string;

  #coverages?: SitedsCoverageModel[];
  #rawCoverageData?: ConCod271DTO;

  constructor(sitedsDetail: ConNom271DetailDTO) {
    super();

    this.#rawData = sitedsDetail;
    this.patientEntityType = sitedsDetail.patientEntityType;
    this.patientLastName = sitedsDetail.patientLastName;
    this.patientFirstName = sitedsDetail.patientFirstName;
    this.patientMemberId = sitedsDetail.patientMemberId;
    this.patientSecondLastName = sitedsDetail.patientSecondLastName;
    this.patientDocumentType = sitedsDetail.patientDocumentType;
    this.patientDocumentNumber = sitedsDetail.patientDocumentNumber;
    this.productCode = sitedsDetail.productCode;
    this.productDescription = sitedsDetail.productDescription;
    this.contractorEntityType = sitedsDetail.contractorEntityType;
    this.contractorFirstName = sitedsDetail.contractorFirstName;
    this.contractorIdQualifier = sitedsDetail.contractorIdQualifier;
    this.contractorId = sitedsDetail.contractorId;
    this.contractorDocumentType = sitedsDetail.contractorDocumentType;
  }

  get coverages(): SitedsCoverageModel[] | undefined {
    return this.#coverages;
  }

  genCoveragePayload(): ConAse270DTO {
    return {
      patientMemberId: this.patientMemberId,
      planNumber: this.#rawData.planNumber,
      productCode: this.productCode,
      relationshipCode: this.#rawCoverageData?.relationshipCode,
      contractorDocumentType: this.contractorDocumentType,
      contractorIdQualifier: this.contractorIdQualifier,
      contractorId: this.contractorId,
      contractorEntityType: this.contractorEntityType,
    };
  }

  inyectCoverages(coverageInfo: ConCod271DTO): this {
    this.#logger.info(`Siteds Coverage Data for ${this.patientMemberId}`, this.#rawData);

    this.#rawCoverageData = coverageInfo;
    this.#coverages = this.resolveValidCoverages(coverageInfo.details ?? []);

    return this;
  }

  sanitizeCoverages(): void {
    if (this.#coverages?.length) {
      this.#coverages = this.#coverages?.slice(0, 1);
    }
  }

  private resolveValidCoverages(details: ConCod271DetailDTO[]): SitedsCoverageModel[] {
    const filteredModels = details.flatMap((detail) => {
      const config =
        SitedsConstants.VALID_COVERAGES[detail.coverageTypeCode as keyof typeof SitedsConstants.VALID_COVERAGES];
      if (config?.has(detail.coverageSubtypeCode ?? '')) {
        return new SitedsCoverageModel(detail);
      }
      return [];
    });

    return filteredModels;
  }
}
