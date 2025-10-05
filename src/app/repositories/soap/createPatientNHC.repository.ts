import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { InetumClient, InetumUserServices } from 'src/clients/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
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
    await instance.user.call<CreatePatientNHCOutput>(InetumUserServices.CREATE_PATIENT_NHC, methodPayload);
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
}

export class CreatePatientNHCRepositoryMock implements ICreatePatientNHCRepository {
  async execute(): Promise<void> {
    return await Promise.resolve();
  }
}
