import type { PatientDM } from 'src/app/entities/dms/patients.dm';
import type { PatientLegalGuardianDTO } from 'src/app/entities/dtos/service/patientLegalGuardian.dto';
import { InetumClient, InetumUserServices } from 'src/clients/inetum/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';

type GetLegalGuardiansInput = {
  usuario: string;
  contrasena: string;
  idPaciente: string;
  codCentro: string;
};

type GetLegalGuardiansOutput = {
  ObtenerTutoresDePacienteResult: {
    TutorRespuesta: {
      IdTutorFmp: string;
      IdTipoDocIdentidad: string;
      DocIdentidad: string;
      Apellido1: string;
      Apellido2?: string | null;
      Nombre: string;
      Movil?: string | null;
      Email?: string | null;
    }[];
  };
};

export interface IGetLegalGuardiansRepository {
  execute(fmpId: PatientDM['fmpId']): Promise<PatientLegalGuardianDTO[]>;
}

export class GetLegalGuardiansRepository implements IGetLegalGuardiansRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId']): Promise<PatientLegalGuardianDTO[]> {
    const methodPayload = this.parseInput(fmpId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.user.call<GetLegalGuardiansOutput>(
      InetumUserServices.LIST_LEGAL_GUARDIANS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(fmpId: PatientDM['fmpId']): GetLegalGuardiansInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      idPaciente: fmpId,
      codCentro: CRPConstants.CENTER_ID,
    };
  }

  private parseOutput(rawResult: GetLegalGuardiansOutput): PatientLegalGuardianDTO[] {
    let result = rawResult.ObtenerTutoresDePacienteResult?.TutorRespuesta ?? [];
    result = Array.isArray(result) ? result : [result];

    const LegalGuardians: PatientLegalGuardianDTO[] = result.map((legalGuardian) => ({
      legalGuardianId: legalGuardian.IdTutorFmp,
      firstName: legalGuardian.Nombre,
      lastName: legalGuardian.Apellido1,
      secondLastName: legalGuardian.Apellido2 ?? null,
      documentNumber: legalGuardian.DocIdentidad,
      documentType: Number(legalGuardian.IdTipoDocIdentidad),
      email: legalGuardian.Email ?? null,
      phone: legalGuardian.Movil ?? null,
    }));

    return LegalGuardians;
  }
}

export class GetLegalGuardiansRepositoryMock implements IGetLegalGuardiansRepository {
  async execute(): Promise<PatientLegalGuardianDTO[]> {
    return Promise.resolve([
      {
        legalGuardianId: '131202',
        firstName: 'TEST',
        lastName: 'TEST',
        secondLastName: null,
        documentNumber: '88888888',
        documentType: 14,
        email: null,
        phone: null,
      },
    ]);
  }
}
