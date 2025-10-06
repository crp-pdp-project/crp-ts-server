import { PatientConfirmationDTO } from 'src/app/entities/dtos/service/patientConfirmation.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { InetumClient, InetumUserServices } from 'src/clients/inetum/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { DateHelper } from 'src/general/helpers/date.helper';
import { EnvHelper } from 'src/general/helpers/env.helper';

type ConfirmPatientInput = {
  usuario: string;
  contrasena: string;
  peticionAltaUsuario: {
    Nombre: string;
    Apellido1: string;
    Apellido2?: string;
    FechaNacimiento: string;
    IdTipoDocIdentidad: string;
    DocIdentidad: string;
    Sexo: string;
    CorreoElectronico?: string;
    IdPais?: string;
    IdProvincia?: string;
    IdPoblacion?: string;
    CodigoPostal?: string;
    IdTipoVia?: string;
    Via?: string;
    Numero?: string;
    Otros?: string;
    Movil?: string;
    IdCentro: string;
    CanalEntrada: string;
  };
};

type ConfirmPatientOutput = {
  AltaResult: {
    IdPaciente: string;
    AcudirCentro: string;
  };
};

export interface IConfirmPatientRepository {
  execute(patient: PatientExternalDTO): Promise<PatientConfirmationDTO>;
}

export class ConfirmPatientRepository implements IConfirmPatientRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(patient: PatientExternalDTO): Promise<PatientConfirmationDTO> {
    const methodPayload = this.parseInput(patient);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.user.call<ConfirmPatientOutput>(InetumUserServices.CONFIRM_PATIENT, methodPayload);
    return this.parseOutput(rawResult);
  }

  private parseInput(patient: PatientExternalDTO): ConfirmPatientInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionAltaUsuario: {
        Nombre: patient.firstName ?? '',
        Apellido1: patient.lastName ?? '',
        Apellido2: patient.secondLastName ?? undefined,
        FechaNacimiento: patient.birthDate ? DateHelper.toFormatDate(patient.birthDate, 'inetumDate') : '',
        IdTipoDocIdentidad: patient.documentType ? String(patient.documentType) : '',
        DocIdentidad: patient.documentNumber ?? '',
        Sexo: patient.gender ?? '',
        CorreoElectronico: patient.email ?? undefined,
        IdPais: patient.countryId ?? undefined,
        IdProvincia: patient.provinceId ?? undefined,
        IdPoblacion: patient.districtId ?? undefined,
        CodigoPostal: patient.zipCode ?? undefined,
        IdTipoVia: patient.addressType ?? undefined,
        Via: patient.address ?? undefined,
        Numero: patient.addressNumber ?? undefined,
        Otros: patient.addressAditional ?? undefined,
        Movil: patient.phone ?? undefined,
        IdCentro: patient.centerId ?? CRPConstants.CENTER_ID,
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: ConfirmPatientOutput): PatientConfirmationDTO {
    if (!rawResult.AltaResult?.IdPaciente) {
      throw ErrorModel.unprocessable({ detail: ClientErrorMessages.PATIENT_NOT_CREATED });
    }

    return {
      fmpId: String(rawResult.AltaResult.IdPaciente),
      confirmInCenter: rawResult.AltaResult.AcudirCentro !== 'N',
    };
  }
}

export class ConfirmPatientRepositoryMock implements IConfirmPatientRepository {
  async execute(): Promise<PatientConfirmationDTO> {
    return {
      fmpId: '239254',
      confirmInCenter: false,
    };
  }
}
