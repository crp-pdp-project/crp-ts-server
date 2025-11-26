import { LoggerClient } from 'src/clients/logger/logger.client';
import { SitedsConstants } from 'src/general/contants/siteds.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DocumentTypeMapper, SitedsDocumentType } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

import { PatientDM } from '../../dms/patients.dm';
import { AxionalPayloadDTO, AxionalPayloadDTOSchema } from '../../dtos/service/axionalPayload.dto';
import { ConAse270DTO } from '../../dtos/service/conAse270.dto';
import { ConNom271DTO } from '../../dtos/service/conNom271.dto';
import { ConNom271DetailDTO } from '../../dtos/service/conNom271Detail.dto';
import { BaseModel } from '../base.model';
import { ErrorModel } from '../error/error.model';
import { SignInSessionModel } from '../session/signInSession.model';

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
  #base64?: string;

  private constructor(
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

  get base64(): string | undefined {
    return this.#base64;
  }

  get amount(): number | undefined {
    return this.#details?.[0]?.coverages?.[0]?.copayFixed;
  }

  static fromDTO(
    sitedsResult: ConNom271DTO,
    documentNumber: PatientDM['documentNumber'],
    documentType: PatientDM['documentType'],
  ): SitedsModel {
    return new SitedsModel(sitedsResult, documentNumber, documentType);
  }

  static fromBase64(
    encodedSites: string,
    documentNumber: PatientDM['documentNumber'],
    documentType: PatientDM['documentType'],
  ): SitedsModel {
    const decoded = Buffer.from(encodedSites, 'base64').toString('utf8');
    const dto = JSON.parse(decoded) as ConNom271DTO;
    return new SitedsModel(dto, documentNumber, documentType);
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
      throw ErrorModel.notFound({ detail: ClientErrorMessages.INSURANCE_NOT_EXIST });
    }
  }

  validateInsurance(): void {
    if (!this.isValidInsurance()) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.INSURANCE_NOT_EXIST });
    }
  }

  generateBase64(): this {
    const objectString = JSON.stringify(this.toPlainObject());
    this.#base64 = Buffer.from(objectString).toString('base64');

    return this;
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
      senderEntityType: this.#rawData.senderEntityType,
      receiverEntityType: this.#rawData.receiverEntityType,
      groupControlNumber: this.#rawData.groupControlNumber,
      transactionSetControlNumber: this.#rawData.transactionSetControlNumber,
    };
  }

  getAxionalPayload(session: SignInSessionModel): AxionalPayloadDTO {
    const { patient: client } = session;
    const detail = this.details?.[0];
    const coverage = detail?.coverages?.[0];

    const payload = {
      ipressId: this.ipressId,
      iafaId: this.iafaId,
      date: this.date,
      time: this.time,
      patientEntityType: detail?.patientEntityType ?? '',
      patientLastName: detail?.patientLastName ?? '',
      patientFirstName: detail?.patientFirstName ?? '',
      patientMemberId: detail?.patientMemberId ?? '',
      patientSecondLastName: detail?.patientSecondLastName ?? '',
      patientDocumentType: detail?.patientDocumentType ?? '',
      patientDocumentNumber: detail?.patientDocumentNumber ?? '',
      clientLastName: client.lastName,
      clientFirstName: client.firstName,
      clientDocumentType: client.documentType,
      clientDocumentNumber: client.documentNumber,
      productCode: detail?.productCode ?? '',
      productDescription: detail?.productDescription ?? '',
      contractorEntityType: detail?.contractorEntityType ?? '',
      contractorFirstName: detail?.contractorFirstName ?? '',
      contractorDocumentType: detail?.contractorDocumentType ?? '',
      contractorIdQualifier: detail?.contractorIdQualifier ?? '',
      contractorId: detail?.contractorId ?? '',
      coverageTypeCode: coverage?.coverageTypeCode ?? '',
      coverageSubtypeCode: coverage?.coverageSubtypeCode ?? '',
      currencyCode: coverage?.currencyCode ?? '',
      copayFixed: coverage?.copayFixed ?? 0,
      serviceCalcCode: coverage?.serviceCalcCode ?? '',
      serviceCalcQuantity: coverage?.serviceCalcQuantity ?? 0,
      copayVariable: coverage?.copayVariable ?? 0,
      taxAmount: coverage?.taxAmount ?? 0,
      preTaxAmount: coverage?.preTaxAmount ?? 0,
    };

    return AxionalPayloadDTOSchema.parse(payload);
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
}
