import { ConAse270DTO } from 'src/app/entities/dtos/service/conAse270.dto';
import { ConCod271DTO } from 'src/app/entities/dtos/service/conCod271.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SitedsClient, SitedsServices } from 'src/clients/siteds.client';
import { SitedsConstants } from 'src/general/contants/siteds.constants';
import { DocumentTypeMapper, SitedsDocumentType } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { TextHelper } from 'src/general/helpers/text.helper';
import { X12ManagerBuild } from 'src/general/managers/x12/x12.manager';

type GetSitedsInsuranceInput = {
  coExcepcion: string;
  txNombre: string;
  coIafa: string;
  txPeticion: string;
};

type GetSitedsInsuranceOutput = {
  coError: string;
  txNombre: string;
  coIafa: string;
  txRespuesta: string;
};

export interface IGetSitedsInsuranceRepository {
  execute(patient: PatientDTO, payloadOptions: ConAse270DTO): Promise<ConCod271DTO>;
}

export class GetSitedsInsuranceRepository implements IGetSitedsInsuranceRepository {
  private readonly x12Manager = X12ManagerBuild.buildConCod();

  async execute(patient: PatientDTO, payloadOptions: ConAse270DTO): Promise<ConCod271DTO> {
    const methodPayload = this.parseInput(patient, payloadOptions);
    const instance = await SitedsClient.getInstance();
    const rawResult = await instance.client.call<GetSitedsInsuranceOutput>(
      SitedsServices.INSURANCE_PRICES,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(patient: PatientDTO, payloadOptions: ConAse270DTO): GetSitedsInsuranceInput {
    const normalizedDocumentType = patient.documentType
      ? DocumentTypeMapper.getSitedsDocumentType(patient.documentType)
      : SitedsDocumentType.DNI;

    const payload: ConAse270DTO = {
      ...payloadOptions,
      ipressId: SitedsConstants.IPRESS_ID,
      date: DateHelper.dateNow('crpDate'),
      time: DateHelper.dateNow('crpTime'),
      shortDate: DateHelper.dateNow('crpDateShort'),
      shortTime: DateHelper.dateNow('crpTimeShort'),
      senderEntityType: SitedsConstants.DEFAULT_ENTITY_TYPE,
      receiverEntityType: SitedsConstants.DEFAULT_ENTITY_TYPE,
      senderTaxId: SitedsConstants.RUC_NUMBER,
      purposeCode: SitedsConstants.DEFAULT_PURPOSE_CODE,
      transactionId: SitedsConstants.DEFAULT_TRANSAC_ID,
      patientEntityType: SitedsConstants.DEFAULT_PATIENT_TYPE,
      contractorIdQualifier: SitedsConstants.DEFAULT_QUALIFIER,
      requestText: SitedsConstants.DEFAULT_REQUEST,
      groupControlNumber: TextHelper.generateUniqueCode(8),
      transactionSetControlNumber: TextHelper.generateUniqueCode(8),
      patientFirstName: patient.firstName?.toUpperCase(),
      patientLastName: patient.lastName?.toUpperCase(),
      patientSecondLastName: patient.secondLastName?.toUpperCase() ?? undefined,
      patientDocumentType: normalizedDocumentType,
      patientDocumentNumber: patient.documentNumber,
    };

    const x12Payload = this.x12Manager.encode(payload);
    return {
      coExcepcion: SitedsConstants.EXCEPTION_CODE,
      txNombre: SitedsConstants.DEFAULT_TRANSAC_NAME,
      coIafa: payloadOptions.iafaId ?? '',
      txPeticion: x12Payload,
    };
  }

  private parseOutput(rawResult: GetSitedsInsuranceOutput): ConCod271DTO {
    const { coError, txRespuesta } = rawResult ?? {};

    if (!SitedsConstants.SUCCESS_CODES.includes(coError)) {
      const errorMessage = SitedsConstants.ERROR_MESSAGES[coError as keyof typeof SitedsConstants.ERROR_MESSAGES];
      throw ErrorModel.notFound({ message: errorMessage ?? 'Unkown error consuming siteds' });
    }

    const result = this.x12Manager.decode(txRespuesta);
    return result;
  }
}

export class GetSitedsInsuranceRepositoryMock implements IGetSitedsInsuranceRepository {
  async execute(): Promise<ConCod271DTO> {
    return {
      ipressId: '40007',
      iafaId: '980001C',
      date: '20171025',
      time: '13:56:23',
      shortDate: '171025',
      shortTime: '13:5',
      correlationId: '250000003',
      transactionId: '271',
      purposeCode: '11',
      controlNumber: '041002113',
      transactionSetControlNumber: '83646481',
      senderCategory: '2',
      senderUser: 'X',
      senderPassword: 'X',
      photoUploadDate: '00000000',
      receiverCategory: '2',
      receiverTaxId: '20100054184',
      patientCategory: '1',
      patientLastName: 'DELGADO',
      patientFirstName: 'MERY ISABEL',
      patientAffiliation: '9468332',
      patientSecondLastName: 'EDUARDO',
      patientStatusCode: '6',
      patientDocumentType: '1',
      patientDocumentNumber: '72208776',
      patientIdentifier: '9468332',
      policyTypeCode: '1',
      productCode: 'E1',
      productDescription: 'AMI ACCIT.ESTUDIANTE',
      planNumber: '118830',
      healthPlanType: '3',
      currencyCode: '1',
      relationshipCode: '1',
      benefitSubjectCode: 'S',
      benefitSubjectNumber: 'Q00',
      birthDate: '19950415',
      gender: '2',
      maritalStatus: '1',
      coverageStartDate: '20170901',
      coverageEndDate: '20180228',
      contractorCategory: '2',
      contractorLastName: 'UNIVERSIDAD CATOLICA DE SANTA MARIA',
      contractorDocumentType: '8',
      contractorIdRef: 'XX5',
      contractorRefCode: '20141637941',
      holderCategory: '1',
      holderLastName: 'DELGADO',
      holderFirstName: 'MERY ISABEL',
      holderAffiliation: '9468332',
      holderSecondLastName: 'EDUARDO',
      holderDocumentType: '1',
      holderDocumentNumber: '72208776',
      holderEnrollmentDate: '20170901',
      details: [
        {
          benefitInfo: '1',
          coverageNumber: '2',
          initialMaxBenefit: '0',
          coverageAmount: '0',
          restrictionIndicatorCode: '1',
          serviceQuantity: '1',
          productId: '1',
          coverageTypeCode: '2',
          coverageSubtypeCode: '101',
          currencyCode: '1',
          copayFixed: '0',
          serviceCalcCode: 'VS',
          serviceCalcQuantity: '0',
          copayVariable: '100',
          guaranteeFlag: '0',
          waitingPeriodEndDate: '00000000',
          eliminationPeriodEndDate: '00000000',
        },
      ],
    };
  }
}
