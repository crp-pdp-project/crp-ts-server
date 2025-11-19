import { ConAse270DTO } from 'src/app/entities/dtos/service/conAse270.dto';
import { ConCod271DTO } from 'src/app/entities/dtos/service/conCod271.dto';
import { LoggerClient } from 'src/clients/logger/logger.client';
import { SitedsClient, SitedsServices } from 'src/clients/siteds/siteds.client';
import { SitedsConstants } from 'src/general/contants/siteds.constants';
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
  execute(payloadOptions: ConAse270DTO): Promise<ConCod271DTO>;
}

export class GetSitedsInsuranceRepository implements IGetSitedsInsuranceRepository {
  private readonly x12Manager = X12ManagerBuild.buildConCod();

  async execute(payloadOptions: ConAse270DTO): Promise<ConCod271DTO> {
    const methodPayload = this.parseInput(payloadOptions);
    const instance = await SitedsClient.getInstance();
    const rawResult = await instance.client.call<GetSitedsInsuranceOutput>(
      SitedsServices.INSURANCE_PRICES,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(payloadOptions: ConAse270DTO): GetSitedsInsuranceInput {
    const payload: ConAse270DTO = {
      ...payloadOptions,
      purposeCode: SitedsConstants.DEFAULT_PURPOSE_CODE,
      transactionId: SitedsConstants.DEFAULT_TRANSAC_ID,
      requestText: SitedsConstants.COD_REQUEST,
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

    if (!SitedsConstants.SUCCESS_CODES.has(coError)) {
      const errorMessage = SitedsConstants.ERROR_MESSAGES[coError as keyof typeof SitedsConstants.ERROR_MESSAGES];
      LoggerClient.instance.error(errorMessage ?? 'Unkown error consuming siteds');
      return {};
    }

    const result = this.x12Manager.decode(txRespuesta);
    return result;
  }
}

export class GetSitedsInsuranceRepositoryMock implements IGetSitedsInsuranceRepository {
  async execute(): Promise<ConCod271DTO> {
    return Promise.resolve({
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
    });
  }
}
