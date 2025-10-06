import { LoggerClient } from 'src/clients/logger/logger.client';
import { SitedsConstants } from 'src/general/contants/siteds.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DocumentTypeMapper, SitedsDocumentType } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { PatientDM } from '../../dms/patients.dm';
import { ConAse270DTO } from '../../dtos/service/conAse270.dto';
import { ConNom271DTO } from '../../dtos/service/conNom271.dto';
import { ConNom271DetailDTO } from '../../dtos/service/conNom271Detail.dto';
import { BaseModel } from '../base.model';
import { ErrorModel } from '../error/error.model';

import { SitedsDetailModel } from './sitedsDetail.model';

export class SitedsModel extends BaseModel {
  readonly #logger: LoggerClient = LoggerClient.instance;

  readonly #rawData: ConNom271DTO;
  readonly #documentNumber: PatientDM['documentNumber'];
  readonly #documentType: SitedsDocumentType;

  readonly ipressId?: string;
  readonly iafaId?: string;
  readonly date?: string;
  readonly time?: string;

  #details: SitedsDetailModel[];

  constructor(
    sitedsResult: ConNom271DTO,
    documentNumber: PatientDM['documentNumber'],
    documentType: PatientDM['documentType'],
  ) {
    super();

    this.#rawData = sitedsResult;
    this.#documentNumber = documentNumber;
    this.#documentType = DocumentTypeMapper.getSitedsDocumentType(documentType);

    this.ipressId = sitedsResult.ipressId;
    this.iafaId = sitedsResult.iafaId;
    this.date = sitedsResult.date ? DateHelper.toFormatDate(sitedsResult.date, 'spanishDate') : undefined;
    this.time = sitedsResult.time ? DateHelper.toFormatTime(sitedsResult.time, 'spanishTime') : undefined;
    this.#details = this.resolveValidDetails(sitedsResult.details ?? [], sitedsResult.iafaId);

    this.#logger.info('Siteds Detail Data', this.#rawData);
  }

  get details(): SitedsDetailModel[] {
    return this.#details;
  }

  private isValidDetail(detail: ConNom271DetailDTO, iafaId: ConNom271DTO['iafaId']): boolean {
    const config = SitedsConstants.VALID_PRODUCTS[iafaId as keyof typeof SitedsConstants.VALID_PRODUCTS];

    return (
      detail.patientStatusCode === SitedsConstants.VALID_PLAN &&
      config?.has(detail.productCode ?? '') &&
      detail.patientDocumentNumber === this.#documentNumber &&
      detail.patientDocumentType === this.#documentType
    );
  }

  private resolveValidDetails(details: ConNom271DetailDTO[], iafaId: ConNom271DTO['iafaId']): SitedsDetailModel[] {
    const filteredModels = details.flatMap((detail) => {
      if (this.isValidDetail(detail, iafaId)) {
        return new SitedsDetailModel(detail);
      }
      return [];
    });

    return filteredModels;
  }

  hasValidDetails(): boolean {
    return !!this.#details?.length;
  }

  isValidInsurance(): boolean {
    return (
      this.#details.length === 1 &&
      this.#details[0].coverages?.length === 1 &&
      (this.#details[0].coverages?.[0]?.copayFixed ?? 0) > 0
    );
  }

  validateDetails(): void {
    if (!this.hasValidDetails()) {
      ErrorModel.notFound({ detail: ClientErrorMessages.INSURANCE_NOT_EXIST });
    }
  }

  validateInsurance(): void {
    if (!this.isValidInsurance()) {
      ErrorModel.notFound({ detail: ClientErrorMessages.INSURANCE_NOT_EXIST });
    }
  }

  sanitizeDetails(): this {
    const detailsWithCoverages = this.#details.filter((detail) => detail.coverages?.length);
    if (detailsWithCoverages.length > 0) {
      const validDetail = detailsWithCoverages[0];
      validDetail.sanitizeCoverages();
      this.#details = [validDetail];
    }

    return this;
  }

  getMainPayload(): ConAse270DTO {
    return {
      ipressId: this.ipressId,
      iafaId: this.iafaId,
      date: this.#rawData.date,
      time: this.#rawData.time,
      shortDate: this.#rawData.shortDate,
      shortTime: this.#rawData.shortTime,
      correlative: this.#rawData.correlative,
      groupControlNumber: this.#rawData.groupControlNumber,
      transactionSetControlNumber: this.#rawData.transactionSetControlNumber,
    };
  }
}
