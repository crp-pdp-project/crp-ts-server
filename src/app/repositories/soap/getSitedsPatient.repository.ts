import { ConAse270DTO } from 'src/app/entities/dtos/service/conAse270.dto';
import { ConNom271DTO } from 'src/app/entities/dtos/service/conNom271.dto';
import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SitedsClient, SitedsServices } from 'src/clients/siteds.client';
import { SitedsConstants } from 'src/general/contants/siteds.constants';
import { DocumentTypeMapper, SitedsDocumentType } from 'src/general/enums/patientInfo.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { TextHelper } from 'src/general/helpers/text.helper';
import { X12ManagerBuild } from 'src/general/managers/x12/x12.manager';

type GetSitedsPatientInput = {
  coExcepcion: string;
  txNombre: string;
  coIafa: string;
  txPeticion: string;
};

type GetSitedsPatientOutput = {
  coError: string;
  txNombre: string;
  coIafa: string;
  txRespuesta: string;
};

export interface IGetSitedsPatientRepository {
  execute(patient: PatientDTO, iafaId: string, correlative: string): Promise<ConNom271DTO>;
}

export class GetSitedsPatientRepository implements IGetSitedsPatientRepository {
  private readonly x12Manager = X12ManagerBuild.buildConNom();

  async execute(patient: PatientDTO, iafaId: string, correlative: string): Promise<ConNom271DTO> {
    const methodPayload = this.parseInput(patient, iafaId, correlative);
    const instance = await SitedsClient.getInstance();
    const rawResult = await instance.client.call<GetSitedsPatientOutput>(
      SitedsServices.INSURANCE_DETAILS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(patient: PatientDTO, iafaId: string, correlative: string): GetSitedsPatientInput {
    const normalizedDocumentType = patient.documentType
      ? DocumentTypeMapper.getSitedsDocumentType(patient.documentType)
      : SitedsDocumentType.DNI;

    const payload: ConAse270DTO = {
      iafaId,
      correlative,
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
      coIafa: iafaId,
      txPeticion: x12Payload,
    };
  }

  private parseOutput(rawResult: GetSitedsPatientOutput): ConNom271DTO {
    const { coError, txRespuesta } = rawResult ?? {};

    if (!SitedsConstants.SUCCESS_CODES.has(coError)) {
      const errorMessage = SitedsConstants.ERROR_MESSAGES[coError as keyof typeof SitedsConstants.ERROR_MESSAGES];
      throw ErrorModel.notFound({ message: errorMessage ?? 'Unkown error consuming siteds' });
    }

    const result = this.x12Manager.decode(txRespuesta);
    return result;
  }
}

export class GetSitedsPatientRepositoryMock implements IGetSitedsPatientRepository {
  async execute(): Promise<ConNom271DTO> {
    return {
      ipressId: '20001',
      iafaId: '980001C',
      date: '20171025',
      time: '10:04:53',
      shortDate: '171025',
      shortTime: '10:0',
      correlative: '250000001',
      transactionId: '271',
      groupControlNumber: '041210389',
      transactionSetControlNumber: '70545879',
      purposeCode: '11',
      senderEntityType: '2',
      receiverEntityType: '2',
      receiverTaxId: '20100054184',
      details: [
        {
          patientEntityType: '1',
          patientLastName: 'DELGADO',
          patientFirstName: 'MERY ISABEL',
          patientMemberId: '9468332',
          patientSecondLastName: 'EDUARDO',
          patientStatusCode: '1',
          patientDocumentType: '1',
          patientDocumentNumber: '72208776',
          patientContractNumber: '1',
          productCode: 'S',
          productDescription: 'SALUD EPS',
          sctrNumber: '20250101',
          relationshipCode: '1',
          planNumber: '114255',
          birthDate: '19950415',
          gender: '2',
          maritalStatus: '1',
          contractorEntityType: '2',
          contractorLastName: 'LADRILLERA EL DIAMANTE S.A.C.',
          contractorFirstName: 'LADRILLERA EL DIAMANTE S.A.C.',
          contractorSecondLastName: 'LADRILLERA EL DIAMANTE S.A.C.',
          contractorDocumentType: '8',
          contractorIdQualifier: 'XX5',
          contractorId: '20120877055',
        },
      ],
    };
  }
}
