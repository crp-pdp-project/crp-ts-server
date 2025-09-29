import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp.client';
import { HealthInsuranceConstants } from 'src/general/contants/healthInsurance.constants';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { CRPShortDocumentType, DocumentTypeMapper, PatientDocumentType } from 'src/general/enums/patientInfo.enum';

type InformInsuranceInterestInput = {
  celular: string;
  consulta: string;
  correo: string;
  fechaNacimiento: string;
  nombres: string;
  numeroDocumento: string;
  tipoDocumento: CRPShortDocumentType;
};

type InformInsuranceInterestOutput = {
  esCorrecto: boolean;
};

export interface IInformInsuranceInterestRepository {
  execute(externalPatient: PatientExternalDTO): Promise<void>;
}

export class InformInsuranceInterestRepository implements IInformInsuranceInterestRepository {
  private readonly crp = CRPClient.instance;

  async execute(externalPatient: PatientExternalDTO): Promise<void> {
    const methodPayload = this.parseInput(externalPatient);
    const rawResult = await this.crp.call<InformInsuranceInterestOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.PAY_CLINIC_INSURANCE,
      body: methodPayload,
    });
    this.checkOutput(rawResult);
  }

  private parseInput(externalPatient: PatientExternalDTO): InformInsuranceInterestInput {
    return {
      celular: externalPatient.phone ?? '',
      consulta: HealthInsuranceConstants.DEFAULT_MESSAGE,
      correo: externalPatient.email ?? '',
      fechaNacimiento: externalPatient.birthDate ?? '',
      nombres: `${externalPatient.firstName} ${externalPatient.lastName}`,
      numeroDocumento: externalPatient.documentNumber ?? '',
      tipoDocumento: DocumentTypeMapper.getCrpShortDocumentType(externalPatient.documentType ?? PatientDocumentType.DNI),
    };
  }

  private checkOutput(rawResult: InformInsuranceInterestOutput): void {
    const { esCorrecto } = rawResult;

    if (!esCorrecto) {
      throw ErrorModel.badRequest({ message: 'Error informing CRP' });
    }
  }
}

export class InformInsuranceInterestRepositoryMock implements IInformInsuranceInterestRepository {
  async execute(): Promise<void> {
    await Promise.resolve();
  }
}
