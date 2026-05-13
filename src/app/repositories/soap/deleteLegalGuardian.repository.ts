import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { AppointmentTransactionResultDTO } from 'src/app/entities/dtos/service/appointmentTransactionResult.dto';
import { InetumClient, InetumUserServices } from 'src/clients/inetum/inetum.client';
import { EnvHelper } from 'src/general/helpers/env.helper';

type DeleteLegalGuardianInput = {
  usuario: string;
  contrasena: string;
  eliminarRelacionTutelaEntrada: {
    IdPacienteFmp: string;
    IdTutorFmp: string;
  };
};

type DeleteLegalGuardianOutput = {
  EliminarRelacionTutelaResult: {
    DescripcionError: string;
    CodResultado: number;
  };
};

export interface IDeleteLegalGuardianRepository {
  execute(fmpId: PatientDM['fmpId'], legalGuardianId: string): Promise<AppointmentTransactionResultDTO>;
}

export class DeleteLegalGuardianRepository implements IDeleteLegalGuardianRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId'], legalGuardianId: string): Promise<AppointmentTransactionResultDTO> {
    const methodPayload = this.generateInput(fmpId, legalGuardianId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.user.call<DeleteLegalGuardianOutput>(
      InetumUserServices.DELETE_LEGAL_GUARDIAN,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private generateInput(fmpId: PatientDM['fmpId'], legalGuardianId: string): DeleteLegalGuardianInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      eliminarRelacionTutelaEntrada: {
        IdPacienteFmp: fmpId,
        IdTutorFmp: legalGuardianId,
      },
    };
  }

  private parseOutput(rawResult: DeleteLegalGuardianOutput): AppointmentTransactionResultDTO {
    return {
      errorCode: Number(rawResult.EliminarRelacionTutelaResult.CodResultado),
      errorDescription: rawResult.EliminarRelacionTutelaResult.DescripcionError ?? null,
    };
  }
}

export class DeleteLegalGuardianRepositoryMock implements IDeleteLegalGuardianRepository {
  async execute(): Promise<AppointmentTransactionResultDTO> {
    return Promise.resolve({
      errorCode: 0,
      errorDescription: null,
    });
  }
}
