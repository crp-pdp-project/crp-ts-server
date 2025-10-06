import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { GuaranteeLetterDTO } from 'src/app/entities/dtos/service/guaranteeLetter.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { CRPDocumentType, DocumentTypeMapper, PatientDocumentType } from 'src/general/enums/patientInfo.enum';

type GetGuaranteeLetterInput = {
  TipoDocumento: CRPDocumentType;
  NroDocumento: PatientDM['documentNumber'];
};

type GetGuaranteeLetterOutput = {
  data: {
    nroCartaGarantia: string;
    nroCartaGarantia_ref?: string;
    servicio: string;
    financiador: string;
    tipocg: string;
    cobertura_igv: string;
    estado: string;
    motivo_rechazo?: string;
    comentario_obs?: string;
    procedimiento: string;
  }[];
  esCorrecto: boolean;
};

export interface IGetGuaranteeLetterRepository {
  execute(
    documentType: PatientDocumentType,
    documentNumber: PatientDM['documentNumber'],
  ): Promise<GuaranteeLetterDTO[]>;
}

export class GetGuaranteeLetterRepository implements IGetGuaranteeLetterRepository {
  private readonly crp = CRPClient.instance;

  async execute(
    documentType: PatientDocumentType,
    documentNumber: PatientDM['documentNumber'],
  ): Promise<GuaranteeLetterDTO[]> {
    const methodPayload = this.parseInput(documentType, documentNumber);
    const rawResult = await this.crp.call<GetGuaranteeLetterOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.LIST_GUARANTEE_LETTERS,
      body: methodPayload,
    });
    return this.parseOutput(rawResult);
  }

  private parseInput(
    documentType: PatientDocumentType,
    documentNumber: PatientDM['documentNumber'],
  ): GetGuaranteeLetterInput {
    return {
      TipoDocumento: DocumentTypeMapper.getCrpDocumentType(documentType),
      NroDocumento: documentNumber,
    };
  }

  private parseOutput(rawResult: GetGuaranteeLetterOutput): GuaranteeLetterDTO[] {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.badRequest({ message: 'Did not found any letters' });
    }

    const letters: GuaranteeLetterDTO[] =
      data?.map((letter) => ({
        letterNumber: letter.nroCartaGarantia,
        referenceNumber: letter.nroCartaGarantia_ref ?? null,
        service: letter.servicio,
        insurance: letter.financiador,
        procedureType: letter.tipocg,
        procedure: letter.procedimiento ?? null,
        coveredAmount: Number(letter.cobertura_igv ?? 0),
        status: letter.estado,
        rejectReason: letter.motivo_rechazo ?? null,
        notes: letter.comentario_obs ?? null,
      })) || [];

    return letters;
  }
}

export class GetGuaranteeLetterRepositoryMock implements IGetGuaranteeLetterRepository {
  async execute(): Promise<GuaranteeLetterDTO[]> {
    return [
      {
        letterNumber: '2024DI026736',
        referenceNumber: null,
        service: 'CIRUGÍA VASCULAR',
        insurance: 'PLANSALUD',
        procedureType: 'AMBULATORIO',
        procedure: 'ECO-DOPPLER COLOR - VENOSO EXTREMIDADES BILATERAL',
        coveredAmount: 654.9,
        status: 'APROBADO',
        rejectReason: null,
        notes: null,
      },
    ];
  }
}
