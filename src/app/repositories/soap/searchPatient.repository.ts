import { PatientDTO } from 'src/app/entities/dtos/service/patient.dto';
import { PatientExternalDTO } from 'src/app/entities/dtos/service/patientExternal.dto';
import { InetumClient, InetumFmpServices } from 'src/clients/inetum.client';
import { DateHelper } from 'src/general/helpers/date.helper';

type SearchPatientInput = {
  paciente: {
    Nombre?: string;
    Apellido1?: string;
    Apellido2?: string;
    DocIdentidad?: string;
    FechaNacimiento?: string;
    IdTipoDocIdentidad?: string;
    Identificador?: string;
  };
};

type SearchPatientOutput = {
  ConsultaPacientesResult: {
    Paciente: {
      Id: string;
      Nombre: string;
      Apellido1: string;
      Apellido2: string | null;
      IdTipoDocIdentidad: string;
      DocIdentidad: string;
      FechaNacimiento: string;
      IdSexo: string;
      Email: string | null;
      Telefono3: string | null;
      CodPostal: string | null;
      Direccion: string | null;
      NumDomicilio: string | null;
      Observaciones: string | null;
      IdPaisResidencia: string | null;
      IdProvinciaResidencia: string | null;
      IdLocalidadResidencia: string | null;
      IdTipoViaDomicilio: string | null;
      PacienteCentro: {
        PacienteCentro: {
          Centro?: { CodCentroIdc?: string | null };
          Origen?: string | null;
          Nhc: string | null;
        };
      };
    };
  };
};

export interface ISearchPatientRepository {
  execute(patient: PatientDTO): Promise<PatientExternalDTO>;
}

export class SearchPatientRepository implements ISearchPatientRepository {
  async execute(patient: PatientDTO): Promise<PatientExternalDTO> {
    const methodPayload = this.parseInput(patient);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.fmp.call<SearchPatientOutput>(InetumFmpServices.SEARCH_PATIENT, methodPayload);
    return this.parseOutput(rawResult);
  }

  private parseInput(patient: PatientDTO): SearchPatientInput {
    return {
      paciente: {
        Nombre: patient.firstName,
        Apellido1: patient.lastName,
        Apellido2: patient.secondLastName ?? undefined,
        DocIdentidad: patient.documentNumber,
        IdTipoDocIdentidad: patient.documentType ? String(patient.documentType) : undefined,
        Identificador: patient.fmpId ? String(patient.fmpId) : undefined,
        FechaNacimiento: patient.birthDate ? DateHelper.toFormatDate(patient.birthDate, 'inetumDate') : undefined,
      },
    };
  }

  private parseOutput(rawResult: SearchPatientOutput): PatientExternalDTO {
    const basePatient = rawResult.ConsultaPacientesResult?.Paciente;
    const firstCenter = basePatient?.PacienteCentro?.PacienteCentro;

    return {
      fmpId: String(basePatient?.Id),
      nhcId: firstCenter?.Nhc ?? null,
      firstName: basePatient?.Nombre,
      lastName: basePatient?.Apellido1,
      secondLastName: basePatient?.Apellido2 ?? null,
      gender: basePatient?.IdSexo,
      birthDate: basePatient?.FechaNacimiento,
      documentNumber: basePatient?.DocIdentidad,
      documentType: Number(basePatient?.IdTipoDocIdentidad),
      // email: basePatient?.Email ?? null,
      // phone: basePatient?.Telefono3 ?? null,
      email: 'renarux.92@gmail.com',
      phone: '962943323',
      centerId: firstCenter?.Centro?.CodCentroIdc ?? firstCenter?.Origen ?? '',
      address: basePatient?.Direccion ?? null,
      addressAditional: basePatient?.Observaciones ?? null,
      addressNumber: basePatient?.NumDomicilio ? String(basePatient?.NumDomicilio) : null,
      addressType: basePatient?.IdTipoViaDomicilio ? String(basePatient?.IdTipoViaDomicilio) : null,
      countryId: basePatient?.IdPaisResidencia ? String(basePatient?.IdPaisResidencia) : null,
      provinceId: basePatient?.IdProvinciaResidencia ? String(basePatient?.IdProvinciaResidencia) : null,
      districtId: basePatient?.IdLocalidadResidencia ? String(basePatient?.IdLocalidadResidencia) : null,
      zipCode: basePatient?.CodPostal ? String(basePatient?.CodPostal) : null,
    };
  }
}

export class SearchPatientRepositoryMock implements ISearchPatientRepository {
  async execute(): Promise<PatientExternalDTO> {
    return {
      fmpId: '239254',
      nhcId: '00733480',
      firstName: 'MARIA DEL PILAR LILIANA',
      lastName: 'ELESPURU',
      secondLastName: 'BRICENO DE BARRAZA',
      gender: 'M',
      documentType: 14,
      documentNumber: '07583658',
      birthDate: '1951-10-26T00:00:00',
      email: null,
      phone: '999579592',
      centerId: '051010100',
      address: 'VENECIA',
      addressAditional: null,
      addressNumber: '20930',
      addressType: '45',
      countryId: null,
      provinceId: null,
      districtId: '150130',
      zipCode: null,
    };
  }
}
