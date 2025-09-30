import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { InetumClient, InetumUserServices } from 'src/clients/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { EnvHelper } from 'src/general/helpers/env.helper';

type CreatePatientNHCInput = {
  usuario: string;
  contrasena: string;
  idPacienteFmp: string;
  codCentro: string;
  canalEntrada: string;
};

type CreatePatientNHCOutput = {
  CrearPacienteEnCentrosResult: string;
};

export interface ICreatePatientNHCRepository {
  execute(fmpId: PatientDM['fmpId']): Promise<void>;
}

export class CreatePatientNHCRepository implements ICreatePatientNHCRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId']): Promise<void> {
    const methodPayload = this.parseInput(fmpId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.user.call<CreatePatientNHCOutput>(
      InetumUserServices.CREATE_PATIENT_NHC,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(fmpId: PatientDM['fmpId']): CreatePatientNHCInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      idPacienteFmp: fmpId,
      codCentro: CRPConstants.CENTER_ID,
      canalEntrada: CRPConstants.ORIGIN,
    };
  }

  private parseOutput(rawResult: CreatePatientNHCOutput): void {
    if (!rawResult.CrearPacienteEnCentrosResult || rawResult.CrearPacienteEnCentrosResult === 'false') {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.PATIENT_NOT_CREATED });
    }
  }
}

export class CreatePatientNHCRepositoryMock implements ICreatePatientNHCRepository {
  async execute(): Promise<void> {
    return await Promise.resolve();
  }
}
