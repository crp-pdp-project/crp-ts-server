import { LoggerClient } from 'src/clients/logger/logger.client';
import { SitedsConstants } from 'src/general/constants/siteds.constants';

import type { ConAse270DTO } from '../../dtos/service/conAse270.dto';
import type { ConCod271DTO } from '../../dtos/service/conCod271.dto';
import type { ConCod271DetailDTO } from '../../dtos/service/conCod271Detail.dto';
import type { ConNom271DetailDTO } from '../../dtos/service/conNom271Detail.dto';
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
  readonly patientContractNumber?: string;
  readonly patientStatusCode?: string;
  readonly productCode?: string;
  readonly productDescription?: string;
  readonly contractorEntityType?: string;
  readonly contractorFirstName?: string;
  readonly contractorDocumentType?: string;
  readonly contractorIdQualifier?: string;
  readonly contractorId?: string;
  readonly planNumber?: string;
  #coverages?: SitedsCoverageModel[];

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
    this.patientContractNumber = sitedsDetail.patientContractNumber;
    this.patientStatusCode = sitedsDetail.patientStatusCode;
    this.productCode = sitedsDetail.productCode;
    this.productDescription = sitedsDetail.productDescription;
    this.contractorEntityType = sitedsDetail.contractorEntityType;
    this.contractorFirstName = sitedsDetail.contractorFirstName;
    this.contractorIdQualifier = sitedsDetail.contractorIdQualifier;
    this.contractorId = sitedsDetail.contractorId;
    this.contractorDocumentType = sitedsDetail.contractorDocumentType;
    this.planNumber = sitedsDetail.planNumber;
    this.#coverages = sitedsDetail.coverages ? this.resolveValidCoverages(sitedsDetail.coverages) : undefined;
  }

  get coverages(): SitedsCoverageModel[] | undefined {
    return this.#coverages;
  }

  genCoveragePayload(): ConAse270DTO {
    return {
      patientFirstName: this.patientFirstName,
      patientLastName: this.patientLastName,
      patientSecondLastName: this.patientSecondLastName,
      patientDocumentType: this.patientDocumentType,
      patientDocumentNumber: this.patientDocumentNumber,
      patientMemberId: this.patientMemberId,
      patientEntityType: this.patientEntityType,
      planNumber: this.#rawData.planNumber,
      productCode: this.productCode,
      productDescription: this.productDescription,
      relationshipCode: this.#rawData?.relationshipCode,
      contractorDocumentType: this.contractorDocumentType,
      contractorIdQualifier: this.contractorIdQualifier,
      contractorId: this.contractorId,
      contractorEntityType: this.contractorEntityType,
      contractorLastName: this.#rawData?.contractorLastName,
      contractorSecondLastName: this.#rawData?.contractorSecondLastName,
    };
  }

  inyectCoverages(coverageInfo: ConCod271DTO): this {
    this.#coverages = this.resolveValidCoverages(coverageInfo.details ?? []);
    this.#logger.info('Siteds Coverage Data', this.buildCoverageLogSummary(coverageInfo));

    return this;
  }

  sanitizeCoverages(): void {
    if (this.#coverages?.length) {
      const sortedList = this.sortCoverages(this.#coverages);
      this.#coverages = [sortedList[0]];
    }
  }

  private sortCoverages(list: SitedsCoverageModel[]): SitedsCoverageModel[] {
    return list.sort((a, b) => (b?.copayFixed ?? 0) - (a?.copayFixed ?? 0));
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

  private buildCoverageLogSummary(coverageInfo: ConCod271DTO): Record<string, unknown> {
    const [firstCoverage] = coverageInfo.details ?? [];

    return {
      patientFirstName: this.patientFirstName,
      patientDocumentNumber: this.patientDocumentNumber,
      patientMemberId: this.patientMemberId,
      productCode: this.productCode,
      planNumber: this.#rawData.planNumber,
      correlationId: coverageInfo.correlationId,
      transactionId: coverageInfo.transactionId,
      controlNumber: coverageInfo.controlNumber,
      coverageCount: coverageInfo.details?.length ?? 0,
      validCoverageCount: this.#coverages?.length ?? 0,
      firstCoverage: firstCoverage
        ? {
            coverageNumber: firstCoverage.coverageNumber,
            coverageTypeCode: firstCoverage.coverageTypeCode,
            coverageSubtypeCode: firstCoverage.coverageSubtypeCode,
            productId: firstCoverage.productId,
            currencyCode: firstCoverage.currencyCode,
            copayFixed: firstCoverage.copayFixed,
            copayVariable: firstCoverage.copayVariable,
          }
        : null,
    };
  }
}
